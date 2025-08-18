//package ropold.backend.controller;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import ropold.backend.service.UserService;
//
//import java.util.Map;
//
//@RequiredArgsConstructor
//@RestController
//@RequestMapping("/api/users")
//public class UserController {
//
//    private final UserService userService;
//
//    @GetMapping(value = "/me", produces = "text/plain")
//    public String getMe() {
//        return SecurityContextHolder.getContext().getAuthentication().getName();
//    }
//
//    @GetMapping("/me/details")
//    public Map<String, Object> getUserDetails(@AuthenticationPrincipal OAuth2User user) {
//        if (user == null) {
//            return Map.of("message", "User not authenticated");
//        }
//        return user.getAttributes();
//    }
//}
