package com.cyl.app;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.springframework.beans.BeansException;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson2.JSONObject;
import com.cyl.helper.domain.entity.HelperAppReport;
import com.cyl.helper.domain.entity.HelperLog;
import com.cyl.helper.service.HelperAppReportService;
import com.cyl.helper.service.HelperLogService;
import com.ruoyi.common.utils.spring.SpringUtils;

import lombok.extern.slf4j.Slf4j;

@Component
@ServerEndpoint("/h5/ws/{memberId}/{deviceId}")
@Slf4j
public class WebSocketServer implements MessageDelegate {
	/** 用来记录当前在线连接数。设计成线程安全的。 */
	private static AtomicInteger onlineCount = new AtomicInteger(0);
	private static long sessionData = 60 * 60 * 24;// TODO 可调整
	private static String topicKey = AppTopic.APP_OWNER_TOPIC;
	private static String GLOBAL_CLIENT_NUM="app_client_num";
	/** 用于保存uri对应的连接服务，{uri:WebSocketServer}，设计成线程安全的 */
	private static ConcurrentHashMap<String, WebSocketServer> webSocketServerMAP = new ConcurrentHashMap<>();
	private Session session;// 与某个客户端的连接会话，需要通过它来给客户端发送数据
	private String memberId; // 客户端消息发送者
	private String deviceId; // 连接的设备Id
	private long lastHeartBeatTime;
//	private String topic;
	private MessageListenerAdapter adapter;
	private HelperAppReportService service;

	/**
	 * 连接建立成功时触发，绑定参数
	 * 
	 * @param session  可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
	 * @param memberId
	 * @param deviceId
	 * @throws IOException
	 */
	@OnOpen
	public void onOpen(Session session, @PathParam("memberId") String memberId, @PathParam("deviceId") String deviceId)
			throws IOException {
		this.session = session;
		this.memberId = memberId;
		this.deviceId = deviceId;
		MessageModel msgModel = MessageModelHelper.connected(memberId, deviceId);
		log.info("WS - 客户 [ {} ] 通过设备 [ {} ] 建立链接.", memberId, deviceId);
		try {
			WebSocketServer oldSocketServer = webSocketServerMAP.get(memberId);
			if (oldSocketServer != null) { // 同样的账户连接已经在线，则把原来的挤下线。
				sendMessageBySession(MessageModelHelper.kickOff(oldSocketServer.memberId, oldSocketServer.deviceId),
						oldSocketServer.session);
				oldSocketServer.session.close();// 关闭连接，触发关闭连接方法onClose()
			}
			webSocketServerMAP.put(memberId, this);
			addOnlineCount(); // 在线数加1
			String topic = AppTopic.genOwnerTopic(memberId);
			String key = topicKey + memberId;
//			((RedisUtils) SpringContextUtils.getBean("redisUtils")).lSet(key, memberId, sessionData);
			this.adapter = new MessageListenerAdapter(new MessageListener() {

				@Override
				public void onMessage(Message message, byte[] pattern) {
					handleMessage(new String(message.getBody(), StandardCharsets.UTF_8));
				}

			});
			subscribeRedisTopic(memberId, topic, this.adapter);// 这里订阅redis中的信息

		} catch (Exception e) {
			msgModel.setType(MessageModelHelper.MESSAGETYPE_CONNECTERR);
			msgModel.setMessage(e.getMessage());// 后期进行分装，避免安全隐患 TODO
			log.error("WS Link Error ", e);
		} finally {
			sendMessageBySession(msgModel, session);
		}

	}

	/**
	 * *连接关闭时触发，注意不能向客户端发送消息了
	 * 
	 * @throws IOException
	 */
	@OnClose
	public void onClose() throws IOException {

		try {
			log.info("WS - 客户[ {} ]连接关闭", memberId);
			webSocketServerMAP.remove(this.memberId);
			reduceOnlineCount(); // 在线数减1
			String topic = AppTopic.genOwnerTopic(memberId);
			String key = topicKey + memberId;
//			((RedisUtils) SpringContextUtils.getBean("redisUtils")).lSet(key, memberId, sessionData); // TODO 需要调整
			unSubscribeRedisTopic(this.memberId, topic, this.adapter);
		} catch (Exception e) {
			log.error("WS Close Error ", e);
		}
	}

	/**
	 * 收到客户端消息后触发
	 *
	 * @param message 客户端发送过来的消息
	 * @param session
	 * @throws IOException
	 */
	@OnMessage
	public void onMessage(String message, Session session) {

		log.info("WS - 收到[ {} ] 的消息：{}", memberId, message);

		MessageModel msgModel = new MessageModel();
		try {
			JSONObject jsonInfo = JSONObject.parseObject(message);
			String msg = jsonInfo.getString("message");
			String msgType = jsonInfo.getString("type");
			msgModel.setMessage(msg);
			msgModel.setType(msgType);
			msgModel.setCode(jsonInfo.getString("code"));
			switch (msgType) {
			case MessageModelHelper.MESSAGETYPE_HEARTBEAT:
				this.lastHeartBeatTime = System.currentTimeMillis();
				break;
			case MessageModelHelper.MESSAGETYPE_INFO:
				// 正常的消息接收内容
				handleReportMessage(msgModel);
				break;
			}

		} catch (Exception e) {
			msgModel.setType(MessageModelHelper.MESSAGETYPE_ERROR);
			msgModel.setMessage(e.getMessage());
			log.error("WS Receive Error ", e);
		} finally {
			sendMessageBySession(msgModel, session);
		}

	}

	/**
	 * 通信发生错误时触发
	 *
	 * @param session
	 * @param error
	 */
	@OnError
	public void onError(Session session, Throwable error) {
		try {
			log.info("WS - 客户 [ {} ]通信发生错误，连接关闭", memberId);
			webSocketServerMAP.remove(this.memberId);
		} catch (Exception e) {
			log.error("WS Connect  Error ", e);
		}
	}

	/**
	 * 获取在线连接数
	 * 
	 * @return
	 */
	public static int getOnlineCount() {
		// 集群中需要采用redis 更新计算器
//		try {
//			StringRedisTemplate template = SpringUtils.getBean("stringRedisTemplate");
//			int num=Integer.parseInt(template.opsForValue().get(GLOBAL_CLIENT_NUM));
//			return num;
//		} catch (BeansException e) {
//			log.error("计数失败 ", e);
//		} catch (NumberFormatException e) {
//			log.error("计数失败 ", e);
//		}
		return onlineCount.get();
	}

	/**
	 * 原子性操作，在线连接数加一
	 */
	public static void addOnlineCount() {
		// 集群中需要采用redis 更新计算器
		try {
			onlineCount.getAndIncrement();
			StringRedisTemplate template = SpringUtils.getBean("stringRedisTemplate");
			template.opsForValue().increment(GLOBAL_CLIENT_NUM,1);
		} catch (BeansException e) {
			log.error("计数失败 ", e);
		}
	}

	/**
	 * 原子性操作，在线连接数减一
	 */
	public static void reduceOnlineCount() {
		// 集群中需要采用redis 更新计算器
		try {
			onlineCount.getAndDecrement();
			StringRedisTemplate template = SpringUtils.getBean("stringRedisTemplate");
			template.opsForValue().decrement(GLOBAL_CLIENT_NUM,1);
		} catch (BeansException e) {
			log.error("计数失败 ", e);
		}
		
	}

	private void handleReportMessage(MessageModel msgModel) throws Exception {

		try {
			log.info("handle Report Message success for {}", msgModel);
			// TODO 处理上报的消息
			HelperAppReport helperAppReport = new HelperAppReport();
			helperAppReport.setDeviceid(deviceId);
			helperAppReport.setMemberId(Long.valueOf(memberId));
			helperAppReport.setType(msgModel.getType());
			helperAppReport.setCode(msgModel.getCode());
			helperAppReport.setReportData(msgModel.getMessage());
			helperAppReport.setCreateBy(2L);
			switch (msgModel.getCode()) {
			case MessageModelHelper.MESSAGECODE_200:				
			case MessageModelHelper.MESSAGECODE_201:				
			case MessageModelHelper.MESSAGECODE_202:
				if (service != null) {
					service.insert(helperAppReport);
				} else {
					HelperAppReportService serv = SpringUtils.getBean("helperAppReportService");
					serv.insert(helperAppReport);
				}
				break;
			case MessageModelHelper.MESSAGECODE_210:
				// TODO 这里需要根据下发的策略，进行策略执行状态的更新，比如用户级的策略更新
				break;	
			case MessageModelHelper.MESSAGECODE_300:				
			case MessageModelHelper.MESSAGECODE_301:				
			case MessageModelHelper.MESSAGECODE_302:
			case MessageModelHelper.MESSAGECODE_303:
			case MessageModelHelper.MESSAGECODE_304:
			case MessageModelHelper.MESSAGECODE_305:
				if (service != null) {
					service.insert(helperAppReport);
				} else {
					HelperAppReportService serv = SpringUtils.getBean("helperAppReportService");
					serv.insert(helperAppReport);
				}
				break;
			case MessageModelHelper.MESSAGECODE_310:
				// TODO 这里需要根据下发的策略，进行策略执行状态的更新，比如用户级的策略更新
				break;		
			default:
				// TODO 写入系统日志中
				HelperLog helperLog=new HelperLog();
				helperLog.setBusinessType(0);
				helperLog.setTitle("APP端系统异常");
				helperLog.setOperatorType(2);
				helperLog.setOperName(memberId);
				helperLog.setStatus(1);				
				helperLog.setErrorMsg(msgModel.getMessage());
				helperLog.setMethod(deviceId);
				helperLog.setRequestMethod(msgModel.getCode());
				helperLog.setOperTime(LocalDateTime.now());
				HelperLogService logserv = SpringUtils.getBean("helperLogService");
				logserv.insert(helperLog);
				
			}
			
			
		} catch (Exception e) {
			log.error("Handle Report Message Error ", e);
			throw new Exception("Hadle Report Message Error");
		}

	}
	/**
	 ** 将接收到订阅的消息 发送给相应的终端用户
	 */
	@Override
	public void handleMessage(String messageBody) {

		log.info("handle [{}] Subscribe Message，消息内容 ：{}", memberId, messageBody);
		MessageModel msgModel = new MessageModel();
		msgModel.setMemberId(memberId);
		msgModel.setMessage(messageBody);
		msgModel.setType(MessageModelHelper.MESSAGETYPE_INFO);
		WebSocketServer.sendMessage(msgModel, memberId);

	}
	
	private void sendMessageBySession(MessageModel msgModel, Session session) {

		try {

			session.getBasicRemote().sendText(JSONObject.toJSONString(msgModel));

		} catch (Exception e) {
			log.error("WS Send Message Error {}", e.getMessage(), e);
		} finally {

		}

	}

	public static void sendMessage(MessageModel msgModel, String memberId) {

		try {
			WebSocketServer socketServer = webSocketServerMAP.get(memberId);
			if (socketServer != null) {
				socketServer.session.getBasicRemote().sendText(JSONObject.toJSONString(msgModel));
			}

		} catch (Exception e) {
			log.error("WS Send Message Error {}", e.getMessage(), e);
		}

	}

	public static void sendMessageAll(MessageModel msgModel) {

		try {
			for (Map.Entry<String, WebSocketServer> entry : webSocketServerMAP.entrySet()) {
				if (entry.getValue() != null) {
					entry.getValue().session.getBasicRemote().sendText(JSONObject.toJSONString(msgModel));
				}

			}

		} catch (Exception e) {
			log.error("WS Send Messages Error {}", e.getMessage(), e);
		}

	}

	public static void subscribeRedisTopic(String memberId, String topic, MessageListenerAdapter adapter) {

		RedisMessageListenerContainer container = SpringUtils.getBean(RedisMessageListenerContainer.class);
		container.addMessageListener(adapter, new ChannelTopic(topic));
		container.addMessageListener(adapter, new ChannelTopic(AppTopic.APP_TOPIC));
		log.info("WS - {} 订阅Topic:{} ", memberId, topic);
		
	}

	public static void unSubscribeRedisTopic(String memberId, String topic, MessageListenerAdapter adapter) {
		
		RedisMessageListenerContainer container = SpringUtils.getBean(RedisMessageListenerContainer.class);
		container.removeMessageListener(adapter, new ChannelTopic(topic));
		container.removeMessageListener(adapter, new ChannelTopic(AppTopic.APP_TOPIC));
		log.info("WS - {} 取消订阅Topic:{} ", memberId, topic);
		
	}


}
