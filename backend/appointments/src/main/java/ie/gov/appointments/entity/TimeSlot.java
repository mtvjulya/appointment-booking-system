package ie.gov.appointments.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "time_slots")
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long slotId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    private SlotStatus availabilityStatus = SlotStatus.AVAILABLE;

    @ManyToOne
    @JoinColumn(name = "centre_id")
    private ServiceCentre centre;

    public TimeSlot() {}

    // getters & setters
    public Long getSlotId() { return slotId; }


    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public SlotStatus getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(SlotStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public ServiceCentre getCentre() { return centre; }
    public void setCentre(ServiceCentre centre) { this.centre = centre; }
}
