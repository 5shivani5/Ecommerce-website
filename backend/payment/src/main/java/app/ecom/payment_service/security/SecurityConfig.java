package app.ecom.payment_service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ✅ ENABLE CORS
                .cors(cors -> {})

                // ❌ DISABLE CSRF
                .csrf(csrf -> csrf.disable())

                // ✅ STATELESS
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // ✅ VERY IMPORTANT (preflight requests)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ INTERNAL API (order-service → payment)
                        .requestMatchers("/payment/refund").permitAll()

                        // ✅ USER APIs (require JWT)
                        .requestMatchers("/payment/pay").authenticated()
                        .requestMatchers("/payment/balance/**").authenticated()

                        // 🔐 everything else
                        .anyRequest().authenticated()
                )

                // ✅ ADD JWT FILTER
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}