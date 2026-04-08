package app.ecom.user.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    // ✅ Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ✅ Main Security Configuration
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS
                .cors(cors -> {})

                // ✅ Stateless session (JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ✅ Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // 🔓 Public APIs
                        .requestMatchers("/api/auth/**").permitAll()

                        // 👤 USER APIs (address, profile, etc.)
                        .requestMatchers("/api/address/**").authenticated()

                        // 🔥 ADMIN ONLY APIs
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")

                        // 🔐 All others require login
                        .anyRequest().authenticated()
                )

                // ✅ JWT Filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}