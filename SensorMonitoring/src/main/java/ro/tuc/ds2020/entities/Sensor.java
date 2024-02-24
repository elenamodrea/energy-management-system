package ro.tuc.ds2020.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sensor implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Column(name = "timestamp", nullable = false)
    private String timestamp;

    @Column(name = "measurement_value", nullable = false)
    private float value;

   @ManyToOne
    private Device device;

   public Sensor(String timestamp, float value){
       this.timestamp=timestamp;
       this.value=value;
   }

}
