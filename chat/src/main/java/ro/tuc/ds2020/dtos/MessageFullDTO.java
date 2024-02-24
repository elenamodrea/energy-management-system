package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageFullDTO  {
    @NotNull
    private UUID id;
    @NotNull
    private String sender;
    @NotNull
    private String receiver;
    @NotNull
    private String message;
    @NotNull
    private LocalDateTime dateTime;
    @NotNull
    private boolean isSeen;
}
