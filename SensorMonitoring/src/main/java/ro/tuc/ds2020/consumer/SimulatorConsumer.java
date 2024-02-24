package ro.tuc.ds2020.consumer;

import org.json.JSONObject;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.services.DeviceService;
import ro.tuc.ds2020.services.SensorService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@Component
public class SimulatorConsumer {
    private final DeviceService deviceService;
    private final SensorService sensorService;
    private Map<String, ArrayList<Float>> map;

    private SimpMessagingTemplate messagingTemplate;

    public SimulatorConsumer(DeviceService deviceService, SensorService sensorService,SimpMessagingTemplate messagingTemplate) {
        this.deviceService = deviceService;
        this.sensorService = sensorService;
        this.map = new HashMap<>();
        this.messagingTemplate=messagingTemplate;
    }

    @RabbitListener(queues = "sensor_measurement")
    public void run(String jsonMessage) {
        JSONObject jsonObject = new JSONObject(jsonMessage);
        String deviceId = jsonObject.getString("id_sensor");
        float value = Float.parseFloat(jsonObject.getString("value"));
        String timestamp = String.valueOf(jsonObject.getLong("timestamp"));
        if (deviceId != null && deviceService.findbyDeviceId(deviceId) != null) {
            sensorService.createSensor(deviceId, timestamp, value);
            System.out.println("valoare" + value);
            if (!map.containsKey(deviceId)) {
                ArrayList<Float> measurements = new ArrayList<>();
                measurements.add(0.0f);
                measurements.add(value);
                map.put(deviceId, measurements);
            } else {
                ArrayList<Float> measurements = map.get(deviceId);
                float index = measurements.get(0);
                if (index < 6) {
                    measurements.set(0, index + 1);
                    map.put(deviceId, measurements);
                } else if (index == 6) {

                    float sum = value - measurements.get(1);
                    DeviceDetailsDTO device = deviceService.findbyDeviceId(deviceId);
                    if (sum > device.getMeasurement()) {
                        String destination = "/topic/" + device.getEmail() + "/user/notification";
                        messagingTemplate.convertAndSend(destination, "Device-ul cu id-ul: " + deviceId + " a depasit valoarea maxima");
                        System.out.println(destination);
                        System.out.println("esti fraier ca ai depasit la device ul acesta " + sum + " :" + deviceId);
                    }
                    measurements.set(0, 0.0f);
                    map.put(deviceId, measurements);
                }

            }

        }
    }

}
