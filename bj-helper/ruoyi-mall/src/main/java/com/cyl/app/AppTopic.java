package com.cyl.app;

public class AppTopic {
	public final static String APP_TOPIC="AppStatus";
	public final static String APP_OWNER_TOPIC = "APPOWER";
	
	public final static String genOwnerTopic(String memberId) {
		return  APP_OWNER_TOPIC + ":" + memberId;
	}
}
