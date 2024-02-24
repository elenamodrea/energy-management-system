package ro.tuc.ds2020.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.*;
import ro.tuc.ds2020.services.PersonService;

import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static ro.tuc.ds2020.utils.UtilFunctions.validateAdminOrUserRight;
import static ro.tuc.ds2020.utils.UtilFunctions.validateAdminRight;

@RestController

@RequestMapping(value = "/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping()
    public ResponseEntity<List<PersonViewDTO>> getPersons() {

        List<PersonViewDTO> dtos = personService.findPersons();
      /*  for (PersonDTO dto : dtos) {
            Link personLink = linkTo(methodOn(PersonController.class)
                    .getPerson(dto.getId())).withRel("personDetails");
            dto.add(personLink);
        }*/

        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<PersonDTO> createPerson(@RequestAttribute("x-role") String role,@Valid @RequestBody PersonSaveDTO personDTO) {
        validateAdminRight(role);
        PersonDTO response = personService.createPerson(personDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

  /*  @GetMapping(value = "/{id}")
    public ResponseEntity<PersonDetailsDTO> getPerson(@RequestAttribute("x-role") String role,@PathVariable("id") UUID personId) {
        validateAdminRight(role);
        PersonDetailsDTO dto = personService.findPersonById(personId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }*/
    @GetMapping( value="/{email:.+}",headers="Accept=*/*")
    public ResponseEntity<PersonDetailsDTO> getPerson(@RequestAttribute("x-role") String role,@RequestAttribute("x-user") String userEmail,@PathVariable("email") String email) {
        System.out.println("decoded email is "+ email );
        System.out.println("email from role"+ userEmail);
        validateAdminOrUserRight(role,email,userEmail);
        PersonDetailsDTO dto = personService.findPersonByEmail(email);
        System.out.println(dto.getName());
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json"); // Set the Content-Type header

        return new ResponseEntity<>(dto, responseHeaders, HttpStatus.OK);
    }

    @DeleteMapping(value ="/{email:.+}")
    public ResponseEntity<PersonDTO> delete(@RequestAttribute("x-role") String role,@RequestAttribute("token")String token, @PathVariable("email") String email) {
        validateAdminRight(role);
        personService.deletePerson(email,token);
        return ResponseEntity.noContent().build();
    }
    @PutMapping()
    public PersonDTO update(@RequestAttribute("x-role") String role,@RequestBody @Valid PersonDetailsDTO personDTO) {
        validateAdminRight(role);
        return personService.updatePerson(personDTO);

    }

}
