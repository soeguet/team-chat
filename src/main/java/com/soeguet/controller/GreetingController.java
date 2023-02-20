package com.soeguet.controller;

import com.soeguet.entity.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class GreetingController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public GreetingController(SimpMessagingTemplate simpMessagingTemplate) {this.simpMessagingTemplate = simpMessagingTemplate;}

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {

        return message;
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message) {

        simpMessagingTemplate.convertAndSendToUser(message.message(),
                                                   "/private",
                                                   message);
        return message;
    }
}