package ro.tuc.ds2020.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Device implements Serializable {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Type(type = "uuid-binary")
    private UUID id;

    @Column(name = "device_id", nullable = false)
    private String deviceId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "max_measurement", nullable = false)
    private float max_measurement;

    public Device(String deviceId, String email, float max_measurement) {
        this.deviceId = deviceId;
        this.email = email;
        this.max_measurement = max_measurement;
    }
}
