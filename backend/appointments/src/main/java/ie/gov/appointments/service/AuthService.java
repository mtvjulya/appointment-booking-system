package ie.gov.appointments.service;

import ie.gov.appointments.dto.*;
import ie.gov.appointments.entity.User;
import ie.gov.appointments.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

  
        AuthResponse response = new AuthResponse(
                user.getUserId(), user.getFirstName(),user.getLastName(), user.getEmail(),
                user.getRole(), "Verification code sent to your phone"
        );
        response.setRequiresVerification(true);
        return response;
    }

    public AuthResponse verify(VerifyRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getCode() == null || request.getCode().length() != 6) {
            throw new RuntimeException("Invalid verification code");
        }

        return new AuthResponse(
                user.getUserId(), user.getFirstName(),user.getLastName(), user.getEmail(),
                user.getRole(), "Login successful"
        );
    }

    public AuthResponse register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User saved = userRepository.save(user);
        return new AuthResponse(
                saved.getUserId(), saved.getFirstName(),saved.getLastName(), saved.getEmail(),
                saved.getRole(), "Registration successful"
        );
    }
}