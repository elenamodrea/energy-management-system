package ro.tuc.ds2020.controllers;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;
import ro.tuc.ds2020.services.MessageService;

@RestController
public class WebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    public WebSocketController(SimpMessagingTemplate messagingTemplate, MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }


   @MessageMapping("/chat/{sender}/{receiver}")
    public void sendMessage(@Payload String chatMessage,@DestinationVariable String sender,
                            @DestinationVariable String receiver ) {
        // Process the received message and handle any required logic
        // For example, you might save the message in a database, perform validations, etc.
       System.out.println("send: " + sender);
        // Construct a response message
        // Send the response message back to the specific receiver's topic
        String destination = "/topic/chat/"+sender+"/"+receiver;
        System.out.println(destination);
        System.out.println("aici");
        messageService.saveMessages(sender,receiver,chatMessage);
        messagingTemplate.convertAndSend(destination, chatMessage);

    }
    @MessageMapping("/chat/{sender}/{receiver}/typing")
    public void seeTyping(@Payload String chatMessage,@DestinationVariable String sender,
                            @DestinationVariable String receiver ) {
        // Process the received message and handle any required logic
        // For example, you might save the message in a database, perform validations, etc.
        System.out.println("send on typing: " + sender);
        // Construct a response message
        // Send the response message back to the specific receiver's topic
        String destination = "/topic/chat/"+sender+"/"+receiver;

        messagingTemplate.convertAndSend(destination, chatMessage);

    }
    @MessageMapping("/chat/{sender}/{receiver}/seen")
    public void sendSeen(@Payload String chatMessage,@DestinationVariable String sender,
                            @DestinationVariable String receiver ) {
        // Process the received message and handle any required logic
        // For example, you might save the message in a database, perform validations, etc.
        System.out.println("send: " + sender);
        // Construct a response message
        // Send the response message back to the specific receiver's topic
        String destination = "/topic/chat/"+sender+"/"+receiver;

        System.out.println("seen");
       // messageService.updateSeenStatus(sender,receiver);
        messageService.updateSeenStatus(receiver,sender);
        messagingTemplate.convertAndSend(destination, "seen");

    }
}

