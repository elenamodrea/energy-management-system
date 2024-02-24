package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.DeviceViewDTO;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.services.DeviceService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static ro.tuc.ds2020.utils.UtilFunctions.validateAdminRight;

@RestController
@CrossOrigin
@RequestMapping(value = "/device")
public class DeviceController {
    private final DeviceService deviceService;

    @Autowired
    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;

    }

    @GetMapping()
    public ResponseEntity<List<DeviceViewDTO>> getDevices(@RequestAttribute("x-role") String role) {
        System.out.println("a intrat aici");
        validateAdminRight(role);
        System.out.println("a ajuns aici");
        List<DeviceViewDTO> dtos = deviceService.findDevices();
       /* for (DeviceDTO dto : dtos) {
            Link deviceLink = linkTo(methodOn(DeviceController.class)
                    .getDevice(dto.getId())).withRel("deviceDetails");
            dto.add(deviceLink);
        }*/
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }
    @GetMapping(value="/{email:.+}",headers="Accept=*/*")
    public ResponseEntity<List<DeviceDTO>> getUserDevices(@PathVariable String email) {
        List<DeviceDTO> dtos = deviceService.findUserDevices(email);
       /* for (DeviceDTO dto : dtos) {
            Link deviceLink = linkTo(methodOn(DeviceController.class)
                    .getDevice(dto.getId())).withRel("deviceDetails");
            dto.add(deviceLink);
        }*/
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json"); // Set the Content-Type header
        return new ResponseEntity<>(dtos, responseHeaders,HttpStatus.OK);
    }
  /*  @GetMapping(value = "/{id}")
    public ResponseEntity<DeviceDTO> getDevice(@PathVariable("id") UUID personId) {
        DeviceDTO dto = deviceService.findDeviceById(personId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }*/

    @PostMapping()
    public ResponseEntity<DeviceDTO> createDevice(@RequestAttribute("x-role") String role,@Valid @RequestBody DeviceDetailsDTO deviceDetailsDTO) {
        validateAdminRight(role);
        DeviceDTO response = deviceService.createDevice(deviceDetailsDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @DeleteMapping(value ="/{id}")
    public ResponseEntity<DeviceDTO> delete(@RequestAttribute("x-role") String role, @PathVariable UUID id) {
        validateAdminRight(role);
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping()
    public DeviceDTO update(@RequestAttribute("x-role") String role,@RequestBody @Valid DeviceDTO deviceDTO) {
        validateAdminRight(role);
        return deviceService.updateDevice(deviceDTO);

    }
}
