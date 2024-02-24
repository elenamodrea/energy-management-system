package ro.tuc.ds2020.infrastructure.errors;

import java.util.List;
import java.util.UUID;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Data
public class ErrorApiResponse {
    @Setter(value = AccessLevel.NONE)
    private final String errorCode = UUID.randomUUID().toString();
    private final List<String> messages;

    public static ErrorApiResponse of(String message) {
        return new ErrorApiResponse(List.of(message));
    }

    public static ErrorApiResponse of(List<String> messages) {
        return new ErrorApiResponse(messages);
    }
}
