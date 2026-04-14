package ie.gov.appointments.controller;

import ie.gov.appointments.entity.Appointment;
import ie.gov.appointments.entity.TimeSlot;
import ie.gov.appointments.service.AppointmentService;
import ie.gov.appointments.service.TimeSlotService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity; 
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private TimeSlotService timeSlotService;
    
   
    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
    
    
    @PostMapping("/slots")
    public ResponseEntity<TimeSlot> createTimeSlot(@RequestBody TimeSlot slot) {
        return ResponseEntity.ok(timeSlotService.createSlot(slot));
    }
    
    @DeleteMapping("/slots/{id}")
    public ResponseEntity<?> deleteTimeSlot(@PathVariable Long id) {
        timeSlotService.deleteSlot(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAppointments", appointmentService.getTotalCount());
        stats.put("bookedSlots", timeSlotService.getBookedCount());
        stats.put("availableSlots", timeSlotService.getAvailableCount());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/database-stats")
    public ResponseEntity<Map<String, Object>> getDatabaseStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Time slots statistics
        stats.put("totalSlots", timeSlotService.getAll().size());
        stats.put("availableSlots", timeSlotService.getAvailableCount());
        stats.put("bookedSlots", timeSlotService.getBookedCount());
        
        // Appointments statistics
        long totalAppointments = appointmentService.getTotalCount();
        List<Appointment> allAppointments = appointmentService.getAllAppointments();
        
        long bookedCount = allAppointments.stream()
            .filter(a -> a.getStatus().toString().equals("BOOKED"))
            .count();
        long cancelledCount = allAppointments.stream()
            .filter(a -> a.getStatus().toString().equals("CANCELLED"))
            .count();
        long rescheduledCount = allAppointments.stream()
            .filter(a -> a.getStatus().toString().equals("RESCHEDULED"))
            .count();
            
        stats.put("totalAppointments", totalAppointments);
        stats.put("bookedAppointments", bookedCount);
        stats.put("cancelledAppointments", cancelledCount);
        stats.put("rescheduledAppointments", rescheduledCount);
        
        return ResponseEntity.ok(stats);
    }
}