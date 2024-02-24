package ro.tuc.ds2020.services;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import java.lang.reflect.Type;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class WebSocketClient {

    private StompSession stompSession;
    private WebSocketStompClient stompClient;

    public void connectToWebSocket() {
        stompClient = new WebSocketStompClient(new StandardWebSocketClient());
        StompSessionHandler sessionHandler = new StompSessionHandlerAdapter() {
            @Override
            public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
                stompSession = session;

                // Subscribe to all topics starting with "/topic/chat/"
                stompSession.subscribe("/topic/chat/rebeca@yahoo.com/alex@yahoo.com", new StompFrameHandler() {
                    @Override
                    public Type getPayloadType(StompHeaders headers) {
                        return String.class; // Replace YourMessageType with the expected message type
                    }

                    @Override
                    public void handleFrame(StompHeaders headers, Object payload) {
                        String  receivedMessage = (String) payload;
                        // Extract sender and receiver from the topic string
                        String topic = headers.getDestination();
                        String[] topicParts = topic.split("/");

                        // Assuming the sender and receiver are the last two parts of the topic
                        String sender = topicParts[topicParts.length - 2];
                        String receiver = topicParts[topicParts.length - 1];
                        System.out.println(receivedMessage+" sender: "+sender + " recevier: "+ receiver);
                        // Process the received message and extracted sender/receiver as needed
                        // For example, you might store messages in a List or any other data structure
                    }
                });
            }
        };

//        try {
//            stompSession = stompClient.connect("ws://localhost:8083/ws", sessionHandler).get();
//        } catch (InterruptedException | ExecutionException e) {
//            e.printStackTrace();
//        }
    }

}

