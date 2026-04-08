package app.ecom.user.service;


import app.ecom.user.dto.AuthResponse;
import app.ecom.user.dto.LoginRequest;
import app.ecom.user.dto.SignupRequest;

public interface AuthService {

    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request);
}