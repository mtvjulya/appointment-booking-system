package ie.gov.appointments.repository;
import ie.gov.appointments.entity.SlotStatus;
import java.util.List;
import ie.gov.appointments.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByAvailabilityStatus(SlotStatus availabilityStatus);
    List<TimeSlot> findByCentreCentreIdAndAvailabilityStatus(Long centreId, SlotStatus status);
    long countByAvailabilityStatus(SlotStatus status);
}