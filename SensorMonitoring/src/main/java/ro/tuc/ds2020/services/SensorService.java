package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.SensorDetailsDTO;
import ro.tuc.ds2020.dtos.builders.SensorBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.entities.Sensor;
import ro.tuc.ds2020.repositories.DeviceRepository;
import ro.tuc.ds2020.repositories.SensorRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SensorService {
    private final SensorRepository sensorRepository;
    private final DeviceRepository deviceRepository;

    @Autowired
    public SensorService(SensorRepository sensorRepository, DeviceRepository deviceRepository) {

        this.sensorRepository = sensorRepository;
        this.deviceRepository = deviceRepository;
    }

    public void createSensor(String deviceId, String timestamp, float value) {
        Sensor sensor = new Sensor(timestamp, value);
        Device device = deviceRepository.findByDeviceId(deviceId);

        sensor.setDevice(device);


        sensorRepository.save(sensor);
    }
    public List<SensorDetailsDTO> findAllByDeviceId(String deviceId){
        List<Sensor> sensors= sensorRepository.findAllByDeviceDeviceIdOrderByValueAsc(deviceId);
        return  sensors.stream()
                .map(SensorBuilder::toSensorDetailsDTO)
                .collect(Collectors.toList());
    }


}
