package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceViewDTO extends RepresentationModel<DeviceDTO> {
    private UUID id;
    private String description;
    private String address;
    private float consumption;
    private String userEmail;
}
