package ropold.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home(Authentication auth) {
        if (auth != null) {
            return "Login successful! User: " + auth.getName();
        }
        return "Not authenticated";
    }
}