package app.ecom.user.service.ServiceImpl;

import app.ecom.user.dto.*;
import app.ecom.user.entity.User;
import app.ecom.user.exceptions.BadRequestException;
import app.ecom.user.repository.UserRepository;
import app.ecom.user.service.AuthService;
import app.ecom.user.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ✅ SIGNUP
    @Override
    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");   // ✅ always uppercase
        user.setEnabled(true);  // ✅ enable by default

        userRepository.save(user);

        // ✅ Generate token WITH ROLE
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getId(),
                user.getRole()
        );

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getId(),
                user.getRole()   // ✅ include role
        );
    }

    // ✅ LOGIN
    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        // 🔥 Block disabled users
        if (!user.isEnabled()) {
            throw new BadRequestException("Account is disabled");
        }

        // ✅ Generate token WITH ROLE
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getId(),
                user.getRole()
        );

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getId(),
                user.getRole()   // ✅ FIXED (was missing)
        );
    }
}