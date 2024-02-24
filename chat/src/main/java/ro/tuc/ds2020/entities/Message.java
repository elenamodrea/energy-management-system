package ro.tuc.ds2020.entities;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;


    @Column(name = "receiver", nullable = false)
    private String receiver;

    @Column(name = "sender", nullable = false)
    private String sender;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "dateTime", nullable = false)
    private LocalDateTime dateTime;
    @Column(name = "isSeen", nullable = false)
    private boolean isSeen;
    public Message(String receiver, String sender, String message, LocalDateTime dateTime,boolean isSeen) {
        this.receiver=receiver;
        this.sender=sender;
        this.message=message;
        this.dateTime=dateTime;
        this.isSeen=isSeen;
    }
}
