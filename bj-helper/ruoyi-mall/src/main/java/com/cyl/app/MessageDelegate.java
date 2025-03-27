package com.cyl.app;

public interface MessageDelegate {
	/**
	 *      处理订阅的消息
	 * @param messageBody
	 */
	public void handleMessage(String messageBody) ;
}
