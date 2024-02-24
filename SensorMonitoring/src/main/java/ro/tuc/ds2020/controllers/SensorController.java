package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.tuc.ds2020.dtos.SensorDetailsDTO;
import ro.tuc.ds2020.services.SensorService;

import java.util.List;

@RestController
@RequestMapping(value = "/sensor")
public class SensorController {
    private final SensorService sensorService;

    @Autowired
    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @GetMapping(value = "/{deviceId}")
    public ResponseEntity<List<SensorDetailsDTO>> getSensorsByDevice(@PathVariable String deviceId){
        List<SensorDetailsDTO> dtos = sensorService.findAllByDeviceId(deviceId);
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }
}
