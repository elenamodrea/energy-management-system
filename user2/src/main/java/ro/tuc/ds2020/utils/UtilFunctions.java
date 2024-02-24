package ro.tuc.ds2020.utils;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import ro.tuc.ds2020.infrastructure.exception.CustomException;

import java.util.Base64;

@UtilityClass
@Slf4j
public class UtilFunctions {

    public static String encodePassword(String password) {
        return Base64.getEncoder().encodeToString(password.getBytes());
    }

    public static String decodePassword(String token) {
        byte[] decodedBytes = Base64.getDecoder().decode(token);
        return new String(decodedBytes);
    }

   public static void validateAdminRight(String role){
        if (!role.equalsIgnoreCase("ADMIN")) {
            throw new CustomException("No access", HttpStatus.UNAUTHORIZED);
        }
    }
    public static void validateAdminOrUserRight(String role,String emailUser,String emailDto){
        if (!role.equalsIgnoreCase("ADMIN")) {
            if(!emailUser.equals(emailDto)){
            throw new CustomException("No access", HttpStatus.UNAUTHORIZED);
        }}
    }
}
