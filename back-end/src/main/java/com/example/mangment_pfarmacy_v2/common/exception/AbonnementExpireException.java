package com.example.mangment_pfarmacy_v2.common.exception;

public class AbonnementExpireException extends RuntimeException {
	public AbonnementExpireException() { super("Abonnement expiré"); }
	public AbonnementExpireException(String message) { super(message); }
}
