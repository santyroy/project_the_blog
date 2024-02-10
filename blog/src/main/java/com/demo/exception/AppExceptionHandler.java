package com.demo.exception;

import com.demo.dto.ResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class AppExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(AppExceptionHandler.class);

    @ExceptionHandler(BlogNotFoundException.class)
    public ResponseEntity<ResponseDTO> blogNotFoundExceptionHandler(BlogNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        return new ResponseEntity<>(
                new ResponseDTO(false, "404", ex.getMessage(), pd),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ResponseDTO> userNotFoundExceptionHandler(UserNotFoundException ex) {
        LOGGER.error(ex.getMessage());
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        return new ResponseEntity<>(
                new ResponseDTO(false, "404", ex.getMessage(), pd),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseDTO> invalidFieldValueExceptionHandler(MethodArgumentNotValidException ex) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        List<String> errorMessages = fieldErrors.stream().map(FieldError::getDefaultMessage).toList();
        return new ResponseEntity<>(
                new ResponseDTO(false, "400", "Mandatory fields error", errorMessages),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(UserAlreadyPresentException.class)
    public ResponseEntity<ResponseDTO> userAlreadyExistExceptionHandler(UserAlreadyPresentException ex) {
        return new ResponseEntity<>(
                new ResponseDTO(false, "400", "Bad request", ex.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(UserOTPExpiredException.class)
    public ResponseEntity<ResponseDTO> userOTPExpiredExceptionHandler(UserOTPExpiredException ex) {
        return new ResponseEntity<>(
                new ResponseDTO(false, "400", "Bad request", ex.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(UserOTPMismatchException.class)
    public ResponseEntity<ResponseDTO> userOTPMismatchExceptionHandler(UserOTPMismatchException ex) {
        return new ResponseEntity<>(
                new ResponseDTO(false, "400", "Bad request", ex.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(UserOTPNotFoundException.class)
    public ResponseEntity<ResponseDTO> userOTPNotFoundExceptionHandler(UserOTPNotFoundException ex) {
        return new ResponseEntity<>(
                new ResponseDTO(false, "400", "Bad request", ex.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }
}
