package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.services.PersonService;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "/personDevice")
public class PersonController {
    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;

    }

    @GetMapping("/get")
    public ResponseEntity<List<PersonDTO>> getPersons() {
        List<PersonDTO> dtos = personService.findPersons();
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @GetMapping(value = "/{email}")
    public ResponseEntity<PersonDTO> getPerson(@PathVariable("email") String personEmail) {
        PersonDTO dto = personService.findPersonByEmail(personEmail);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<PersonDTO> createPerson(@Valid @RequestBody PersonDTO personDTO) {
        PersonDTO response = personService.createPerson(personDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @DeleteMapping(value="/{email:.+}")
    public ResponseEntity<DeviceDTO> deletePerson(@PathVariable String email) {
        personService.deletePerson(email);
        return ResponseEntity.noContent().build();
    }
}
