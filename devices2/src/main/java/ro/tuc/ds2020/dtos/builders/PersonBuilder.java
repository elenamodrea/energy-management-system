package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.entities.Person;

public class PersonBuilder {

    private PersonBuilder() {
    }

    public static PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(person.getEmail(), person.getRole());
    }


    public static Person toEntity(PersonDTO personDTO) {
        return new Person(personDTO.getEmail(), personDTO.getRole());
    }
}
