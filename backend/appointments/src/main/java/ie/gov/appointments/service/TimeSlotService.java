package ie.gov.appointments.service;

import ie.gov.appointments.entity.TimeSlot;
import ie.gov.appointments.repository.TimeSlotRepository;
import org.springframework.stereotype.Service;
import ie.gov.appointments.entity.SlotStatus;
import java.util.List;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class TimeSlotService {

    private final TimeSlotRepository repository;

    public TimeSlotService(TimeSlotRepository repository) {
        this.repository = repository;
    }

    public TimeSlot create(TimeSlot slot) {
        return repository.save(slot);
    }

    public List<TimeSlot> getAll() {
        return repository.findAll();
    }

    public List<TimeSlot> getAvailableSlots() {
        return repository.findByAvailabilityStatus(SlotStatus.AVAILABLE);
    }
    
    public List<TimeSlot> getAvailableByCentre(Long centreId) {
        LocalDateTime cutoff = LocalDateTime.now(ZoneId.of("Europe/Dublin")).plusHours(24);
        return repository.findByCentreCentreIdAndAvailabilityStatusAndStartTimeAfter(centreId, SlotStatus.AVAILABLE, cutoff);
    }

    public TimeSlot createSlot(TimeSlot slot) {
        return repository.save(slot);
    }

    public void deleteSlot(Long id) {
        repository.deleteById(id);
    }

    public long getBookedCount() {
        return repository.countByAvailabilityStatus(SlotStatus.BOOKED);
    }

    public long getAvailableCount() {
        return repository.countByAvailabilityStatus(SlotStatus.AVAILABLE);
    }

}
