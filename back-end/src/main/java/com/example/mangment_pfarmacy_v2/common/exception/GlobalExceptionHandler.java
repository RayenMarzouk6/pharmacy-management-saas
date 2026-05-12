package com.example.mangment_pfarmacy_v2.common.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

	private ResponseEntity<ErrorResponse> build(HttpStatus status, String message, String path) {
		ErrorResponse err = new ErrorResponse(status.value(), message != null ? message : status.getReasonPhrase(), LocalDateTime.now(), path);
		return new ResponseEntity<>(err, status);
	}

	@ExceptionHandler(StockInsuffisantException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleStockInsuffisant(StockInsuffisantException ex, HttpServletRequest req) {
		return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(AbonnementExpireException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleAbonnement(AbonnementExpireException ex, HttpServletRequest req) {
		return build(HttpStatus.FORBIDDEN, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(EmailAlreadyExistsException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleDuplicateEmail(EmailAlreadyExistsException ex, HttpServletRequest req) {
		return build(HttpStatus.CONFLICT, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest req) {
		return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest req) {
		return build(HttpStatus.CONFLICT, "Une contrainte de donnees a ete violee", req.getRequestURI());
	}

	@ExceptionHandler(AccessDeniedException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
		return build(HttpStatus.FORBIDDEN, "Access denied", req.getRequestURI());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
		String msg = ex.getBindingResult().getFieldErrors().stream()
				.map(FieldError::getDefaultMessage)
				.collect(Collectors.joining(", "));
		return build(HttpStatus.BAD_REQUEST, msg.isEmpty() ? "Validation failed" : msg, req.getRequestURI());
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleBadJson(HttpMessageNotReadableException ex, HttpServletRequest req) {
		return build(HttpStatus.BAD_REQUEST, "Malformed request payload", req.getRequestURI());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest req) {
		return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
		return build(HttpStatus.NOT_FOUND, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
		return build(HttpStatus.METHOD_NOT_ALLOWED, ex.getMessage(), req.getRequestURI());
	}

	@ExceptionHandler(Exception.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleAny(Exception ex, HttpServletRequest req) {
		// log the exception in production
		return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal error: " + ex.getMessage(), req.getRequestURI());
	}
}
