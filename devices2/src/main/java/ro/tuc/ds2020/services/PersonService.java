package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.builders.PersonBuilder;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.repositories.DeviceRepository;
import ro.tuc.ds2020.repositories.PersonRepository;

import javax.transaction.Transactional;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class PersonService {

    private final PersonRepository personRepository;
    private final DeviceRepository deviceRepository;

    @Autowired
    public PersonService(PersonRepository personRepository, DeviceRepository deviceRepository) {
        this.personRepository = personRepository;
        this.deviceRepository = deviceRepository;
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }

    public PersonDTO findPersonByEmail(String email) {
        Person person = personRepository.findByEmail(email);
        return PersonBuilder.toPersonDTO(person);
    }

    public PersonDTO createPerson(PersonDTO personDTO){
        Person person = PersonBuilder.toEntity(personDTO);
        personRepository.save(person);
        return PersonBuilder.toPersonDTO(person);
    }
    @Transactional
    public void deletePerson(String email){
        Person person=personRepository.findByEmail(email);
        System.out.println(email);
        deviceRepository.deleteByPerson(person);
        personRepository.delete(person);
    }
}
