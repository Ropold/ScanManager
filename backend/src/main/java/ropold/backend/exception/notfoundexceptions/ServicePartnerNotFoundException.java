package ropold.backend.exception.notfoundexceptions;

public class ServicePartnerNotFoundException extends RuntimeException {
    public ServicePartnerNotFoundException(String message) {
        super(message);
    }
}
