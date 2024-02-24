package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.DeviceViewDTO;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.entities.Person;

public class DeviceBuilder {
    private DeviceBuilder(){

    }
    public static DeviceDTO toDeviceDTO(Device device) {
        return new DeviceDTO(device.getId(),device.getDescription(), device.getAddress(), device.getConsumption());
    }
    public static DeviceViewDTO toDeviceViewDTO(Device device) {
        return new DeviceViewDTO(device.getId(),device.getDescription(), device.getAddress(), device.getConsumption(),device.getPerson().getEmail());
    }
    public static DeviceDetailsDTO toDeviceDetailsDTO(Device device){
        return new DeviceDetailsDTO(device.getDescription(), device.getAddress(), device.getConsumption(), device.getPerson().getEmail());
    }

    public static Device toEntity(DeviceDetailsDTO deviceDetailsDTODTO) {
        return new Device(deviceDetailsDTODTO.getDescription(), deviceDetailsDTODTO.getAddress(),deviceDetailsDTODTO.getConsumption());

    }

}
