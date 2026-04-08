package app.ecom.user.service.impl;
import app.ecom.user.dto.AuthResponse;
import app.ecom.user.dto.LoginRequest;
import app.ecom.user.dto.SignupRequest;
import app.ecom.user.entity.User;
import app.ecom.user.exceptions.BadRequestException;
import app.ecom.user.repository.UserRepository;
import app.ecom.user.service.ServiceImpl.AuthServiceImpl;
import app.ecom.user.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthServiceImpl Unit Tests")
class AuthServiceImplTest {

    @Mock private UserRepository    userRepository;
    @Mock private PasswordEncoder   passwordEncoder;
    @Mock private JwtUtil           jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    // ── helpers ──────────────────────────────────────────────────────────────

    private User makeUser(Long id, String username) {
        User u = new User();
        u.setId(id);
        u.setUsername(username);
        u.setPassword("encoded_password");
        u.setRole("USER");
        u.setEnabled(true);
        return u;
    }

    private SignupRequest signupRequest(String user, String pass, String confirm) {
        SignupRequest r = new SignupRequest();
        r.setUsername(user);
        r.setPassword(pass);
        r.setConfirmPassword(confirm);
        return r;
    }

    private LoginRequest loginRequest(String user, String pass) {
        LoginRequest r = new LoginRequest();
        r.setUsername(user);
        r.setPassword(pass);
        return r;
    }

    // ── SIGNUP ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("signup: success — new user is saved and token returned")
    void signup_success() {
        SignupRequest req = signupRequest("alice", "pass123", "pass123");

        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(jwtUtil.generateToken(eq("alice"), eq(1L), eq("USER")))
                .thenReturn("mocked.jwt.token");

        AuthResponse response = authService.signup(req);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mocked.jwt.token");
        assertThat(response.getUsername()).isEqualTo("alice");
        assertThat(response.getRole()).isEqualTo("USER");

        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("pass123");
    }

    @Test
    @DisplayName("signup: throws BadRequestException when username already exists")
    void signup_duplicateUsername_throws() {
        SignupRequest req = signupRequest("alice", "pass123", "pass123");
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThatThrownBy(() -> authService.signup(req))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Username already exists");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("signup: throws BadRequestException when passwords do not match")
    void signup_passwordMismatch_throws() {
        SignupRequest req = signupRequest("bob", "pass123", "different");
        when(userRepository.existsByUsername("bob")).thenReturn(false);

        assertThatThrownBy(() -> authService.signup(req))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Passwords do not match");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("signup: saved user has encoded password, role USER, and enabled=true")
    void signup_userSavedWithCorrectFields() {
        SignupRequest req = signupRequest("carol", "secret", "secret");
        when(userRepository.existsByUsername("carol")).thenReturn(false);
        when(passwordEncoder.encode("secret")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(2L);
            return u;
        });
        when(jwtUtil.generateToken(anyString(), anyLong(), anyString()))
                .thenReturn("token");

        authService.signup(req);

        verify(userRepository).save(argThat(u ->
                u.getUsername().equals("carol") &&
                        u.getPassword().equals("hashed") &&
                        u.getRole().equals("USER") &&
                        u.isEnabled()
        ));
    }

// ── LOGIN ─────────────────────────────────────────────────────────────────
@Test
@DisplayName("login: success — returns token and user info")
void login_success() {
    User user = makeUser(10L, "dave");
    LoginRequest req = loginRequest("dave", "mypassword");

    when(userRepository.findByUsername("dave")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("mypassword", "encoded_password")).thenReturn(true);
    when(jwtUtil.generateToken("dave", 10L, "USER")).thenReturn("login.token");

    AuthResponse response = authService.login(req);

    assertThat(response.getToken()).isEqualTo("login.token");
    assertThat(response.getUsername()).isEqualTo("dave");
    assertThat(response.getUserId()).isEqualTo(10L);
    assertThat(response.getRole()).isEqualTo("USER");
}

    @Test
    @DisplayName("login: throws BadRequestException for unknown username")
    void login_unknownUsername_throws() {
        LoginRequest req = loginRequest("ghost", "pass");
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid username or password");
    }

    @Test
    @DisplayName("login: throws BadRequestException for wrong password")
    void login_wrongPassword_throws() {
        User user = makeUser(5L, "eve");
        LoginRequest req = loginRequest("eve", "wrongpass");

        when(userRepository.findByUsername("eve")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "encoded_password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid username or password");

        verify(jwtUtil, never()).generateToken(any(), any(), any());
    }

    @Test
    @DisplayName("login: throws BadRequestException when account is disabled")
    void login_disabledAccount_throws() {
        User user = makeUser(6L, "frank");
        user.setEnabled(false);
        LoginRequest req = loginRequest("frank", "pass");

        when(userRepository.findByUsername("frank")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("pass", "encoded_password")).thenReturn(true);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("disabled");
        verify(jwtUtil, never()).generateToken(any(), any(), any());
    }
}
