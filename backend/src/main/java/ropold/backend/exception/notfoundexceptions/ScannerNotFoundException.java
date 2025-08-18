package ropold.backend.exception.notfoundexceptions;

public class ScannerNotFoundException extends RuntimeException {
    public ScannerNotFoundException(String message) {
        super(message);
    }
}
