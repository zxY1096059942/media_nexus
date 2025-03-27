package com.ruoyi.framework.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisPublisher {
	
	@Autowired
	private StringRedisTemplate stringRedisTemplate;
	
	@Autowired
	private RedisTemplate redisTemplate;
	public void publishMessage(String topic,String message) {		
		stringRedisTemplate.convertAndSend(topic, message);		
	}

	public Long getListenerNum(String topic) {
				
		Object subscribers=redisTemplate.getConnectionFactory().getConnection().execute("PUBSUB NUMSUB "+topic);
		
	    if(subscribers!=null) {
	     return Long.parseLong( ((String[])subscribers)[1]);
	    }
	    return 0L;
	}
}
