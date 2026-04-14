package ie.gov.appointments.controller;

import ie.gov.appointments.entity.TimeSlot;
import ie.gov.appointments.service.TimeSlotService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class TimeSlotController {

  private final TimeSlotService service;

  public TimeSlotController(TimeSlotService service) {
    this.service = service;
  }

  @PostMapping
  public TimeSlot create(@RequestBody TimeSlot slot) {
    return service.create(slot);
  }

  @GetMapping
  public List<TimeSlot> getAll() {
    return service.getAll();
  }

  @GetMapping("/available")
  public List<TimeSlot> available() {
    return service.getAvailableSlots();
  }
  
  @GetMapping("/available/{centreId}")
  public List<TimeSlot> availableByCentre(@PathVariable Long centreId) {
    return service.getAvailableByCentre(centreId);
  }

}