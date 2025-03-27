package com.ruoyi.web.controller.app;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cyl.app.AppTopic;
import com.cyl.app.MessageModel;
import com.cyl.app.MessageModelHelper;
import com.cyl.app.WebSocketServe;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.framework.config.RedisPublisher;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/h5/message")
@Slf4j
public class WsController {
	
    @GetMapping("/send/{memberId}")
    public AjaxResult getCode(HttpServletRequest request,@PathVariable String memberId, @RequestParam String message) {
        log.info("{} Send Message :{}",memberId,message);
        MessageModel msgModel=new MessageModel();
        msgModel.setMemberId(memberId);
        msgModel.setMessage(message);
        msgModel.setType(MessageModelHelper.MESSAGETYPE_INFO);
        WebSocketServe.sendMessage(msgModel, memberId);
        return AjaxResult.success(msgModel);
    }
	@Autowired
	private RedisPublisher publisher;
	
	@GetMapping("/sends1")
	public String publishMessage(@RequestParam String topic, @RequestParam String message) {
		publisher.publishMessage(topic, message);
		return "Send "+message +" finsh!";
	}
	
	@GetMapping("/sends")
	public String getNum(@RequestParam String topic, @RequestParam String message) {
		System.out.println(publisher.getListenerNum(AppTopic.APP_TOPIC));
		return "Send "+message +" finsh!";
	}
}
