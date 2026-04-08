package app.ecom.user.controller;

import app.ecom.user.dto.AuthResponse;
import app.ecom.user.dto.LoginRequest;
import app.ecom.user.dto.SignupRequest;
import app.ecom.user.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // ✅ allow frontend
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ✅ SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            AuthResponse response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ LOGIN (returns JWT with userId)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 important for debugging
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}