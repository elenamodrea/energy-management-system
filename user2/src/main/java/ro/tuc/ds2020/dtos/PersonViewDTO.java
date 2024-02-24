package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

import java.util.Objects;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonViewDTO extends RepresentationModel<PersonViewDTO> {
    private String email;
    private String name;
    private String role;


    @Override
    public int hashCode() {
        return Objects.hash(name, role);
    }
}
