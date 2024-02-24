package ro.tuc.ds2020.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.MessageFullDTO;
import ro.tuc.ds2020.services.MessageService;

import java.util.List;

@RestController
@RequestMapping(value = "/message")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;

    }

    @GetMapping(value = "/{sender:.+}/{receiver:.+}", headers="Accept=*/*")
    public ResponseEntity<List<MessageFullDTO>> getMessages(
            @PathVariable String sender,
            @PathVariable String receiver) {
        System.out.println(sender);
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json"); // Set the Content-Type header

        List<MessageFullDTO> dtos =messageService.findPersons(sender,receiver);
      /*  for (PersonDTO dto : dtos) {
            Link personLink = linkTo(methodOn(PersonController.class)
                    .getPerson(dto.getId())).withRel("personDetails");
            dto.add(personLink);
        }*/

        return new ResponseEntity<>(dtos,responseHeaders, HttpStatus.OK);
    }
}
