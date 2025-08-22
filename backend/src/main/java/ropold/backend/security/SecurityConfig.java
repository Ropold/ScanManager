package ropold.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import ropold.backend.model.UserModel;
import ropold.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Profile("!test")
public class SecurityConfig {

    private final UserRepository userRepository;
    private static final String CUSTOMER = "/api/customers/**";
    private static final String SCANNER = "/api/scanners/**";
    private static final String SERVICE_PARTNER = "/api/service-partners/**";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(a -> a
                        .requestMatchers(HttpMethod.GET, CUSTOMER, SCANNER, SERVICE_PARTNER).permitAll()
                        .requestMatchers(HttpMethod.POST, CUSTOMER, SCANNER, SERVICE_PARTNER).authenticated()
                        .requestMatchers(HttpMethod.PUT, CUSTOMER, SCANNER, SERVICE_PARTNER).authenticated()
                        .requestMatchers(HttpMethod.DELETE, CUSTOMER, SCANNER, SERVICE_PARTNER).authenticated()
                        .requestMatchers("/api/users/me").permitAll()
                        .requestMatchers("/api/users/me/details").permitAll()
                        .anyRequest().permitAll()
                )
                .logout(l -> l.logoutUrl("/api/users/logout")
                        .logoutSuccessHandler((request, response, authentication) -> response.setStatus(200)))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.ALWAYS))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .oauth2Login(o -> o
                        .successHandler((request, response, authentication) -> {
                            //System.out.println("🚀 SUCCESS HANDLER CALLED - User: " + authentication.getName());
                            response.sendRedirect("http://localhost:5173/");
                        }));

        return http.build();
    }


    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        DefaultOAuth2UserService userService = new DefaultOAuth2UserService();

        return (userRequest) -> {
            OAuth2User azureUser = userService.loadUser(userRequest);

            String microsoftId = azureUser.getAttribute("sub");
            String email = azureUser.getAttribute("email");
            String username = azureUser.getAttribute("name");
            //String avatarUrl = azureUser.getAttribute("picture");

            UserModel user = userRepository.findByMicrosoftId(microsoftId)
                    .orElseGet(() -> {
                        UserModel newUser = new UserModel(
                                UUID.randomUUID(),
                                microsoftId,
                                username != null ? username : email,
                                email,
                                "ROLE_USER",
                                null,
                                LocalDateTime.now(),
                                LocalDateTime.now()
                        );
                        return userRepository.save(newUser);
                    });

            return azureUser;
        };
    }
}

