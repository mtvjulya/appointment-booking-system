package ie.gov.appointments.service;

import ie.gov.appointments.dto.BookingRequest;
import ie.gov.appointments.entity.*;
import ie.gov.appointments.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final GovServiceRepository serviceRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final ServiceCentreRepository centreRepository; 
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            GovServiceRepository serviceRepository,
            TimeSlotRepository timeSlotRepository,
            ServiceCentreRepository centreRepository,
            NotificationRepository notificationRepository,
            EmailService emailService) {

        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.centreRepository = centreRepository;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
    }

    public Appointment bookAppointment(BookingRequest request) {
        // TODO: add validation for booking date (should be at least 24h in advance)
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        GovService service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        TimeSlot slot = timeSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (slot.getAvailabilityStatus() == SlotStatus.BOOKED) {
            throw new RuntimeException("Slot already booked");
        }

        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setService(service);
        appointment.setTimeSlot(slot);

        ServiceCentre centre = centreRepository.findById(request.getCentreId())
        .orElseThrow(() -> new RuntimeException("Centre not found"));
        appointment.setCentre(centre);

        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setDateOfBirth(request.getDateOfBirth());
        appointment.setPpsn(request.getPpsn());
        appointment.setAddress(request.getAddress());
        appointment.setEircode(request.getEircode());
        appointment.setNotes(request.getNotes());
        appointment.setNumberOfAttendees(request.getNumberOfAttendees());
        appointment.setAccessibilityNeeds(request.getAccessibilityNeeds());
        appointment.setDocumentNames(request.getDocumentNames());

        slot.setAvailabilityStatus(SlotStatus.BOOKED);

        timeSlotRepository.save(slot);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send confirmation email
        emailService.sendAppointmentConfirmation(savedAppointment);
        
        return savedAppointment;
    }

    public List<Appointment> getByUser(Long userId) {
        return appointmentRepository.findByUserUserId(userId);
    }

    public Appointment getById(Long id) {
        return appointmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public long getTotalCount() {
        return appointmentRepository.count();
    }

    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Appointment is already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        TimeSlot slot = appointment.getTimeSlot();
        if (slot != null) {
            slot.setAvailabilityStatus(SlotStatus.AVAILABLE);
            timeSlotRepository.save(slot);
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send cancellation email
        emailService.sendAppointmentCancellation(savedAppointment);
        
        return savedAppointment;
    }

    @Transactional
    public Appointment rescheduleAppointment(Long appointmentId, Long newSlotId) {
    
    Appointment appointment = appointmentRepository.findById(appointmentId)
        .orElseThrow(() -> new RuntimeException("Appointment not found"));
    
    
    TimeSlot oldSlot = appointment.getTimeSlot();
    
    
    TimeSlot newSlot = timeSlotRepository.findById(newSlotId)
        .orElseThrow(() -> new RuntimeException("Time slot not found"));
    
   
    if (newSlot.getAvailabilityStatus() != SlotStatus.AVAILABLE) {
        throw new RuntimeException("Time slot is not available");
    }
    
    
    oldSlot.setAvailabilityStatus(SlotStatus.AVAILABLE);
    timeSlotRepository.save(oldSlot);
    

    newSlot.setAvailabilityStatus(SlotStatus.BOOKED);
    timeSlotRepository.save(newSlot);
    
    
    appointment.setTimeSlot(newSlot);
    appointment.setStatus(AppointmentStatus.RESCHEDULED);
    appointment.setUpdatedAt(LocalDateTime.now());
    
    Notification notification = new Notification();
    notification.setUser(appointment.getUser());
    notification.setAppointment(appointment);
    notification.setMessage("Your appointment has been rescheduled");
    notification.setType("RESCHEDULED");
    notificationRepository.save(notification);
    
    Appointment savedAppointment = appointmentRepository.save(appointment);
    
    // Send rescheduled email
    emailService.sendAppointmentRescheduled(savedAppointment);
    
    return savedAppointment;
}
}