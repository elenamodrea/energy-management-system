package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.LoginDTO;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonSaveDTO;
import ro.tuc.ds2020.services.PersonService;

import javax.validation.Valid;

@RestController
@RequestMapping()
public class RegisterController {
    private final PersonService personService;

    @Autowired
    public RegisterController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping("/register")
    public ResponseEntity<PersonDTO> createPerson(@Valid @RequestBody PersonSaveDTO personDTO) {
        PersonDTO response = personService.createPerson(personDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @PostMapping("/login")
    public String loginPerson(@RequestBody LoginDTO loginDTO) {
        return personService.loginUser(loginDTO);
    }
}
