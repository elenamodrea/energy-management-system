package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.entities.Device;

public class DeviceBuilder {
    public DeviceBuilder(){

    }
    public static DeviceDetailsDTO toDeviceDetailsDTO(Device device){
        return new DeviceDetailsDTO(device.getEmail(), device.getDeviceId(), device.getMax_measurement());
    }
}
