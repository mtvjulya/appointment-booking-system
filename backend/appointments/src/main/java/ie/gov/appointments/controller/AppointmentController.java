package ie.gov.appointments.controller;

import ie.gov.appointments.dto.BookingRequest;
import ie.gov.appointments.entity.Appointment;
import ie.gov.appointments.service.AppointmentService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity; 
import java.util.List;
import ie.gov.appointments.dto.RescheduleRequest;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/book")
    public Appointment book(@RequestBody BookingRequest request) {
        return appointmentService.bookAppointment(request);
    }

    @GetMapping("/user/{userId}")
    public List<Appointment> getByUser(@PathVariable Long userId) {
        return appointmentService.getByUser(userId);
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancel(@PathVariable Long id) {
        return appointmentService.cancelAppointment(id);
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable Long id, @RequestBody RescheduleRequest request) {    
        Appointment updated = appointmentService.rescheduleAppointment(id, request.getNewSlotId());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public Appointment getById(@PathVariable Long id) {
        return appointmentService.getById(id);
    }
}