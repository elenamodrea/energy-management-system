package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonDeleteDTO extends RepresentationModel<PersonDeleteDTO> {
    @NotNull
    private String email;
    @NotNull
    private String name;
}
