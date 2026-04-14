package ie.gov.appointments.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private String message;

    private String type;  // e.g. "BOOKING_CONFIRMED", "CANCELLED", "RESCHEDULED"

    private Boolean readStatus = false;  // Default to unread

    private LocalDateTime sentAt;

    @PrePersist
    protected void onCreate() {
        this.sentAt = LocalDateTime.now();
    }
    public Long getNotificationId() { 
        return notificationId; 
    }
    
    public User getUser() { 
        return user; 
    }
    
    public void setUser(User user) { 
        this.user = user; 
    }
    
    public Appointment getAppointment() { 
        return appointment; 
    }
    
    public void setAppointment(Appointment appointment) { 
        this.appointment = appointment; 
    }
    
    public String getMessage() { 
        return message; 
    }
    
    public void setMessage(String message) { 
        this.message = message; 
    }
    
    public String getType() { 
        return type; 
    }
    
    public void setType(String type) { 
        this.type = type; 
    }
    
    public LocalDateTime getSentAt() { 
        return sentAt; 
    }
    
    public void setSentAt(LocalDateTime sentAt) { 
        this.sentAt = sentAt; 
    }
    
    public Boolean getReadStatus() { 
        return readStatus; 
    }
    
    public void setReadStatus(Boolean readStatus) { 
        this.readStatus = readStatus; 
    }
  
}