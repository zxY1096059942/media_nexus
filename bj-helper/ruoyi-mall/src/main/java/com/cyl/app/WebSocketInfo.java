package com.cyl.app;

import lombok.Data;

import javax.websocket.Session;

@Data
public class WebSocketInfo {

	 private Session session;
	 
	 private String memberId;
	 
	 private String deviceId;
	 
	 private long lastHeartBeatTime;
	 
	 private String topic;
}
