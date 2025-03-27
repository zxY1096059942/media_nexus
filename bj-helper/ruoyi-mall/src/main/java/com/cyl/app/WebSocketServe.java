package com.cyl.app;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson2.JSONObject;
import com.cyl.helper.domain.entity.HelperAppReport;
import com.cyl.helper.service.HelperAppReportService;
import com.ruoyi.framework.web.SpringContextUtils;

import lombok.extern.slf4j.Slf4j;

//@Component
//@ServerEndpoint("/h5/ws/{memberId}/{deviceId}")
@Slf4j
public class WebSocketServe implements MessageDelegate{
	/** 用来记录当前在线连接数。设计成线程安全的。 */
	private static AtomicInteger onlineCount = new AtomicInteger(0);
	private static long sessionData = 60 * 60 * 24;// TODO 可调整
	private static String topicKey = AppTopic.APP_OWNER_TOPIC;
	
	/** 用于保存uri对应的连接服务，{uri:WebSocketServer}，设计成线程安全的 */
	private static ConcurrentHashMap<String, WebSocketInfo> webSocketInfoMAP = new ConcurrentHashMap<>();
	private Session session;// 与某个客户端的连接会话，需要通过它来给客户端发送数据
	private String memberId; // 客户端消息发送者
	private String deviceId; // 连接的设备Id
	private MessageListenerAdapter adapter; 
	
    @Autowired
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
			WebSocketInfo oldSocketInfo = webSocketInfoMAP.get(memberId);
			WebSocketInfo socketInfo = new WebSocketInfo();
			socketInfo.setSession(session);
			socketInfo.setMemberId(memberId);
			socketInfo.setDeviceId(deviceId);
			if (oldSocketInfo != null) { // 同样的账户连接已经在线，则把原来的挤下线。
				sendMessageBySession(
						MessageModelHelper.kickOff(oldSocketInfo.getMemberId(), oldSocketInfo.getDeviceId()),
						oldSocketInfo.getSession());
				oldSocketInfo.getSession().close();// 关闭连接，触发关闭连接方法onClose()
			}
			webSocketInfoMAP.put(memberId, socketInfo);
			addOnlineCount(); // 在线数加1
			String topic =AppTopic.genOwnerTopic(memberId);
			String key = topicKey + memberId;
//			((RedisUtils) SpringContextUtils.getBean("redisUtils")).lSet(key, memberId, sessionData);
			this.adapter = new MessageListenerAdapter(new MessageListener(){

				@Override
				public void onMessage(Message message, byte[] pattern) {
					handleMessage(new String(message.getBody(),StandardCharsets.UTF_8));
				}
				
			});
			subscribeRedisTopic(memberId, topic,this.adapter);// 这里订阅redis中的信息

		} catch (Exception e) {
			msgModel.setType(MessageModelHelper.MESSAGETYPE_CONNECTERR);
			msgModel.setMessage(e.getMessage());//后期进行分装，避免安全隐患 TODO
			log.error("WS Link Error ", e);
		} finally {
			sendMessageBySession(msgModel, session);
		}

	}

	/**
	 * 连接关闭时触发，注意不能向客户端发送消息了
	 * 
	 * @throws IOException
	 */
	@OnClose
	public void onClose() throws IOException {

		try {
			log.info("WS - {}连接关闭", memberId);
			webSocketInfoMAP.remove(this.memberId);
			reduceOnlineCount(); // 在线数减1
			String topic =AppTopic.genOwnerTopic(memberId);
			String key = topicKey + memberId;
//			((RedisUtils) SpringContextUtils.getBean("redisUtils")).lSet(key, memberId, sessionData); // TODO 需要调整
			unSubscribeRedisTopic(this.memberId,topic,this.adapter);
		} catch (Exception e) {
			log.error("WS Close Error", e);
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

		log.info("WS - 收到{} 的消息：{}" ,memberId, message);
		WebSocketInfo socketInfo = webSocketInfoMAP.get(this.memberId);
		MessageModel msgModel = new MessageModel();
		try {
			JSONObject jsonInfo = JSONObject.parseObject(message);
			String msg = jsonInfo.getString("message");
			String msgType = jsonInfo.getString("type");
			msgModel.setMessage(msg);
			msgModel.setType(msgType);
			msgModel.setCode(jsonInfo.getString("code"));

			if (MessageModelHelper.MESSAGETYPE_HEARTBEAT.equals(msgType)) {
				socketInfo.setLastHeartBeatTime(System.currentTimeMillis());
			} else {
				// 正常的消息接收内容 
				handleReportMessage(msgModel);
			}
		} catch (Exception e) {
			msgModel.setType(MessageModelHelper.MESSAGETYPE_ERROR); 
			msgModel.setMessage(e.getMessage());
			log.error("WS Receive Error", e);
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
			log.info("WS - {}通信发生错误，连接关闭", memberId);
			webSocketInfoMAP.remove(this.memberId);
		} catch (Exception e) {
			log.error("WS Connect  Error", e);
		}
	}

	/**
	 * 获取在线连接数
	 * 
	 * @return
	 */
	public static int getOnlineCount() {
		return onlineCount.get();
	}

	/**
	 * 原子性操作，在线连接数加一
	 */
	public static void addOnlineCount() {
		onlineCount.getAndIncrement();
	}

	/**
	 * 原子性操作，在线连接数减一
	 */
	public static void reduceOnlineCount() {
		onlineCount.getAndDecrement();
	}
	
	private void handleReportMessage(MessageModel msgModel) throws Exception { 

		try {
			log.info("handle Report Message success for {}",msgModel); 
			// TODO 处理上报的消息
			HelperAppReport helperAppReport =new HelperAppReport();
			helperAppReport.setDeviceid(deviceId);
			helperAppReport.setMemberId(Long.valueOf(memberId));
			helperAppReport.setType(msgModel.getType());
			helperAppReport.setCode(msgModel.getCode());
			helperAppReport.setReportData(msgModel.getMessage());
			if(service!=null) {
			 service.insert(helperAppReport);
			}else {
			 HelperAppReportService serv= SpringContextUtils.getBean("helperAppReportService");
			 serv.insert(helperAppReport);
			}
		} catch (Exception e) {
			log.error("Handle Report Message Error ", e);
			throw new Exception("Hadle Report Message Error");
		} 

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
			WebSocketInfo socketInfo = webSocketInfoMAP.get(memberId);
			if(socketInfo!=null) {
				socketInfo.getSession().getBasicRemote().sendText(JSONObject.toJSONString(msgModel));
			}			

		} catch (Exception e) {
			log.error("WS Send Message Error {}", e.getMessage(), e);
		} 

	}
	
	public static void sendMessageAll(MessageModel msgModel) {

		try {
			for (Map.Entry<String, WebSocketInfo> entry : webSocketInfoMAP.entrySet()) {
				if (entry.getValue()!=null) {
					entry.getValue().getSession().getBasicRemote().sendText(JSONObject.toJSONString(msgModel));
				}

			}
	

		} catch (Exception e) {
			log.error("WS Send Messages Error {}", e.getMessage(), e);
		} 

	}
	
	public static void subscribeRedisTopic(String memberId, String topic,MessageListenerAdapter adapter) {
//		MessageListenerAdapter adapter = SpringContextUtils.getBean(MessageListenerAdapter.class);
//		Map<String ,RedisMessageListenerContainer> map=SpringContextUtils.getBean(RedisMessageListenerContainer.class);
//		Collection<RedisMessageListenerContainer> values=map.values();
//		RedisMessageListenerContainer container =(new ArrayList<>(values)).get(0);
//		
//		System.out.println(map);
		RedisMessageListenerContainer container = SpringContextUtils.getBean("redisMessageListenerContainer");
		
		container.addMessageListener(adapter, new ChannelTopic(topic));
		container.addMessageListener(adapter, new ChannelTopic(AppTopic.APP_TOPIC));
		log.info("WS - {} 订阅Topic:{} ", memberId, topic);
	}

	public static void unSubscribeRedisTopic(String memberId, String topic,MessageListenerAdapter adapter) {
		/*
		 * for (Map.Entry<String, WebSocketInfo> entry : webSocketInfoMAP.entrySet()) {
		 * if (entry.getValue().getTopic().startsWith(topic)) { return; }
		 * 
		 * }
		 */
//		MessageListenerAdapter adapter = SpringContextUtils.getBean(MessageListenerAdapter.class);
		RedisMessageListenerContainer container = SpringContextUtils.getBean("redisMessageListenerContainer");
		container.removeMessageListener(adapter, new ChannelTopic(topic));
		container.removeMessageListener(adapter, new ChannelTopic(AppTopic.APP_TOPIC));
		log.info("WS - {} 取消订阅Topic:{} ", memberId, topic);
	}

	/**
	 ** 将接收到订阅的消息 发送给相应的终端用户
	 */
	@Override
	public void handleMessage(String messageBody) {
		
		log.info("handle Subscribe Message，消息内容 ：" + messageBody);
		 MessageModel msgModel=new MessageModel();
	        msgModel.setMemberId(memberId);
	        msgModel.setMessage(messageBody);
	        msgModel.setType(MessageModelHelper.MESSAGETYPE_INFO);
	        WebSocketServe.sendMessage(msgModel, memberId);
	}
	
	
}
