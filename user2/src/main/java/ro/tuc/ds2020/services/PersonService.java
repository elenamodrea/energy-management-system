package ro.tuc.ds2020.services;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.*;
import ro.tuc.ds2020.dtos.builders.PersonBuilder;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.entities.Roles;
import ro.tuc.ds2020.infrastructure.exception.CustomException;
import ro.tuc.ds2020.repositories.PersonRepository;
import ro.tuc.ds2020.repositories.RolesRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static ro.tuc.ds2020.utils.UtilFunctions.encodePassword;

@Service
@RequiredArgsConstructor
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;
    private final RolesRepository rolesRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$");
    private static final String secretKey = "vYKl0OQy3+eDndDf2D8zNQY12/gS9DJQInmN6oBO2u8=";
   /* @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }*/

    public List<PersonViewDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonViewDTO)
                .collect(Collectors.toList());
    }

    public PersonDetailsDTO findPersonById(UUID id) {
        Optional<Person> prosumerOptional = personRepository.findById(id);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }
        return PersonBuilder.toPersonDetailsDTO(prosumerOptional.get());
    }

    public PersonDetailsDTO findPersonByEmail(String email) {
        Optional<Person> prosumerOptional = personRepository.findByEmail(email);
        if (!prosumerOptional.isPresent()) {
            LOGGER.error("Person with username {} was not found in db", email);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with username: " + email);
        }
        return PersonBuilder.toPersonDetailsDTO(prosumerOptional.get());
    }

    /* public UUID insert(PersonDetailsDTO personDTO) {
         Person person = PersonBuilder.toEntity(personDTO);
         person = personRepository.save(person);
         LOGGER.debug("Person with id {} was inserted in db", person.getId());
         return person.getId();
     }*/
    private void validateEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new CustomException("Email format not good!", HttpStatus.BAD_REQUEST);
        }
    }

    private void validatePassword(String password) {

        if (password == null || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new CustomException("Password format not good!", HttpStatus.BAD_REQUEST);
        }
    }

    public PersonDTO createPerson(PersonSaveDTO personSaveDTO) {
        validateEmail(personSaveDTO.getEmail());
        validatePassword(personSaveDTO.getPassword());

        Person person = PersonBuilder.toEntity(personSaveDTO);
        person.setPassword(encodePassword(personSaveDTO.getPassword()));
        System.out.println(personSaveDTO.getRole());
        Roles role = rolesRepository.findRolesByType(personSaveDTO.getRole());
        person.setRole(role);
        System.out.println(person.getRole());
        Person savedPerson = personRepository.save(person);
        PersonDeviceDTO personDeviceDTO = PersonBuilder.toPersonDeviceDTO(savedPerson);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);


        HttpEntity<PersonDeviceDTO> requestEntity = new HttpEntity<>(personDeviceDTO, headers);
        ResponseEntity<PersonDeviceDTO> responseEntity = restTemplate.postForEntity("http://localhost:8081/personDevice/", requestEntity,PersonDeviceDTO.class);

        return PersonBuilder.toPersonDTO(savedPerson);
    }
    private void verifyPassword(String passwordFormDatabase, String passwordGiven) {
        if (!passwordFormDatabase.equals(passwordGiven))
            throw new CustomException("Password incorrect!");
    }
    public String loginUser(LoginDTO loginDTO) {
        Optional<Person> person = personRepository.findByEmail(loginDTO.getEmail());
        verifyPassword(person.get().getPassword(), encodePassword(loginDTO.getPassword()));
        UUID id =person.get().getId();
        String role= person.get().getRole().getRoleType();
        return returnToken(person.get().getEmail(),role,secretKey);
    }
    public String returnToken(String email, String role, String secretKey) {
        String token = Jwts.builder()
                .claim("email", email)
                .claim("role", role)
                // You can add more claims as needed
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
        return "Bearer " + token;
    }

    public void deletePerson( String email, String token){
        Optional<Person> person = personRepository.findByEmail(email);
        if(person.isPresent()){
            personRepository.delete(person.get());
            //PersonDeviceDTO personDeviceDTO = PersonBuilder.toPersonDeviceDTO(person.get());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization" , token);

            HttpEntity<Object> requestEntity = new HttpEntity<>( headers);
            String url = String.format("http://localhost:8081/personDevice/%s", email);
            ResponseEntity<PersonDeviceDTO> responseEntity = restTemplate.exchange(url, HttpMethod.DELETE, requestEntity, PersonDeviceDTO.class);

        }
        else{

            LOGGER.error("Person with id {} was not found in db", person.get().getId());
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + person.get().getId());
        }
    }
    public PersonDTO updatePerson(PersonDetailsDTO personDTO){
        Optional<Person> person = personRepository.findByEmail(personDTO.getEmail());
        if(person.isPresent()){
            if(!personDTO.getPassword().isEmpty()) {
                validatePassword(personDTO.getPassword());
                person.get().setPassword(encodePassword(personDTO.getPassword()));
            }
            person.get().setName(personDTO.getName());


            personRepository.save(person.get());
            return PersonBuilder.toPersonDTO(person.get());
        }
        else{
            LOGGER.error("Person with id {} was not found in db", person.get().getId());
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + person.get().getId());
        }
    }

}
