package ie.gov.appointments.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.BOOKED;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"appointments", "password", "verificationCode"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id")
    @JsonIgnoreProperties({"appointments"})
    private GovService service;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_id")
    @JsonIgnoreProperties({"appointment"})
    private TimeSlot timeSlot;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "centre_id")
    @JsonIgnoreProperties({"appointments"})
    private ServiceCentre centre;

    public ServiceCentre getCentre() { return centre; }
    public void setCentre(ServiceCentre centre) { this.centre = centre; }

    private String dateOfBirth;
    private String ppsn;
    private String address;
    private String eircode;
    private String notes;
    private int numberOfAttendees;
    private String accessibilityNeeds;
    private String documentNames;   

    public Appointment() {}

    public Long getAppointmentId() { return appointmentId; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public GovService getService() { return service; }
    public void setService(GovService service) { this.service = service; }

    public TimeSlot getTimeSlot() { return timeSlot; }
    public void setTimeSlot(TimeSlot timeSlot) { this.timeSlot = timeSlot; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { 
        this.updatedAt = updatedAt; 
    }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getPpsn() { return ppsn; }
    public void setPpsn(String ppsn) { this.ppsn = ppsn; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEircode() { return eircode; }
    public void setEircode(String eircode) { this.eircode = eircode; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public int getNumberOfAttendees() { return numberOfAttendees; }
    public void setNumberOfAttendees(int numberOfAttendees) { this.numberOfAttendees = numberOfAttendees; }

    public String getAccessibilityNeeds() { return accessibilityNeeds; }
    public void setAccessibilityNeeds(String accessibilityNeeds) { this.accessibilityNeeds = accessibilityNeeds; }

    public String getDocumentNames() { return documentNames; }
    public void setDocumentNames(String documentNames) { this.documentNames = documentNames; }
}
