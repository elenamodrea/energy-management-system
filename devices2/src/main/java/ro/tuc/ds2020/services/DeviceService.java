package ro.tuc.ds2020.services;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import net.minidev.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;

import ro.tuc.ds2020.dtos.DeviceViewDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;

import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.repositories.DeviceRepository;
import ro.tuc.ds2020.repositories.PersonRepository;

import java.io.IOException;
import java.nio.charset.StandardCharsets;;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final DeviceRepository deviceRepository;

    private final PersonRepository personRepository;
    private static Connection connection;
    private static Channel channel;


    @Autowired
    public DeviceService(DeviceRepository deviceRepository, PersonRepository personRepository) {
        this.deviceRepository = deviceRepository;
        this.personRepository = personRepository;
        if (connection == null || !connection.isOpen()) {
            setupRabbitMQ();
        }
    }
    private void setupRabbitMQ() {
        try {
            String hostname = "localhost";
            int port = 5672;
            String username = "guest";
            String password = "guest";
            String virtualHost = "/";

            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost(hostname);
            factory.setPort(port);
            factory.setUsername(username);
            factory.setPassword(password);
            factory.setVirtualHost(virtualHost);

            connection = factory.newConnection();
            channel = connection.createChannel();

            // Declare queue and exchange here...
        } catch (IOException | TimeoutException e) {
            LOGGER.error("Error establishing RabbitMQ connection: {}", e.getMessage());
            // Handle the exception as needed
        }

        String queue = "devices";
        boolean durable = false;
        boolean exclusive = false;
        boolean autoDelete = false;

        try {
            channel.queueDeclare(queue, durable, exclusive, autoDelete, null);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String exchangeName = "devices_exchange";
// Add this block after creating the channel and before publishing messages
        try {
            channel.exchangeDeclare(exchangeName, "topic",true); // Declare the exchange as a 'direct' exchange
        } catch (IOException e) {
            throw new RuntimeException("Error declaring exchange: " + e.getMessage());
        }

    }
    public DeviceDTO findDeviceById(UUID id) {
        Optional<Device> prosumerOptional = deviceRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceBuilder.toDeviceDTO(prosumerOptional.get());
    }
    public List<DeviceViewDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceViewDTO)
                .collect(Collectors.toList());
    }
    public DeviceDTO createDevice(DeviceDetailsDTO deviceDetailsDTO) {
        Device device = DeviceBuilder.toEntity(deviceDetailsDTO);
        device.setPerson(personRepository.findByEmail(deviceDetailsDTO.getUserEmail()));
        device = deviceRepository.save(device);
        LOGGER.debug("Person with id {} was inserted in db", device.getId());
        producer(deviceDetailsDTO.getUserEmail(),device.getId(),device.getConsumption(),true);
        return DeviceBuilder.toDeviceDTO(device);
    }
    private void producer(String email, UUID deviceId, float consumption, boolean create){

        if (channel == null || !channel.isOpen()) {
            setupRabbitMQ(); // Re-establish connection if channel is closed
        }

        String exchangeName = "devices_exchange";
        String routingKey = "devices_route";
            JSONObject obj = new JSONObject();

            obj.put("create", create);
            obj.put("deviceId", String.valueOf(deviceId));
            obj.put("consumption", consumption);
            obj.put("email", email);
            try {
                channel.basicPublish(exchangeName, routingKey, null, obj.toString().getBytes(StandardCharsets.UTF_8));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        System.out.println("am intrat" + obj);
    }
    public void deleteDevice(UUID id){
        Optional<Device> device = deviceRepository.findById(id);
        if(device.isPresent()){
            deviceRepository.delete(device.get());
            producer(device.get().getPerson().getEmail(),id,device.get().getConsumption(),false);
        }
        else{
            LOGGER.error("Person with id {} was not found in db", device.get().getId());
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + device.get().getId());
        }
    }
    public DeviceDTO updateDevice(DeviceDTO deviceDTO){
        Optional<Device> device = deviceRepository.findById(deviceDTO.getId());
        if(device.isPresent()){
            device.get().setConsumption(deviceDTO.getConsumption());
            device.get().setAddress(deviceDTO.getAddress());
            device.get().setDescription(deviceDTO.getDescription());
            deviceRepository.save(device.get());
            return DeviceBuilder.toDeviceDTO(device.get());
        }
        else{
            LOGGER.error("Person with id {} was not found in db", device.get().getId());
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + device.get().getId());
        }
    }
    public List<DeviceDTO> findUserDevices(String email){
        List<Device> devices = deviceRepository.findDevicesByPersonEmail(email);
        return devices.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }


}
