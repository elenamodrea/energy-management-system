package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.SensorDetailsDTO;
import ro.tuc.ds2020.entities.Sensor;

public class SensorBuilder {
    public static SensorDetailsDTO toSensorDetailsDTO (Sensor sensor){
        return new SensorDetailsDTO(sensor.getId(),sensor.getTimestamp(),sensor.getValue());
    }
}
