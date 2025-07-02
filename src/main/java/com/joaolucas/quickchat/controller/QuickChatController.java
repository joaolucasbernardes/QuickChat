package com.joaolucas.quickchat.controller;

import com.joaolucas.quickchat.domain.ChatInput;
import com.joaolucas.quickchat.domain.ChatOutput;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class QuickChatController {

    @MessageMapping("/new-message")
    @SendTo("/topics/quickchat")
    public ChatOutput newMessage(ChatInput input){
        return new ChatOutput(HtmlUtils.htmlEscape(input.user() + ": " + input.message()));
    }
}
