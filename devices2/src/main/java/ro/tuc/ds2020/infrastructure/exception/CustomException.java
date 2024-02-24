package ro.tuc.ds2020.infrastructure.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;
import ro.tuc.ds2020.infrastructure.errors.ErrorApiResponse;

@Data
public class CustomException extends RuntimeException {
    private HttpStatus httpStatus;
    private ErrorApiResponse errorApiResponse;

    public CustomException() {
        super(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
    }

    public CustomException(String message) {
        super(message);
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

    public CustomException(String message, HttpStatus status) {
        super(message);
        this.httpStatus = status;
    }
}
