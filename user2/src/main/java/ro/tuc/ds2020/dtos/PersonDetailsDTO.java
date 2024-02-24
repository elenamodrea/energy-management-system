package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;


import javax.validation.constraints.NotNull;
import java.util.Objects;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonDetailsDTO extends RepresentationModel<PersonDetailsDTO> {

   // private UUID id;
    @NotNull
    private String name;
    @NotNull
    private String email;

    private String password;
    @NotNull
    private String role;
 @Override
 public int hashCode() {
  return Objects.hash(name, email);
 }

}
