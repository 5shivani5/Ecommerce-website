package app.ecom.user.config;

import app.ecom.user.entity.User;
import app.ecom.user.repository.UserRepository;
import app.ecom.user.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository; // ✅ fetch role from DB

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String username = null;
        String token = null;

        // ✅ DEBUG: Check header
        System.out.println("Auth Header: " + authHeader);

        // ✅ Extract token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);

            try {
                username = jwtUtil.extractUsername(token);
                System.out.println("Extracted Username: " + username);
            } catch (Exception e) {
                System.out.println("JWT parsing failed: " + e.getMessage());
            }
        }

        // ✅ Validate & authenticate
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (jwtUtil.validateToken(token, username)) {

                // ✅ Fetch user from DB
                Optional<User> userOptional = userRepository.findByUsername(username);

                if (userOptional.isPresent()) {
                    User user = userOptional.get();

                    // 🔥 DEBUG logs
                    System.out.println("USER FOUND: " + user.getUsername());
                    System.out.println("USER ROLE: " + user.getRole());

                    // ✅ Set authority
                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(user.getRole()); // "ADMIN" / "USER"

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    Collections.singletonList(authority)
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // 🔥 DEBUG confirmation
                    System.out.println("Authentication set in SecurityContext");

                } else {
                    System.out.println("User not found in DB");
                }
            } else {
                System.out.println("Invalid JWT token");
            }
        }

        filterChain.doFilter(request, response);
    }
}