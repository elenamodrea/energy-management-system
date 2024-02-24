package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.repositories.DeviceRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }
    public void createDevice(String deviceId, String email, float measurement) {
        Device device = new Device(deviceId,email,measurement);
        deviceRepository.save(device);
    }
    public void deleteDevice(String deviceId){

        Device device = deviceRepository.findByDeviceId(deviceId);

            deviceRepository.delete(device);


    }
    public DeviceDetailsDTO findbyDeviceId(String deviceId){
        Device device = deviceRepository.findDeviceByDeviceId(deviceId);
        return DeviceBuilder.toDeviceDetailsDTO(device);
    }

}
