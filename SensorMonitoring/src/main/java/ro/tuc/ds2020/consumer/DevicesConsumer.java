package ro.tuc.ds2020.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import org.springframework.amqp.rabbit.annotation.RabbitListener;

import org.springframework.stereotype.Component;
import ro.tuc.ds2020.services.DeviceService;

@Component
public class DevicesConsumer {
    private final DeviceService deviceService;

    public DevicesConsumer(DeviceService deviceService, ObjectMapper objectMapper) {
        this.deviceService = deviceService;
    }

    @RabbitListener(queues = "devices")
    public void run(String jsonMessage) {
        System.out.println(jsonMessage);
        JSONObject jsonObject = new JSONObject(jsonMessage);
        boolean isCreate = jsonObject.getBoolean("create");
        float consumption = jsonObject.getFloat("consumption");
        String deviceId = jsonObject.getString("deviceId");
        String email = jsonObject.getString("email");

        System.out.println(email);
        if (isCreate) {
            deviceService.createDevice(deviceId, email, consumption);
        } else {
            deviceService.deleteDevice(deviceId);
        }

    }
}
