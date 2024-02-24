package ro.tuc.ds2020.services;
import org.springframework.stereotype.Component;

@Component
public class WebSocketManager {

    private WebSocketClient client;

    public WebSocketManager() {
        this.client = new WebSocketClient();
        this.client.connectToWebSocket();
        // Add any additional logic or keep the connection alive as needed
    }

    // Other methods or functionalities related to WebSocket handling can be added here
}
