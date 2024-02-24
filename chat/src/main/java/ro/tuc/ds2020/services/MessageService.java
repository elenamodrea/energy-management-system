package ro.tuc.ds2020.services;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.MessageFullDTO;
import ro.tuc.ds2020.dtos.builders.MessageBuilder;
import ro.tuc.ds2020.entities.Message;
import ro.tuc.ds2020.repositories.MessageRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    public List<MessageFullDTO> findPersons(String sender, String receiver) {
        List<Message> messageList = messageRepository.findAllMessagesBetweenUsersSortedByDateTime(sender, receiver);
        return messageList.stream()
                .map(MessageBuilder::toMessageFullDTO)
                .collect(Collectors.toList());
    }
    public void saveMessages(String sender, String receiver, String message){
        Message message1 = new Message(receiver, sender, message, LocalDateTime.now(),false);
        messageRepository.save(message1);
    }
    public void updateSeenStatus(String sender, String receiver){
        List<Message> messages = messageRepository.findAllMessagesBetweenSenderAndReceiverSortedByDateTime(sender,receiver);
        for(Message m : messages){
            if(!m.isSeen()){
                m.setSeen(true);
                messageRepository.save(m);
            }
        }
    }
}
