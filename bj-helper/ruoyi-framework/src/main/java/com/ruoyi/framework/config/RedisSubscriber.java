package com.ruoyi.framework.config;

import java.nio.charset.StandardCharsets;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;
@Service
public class RedisSubscriber implements MessageListener {

	@Override
	public void onMessage(Message message, byte[] pattern) {
		// TODO Auto-generated method stub
		String msg=new String(message.getBody(),StandardCharsets.UTF_8);
		System.out.println("Receive: "+msg);
	}
//	@Autowired
//	private StringRedisTemplate stringRedisTemplate;

}

