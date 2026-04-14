package ie.gov.appointments.dto;

public class AuthResponse {
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String message;
    private boolean requiresVerification;

    public AuthResponse(String message) {
        this.message = message;
    }

    public AuthResponse(Long userId, String firstName, String lastName, String email, String role, String message) {
        this.userId = userId;
        this.name = firstName + " " + lastName;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getMessage() { return message; }
    public boolean isRequiresVerification() { return requiresVerification; }
    public void setRequiresVerification(boolean requiresVerification) {
        this.requiresVerification = requiresVerification;
    }
}