package com.cyl.app;

public class MessageModelHelper {
	public final static String MESSAGETYPE_HEARTBEAT = "ping";
	public final static String MESSAGETYPE_KICKOFF = "kickOff";
	public final static String MESSAGETYPE_CONNECTED = "connected";
	public final static String MESSAGETYPE_CONNECTERR = "connecterr";
	public final static String MESSAGETYPE_INFO = "info";//普通业务消息
	public final static String MESSAGETYPE_ERROR = "error";
	
	public final static String MESSAGECODE_100 = "100";//系统未知异常
	public final static String MESSAGECODE_110 = "110";//系统配置异常（未开启无障碍）
	public final static String MESSAGECODE_119 = "119";//系统异常（系统运行异常）
	public final static String MESSAGECODE_120 = "120";//系统资源不具备异常
	public final static String MESSAGECODE_123 = "123";
	public final static String MESSAGECODE_200 = "200";//子任务执行结果
	public final static String MESSAGECODE_201 = "201";//子任务执行失败
	public final static String MESSAGECODE_202 = "202";//子任务执行终止
	public final static String MESSAGECODE_210 = "210";//子任务策略配置更新成功
	public final static String MESSAGECODE_211 = "211";//子任务策略配置更新失败
	
	public final static String MESSAGECODE_300 = "300";//任务执行结果
	public final static String MESSAGECODE_301 = "301";//任务执行失败
	public final static String MESSAGECODE_302 = "302";//任务执行终止
	public final static String MESSAGECODE_303 = "303";//提现任务执行结果
	public final static String MESSAGECODE_304 = "304";//提现任务执行失败
	public final static String MESSAGECODE_305 = "305";//提现任务执行终止
	public final static String MESSAGECODE_310 = "310";//策略配置更新成功
	public final static String MESSAGECODE_311 = "311";//策略配置更新失败
	public final static String MESSAGECODE_312 = "312";//账户状态更新成功
	public final static String MESSAGECODE_313 = "313";//账户状态更新失败
	
	public static MessageModel kickOff(String memberId, String deviceId) {
		MessageModel m = new MessageModel();
		m.setMessage("重复连接被挤下线了");
		m.setType(MESSAGETYPE_KICKOFF);
		m.memberId = memberId;
		m.deviceId = deviceId;
		return m;
	}

	public static MessageModel connected(String memberId, String deviceId) {
		MessageModel m = new MessageModel();
		m.setMessage("已建立链接");
		m.setType(MESSAGETYPE_CONNECTED);
		m.memberId = memberId;
		m.deviceId = deviceId;
		return m;
	}
}
