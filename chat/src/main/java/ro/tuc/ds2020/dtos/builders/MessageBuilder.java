package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.MessageFullDTO;
import ro.tuc.ds2020.entities.Message;

public class MessageBuilder {
    private MessageBuilder(){

    }
    public static MessageFullDTO toMessageFullDTO(Message message){
        return new MessageFullDTO(message.getId(),message.getSender(), message.getReceiver(), message.getMessage(), message.getDateTime(),message.isSeen());
    }
    public static Message toMessage(MessageFullDTO messageFullDTO){
        return new Message(messageFullDTO.getReceiver(), messageFullDTO.getSender(), messageFullDTO.getMessage(), messageFullDTO.getDateTime(),messageFullDTO.isSeen());
    }
}

