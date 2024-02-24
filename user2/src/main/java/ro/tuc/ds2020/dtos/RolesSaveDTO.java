package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;


@NoArgsConstructor
@AllArgsConstructor
@Data
public class RolesSaveDTO extends RepresentationModel<RolesSaveDTO> {
    private Integer id;
    private String roleType;
}
