package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.*;
import ro.tuc.ds2020.entities.Person;

public class PersonBuilder {

    private PersonBuilder() {
    }

    public static PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(person.getId(), person.getName());
    }
    public static PersonViewDTO toPersonViewDTO(Person person) {
        return new PersonViewDTO(person.getEmail(), person.getName(),person.getRole().getRoleType());
    }

    public static PersonDetailsDTO toPersonDetailsDTO(Person person) {
        return new PersonDetailsDTO(person.getName(), person.getEmail(), person.getPassword(),person.getRole().getRoleType());
    }

    public static PersonDeleteDTO toPersonDeleteDTO(Person person) {
        return new PersonDeleteDTO(person.getEmail(), person.getName());
    }
    public static Person toEntity(PersonDetailsDTO personDetailsDTO) {
        return new Person(personDetailsDTO.getName(),personDetailsDTO.getEmail(),
                personDetailsDTO.getPassword());
    }
    public static Person toEntity(PersonSaveDTO personSaveDTO) {
        return new Person(personSaveDTO.getName(),personSaveDTO.getEmail(),
                personSaveDTO.getPassword());

    }
    public static PersonDeviceDTO toPersonDeviceDTO(Person person){
        return new PersonDeviceDTO(person.getEmail(),person.getRole().getRoleType());
    }
}
