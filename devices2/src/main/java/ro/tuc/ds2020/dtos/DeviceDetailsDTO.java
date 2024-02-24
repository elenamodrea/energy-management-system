package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDetailsDTO extends RepresentationModel<DeviceDetailsDTO> {
    private String description;
    private String address;
    private float consumption;
    private String userEmail;
}
