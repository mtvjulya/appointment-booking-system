package ie.gov.appointments.service;

import ie.gov.appointments.dto.BookingRequest;
import ie.gov.appointments.entity.*;
import ie.gov.appointments.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GovServiceRepository serviceRepository;

    @Mock
    private TimeSlotRepository timeSlotRepository;

    @Mock
    private ServiceCentreRepository centreRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AppointmentService appointmentService;

    private User testUser;
    private GovService testService;
    private TimeSlot testSlot;
    private ServiceCentre testCentre;
    private BookingRequest bookingRequest;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john@test.com");

        testService = new GovService();
        testService.setServiceName("Driving Licence");

        testCentre = new ServiceCentre();
        testCentre.setCentreName("NDLS Dublin");

        testSlot = new TimeSlot();
        testSlot.setAvailabilityStatus(SlotStatus.AVAILABLE);
        testSlot.setStartTime(LocalDateTime.now().plusDays(1));
        testSlot.setEndTime(LocalDateTime.now().plusDays(1).plusMinutes(30));

        bookingRequest = new BookingRequest();
        bookingRequest.setUserId(1L);
        bookingRequest.setServiceId(1L);
        bookingRequest.setSlotId(1L);
        bookingRequest.setCentreId(1L);
        bookingRequest.setPpsn("1234567AB");
        bookingRequest.setDateOfBirth("1990-01-01");
    }

    @Test
    void bookAppointment_Success() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(testService));
        when(timeSlotRepository.findById(1L)).thenReturn(Optional.of(testSlot));
        when(centreRepository.findById(1L)).thenReturn(Optional.of(testCentre));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Appointment result = appointmentService.bookAppointment(bookingRequest);

        // Then
        assertNotNull(result);
        assertEquals(AppointmentStatus.BOOKED, result.getStatus());
        assertEquals(testUser, result.getUser());
        assertEquals(testService, result.getService());
        assertEquals(SlotStatus.BOOKED, testSlot.getAvailabilityStatus());
        
        verify(timeSlotRepository).save(testSlot);
        verify(appointmentRepository).save(any(Appointment.class));
        verify(emailService).sendAppointmentConfirmation(any(Appointment.class));
    }

    @Test
    void bookAppointment_SlotAlreadyBooked_ThrowsException() {
        // Given
        testSlot.setAvailabilityStatus(SlotStatus.BOOKED);
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(testService));
        when(timeSlotRepository.findById(1L)).thenReturn(Optional.of(testSlot));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> appointmentService.bookAppointment(bookingRequest));
        
        assertEquals("Slot already booked", exception.getMessage());
        verify(appointmentRepository, never()).save(any());
        verify(emailService, never()).sendAppointmentConfirmation(any());
    }

    @Test
    void cancelAppointment_Success() {
        // Given
        Appointment appointment = new Appointment();
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setTimeSlot(testSlot);
        testSlot.setAvailabilityStatus(SlotStatus.BOOKED);

        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Appointment result = appointmentService.cancelAppointment(1L);

        // Then
        assertEquals(AppointmentStatus.CANCELLED, result.getStatus());
        assertEquals(SlotStatus.AVAILABLE, testSlot.getAvailabilityStatus());
        
        verify(timeSlotRepository).save(testSlot);
        verify(appointmentRepository).save(appointment);
        verify(emailService).sendAppointmentCancellation(appointment);
    }

    @Test
    void rescheduleAppointment_Success() {
        // Given
        TimeSlot oldSlot = new TimeSlot();
        oldSlot.setAvailabilityStatus(SlotStatus.BOOKED);

        TimeSlot newSlot = new TimeSlot();
        newSlot.setAvailabilityStatus(SlotStatus.AVAILABLE);

        Appointment appointment = new Appointment();
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setTimeSlot(oldSlot);
        appointment.setUser(testUser);

        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(timeSlotRepository.findById(2L)).thenReturn(Optional.of(newSlot));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Appointment result = appointmentService.rescheduleAppointment(1L, 2L);

        // Then
        assertEquals(AppointmentStatus.RESCHEDULED, result.getStatus());
        assertEquals(newSlot, result.getTimeSlot());
        assertEquals(SlotStatus.AVAILABLE, oldSlot.getAvailabilityStatus());
        assertEquals(SlotStatus.BOOKED, newSlot.getAvailabilityStatus());
        
        verify(timeSlotRepository, times(2)).save(any(TimeSlot.class));
        verify(appointmentRepository).save(appointment);
        verify(notificationRepository).save(any(Notification.class));
        verify(emailService).sendAppointmentRescheduled(appointment);
    }

    @Test
    void rescheduleAppointment_NewSlotNotAvailable_ThrowsException() {
        // Given
        TimeSlot oldSlot = new TimeSlot();
        oldSlot.setAvailabilityStatus(SlotStatus.BOOKED);

        TimeSlot newSlot = new TimeSlot();
        newSlot.setAvailabilityStatus(SlotStatus.BOOKED);

        Appointment appointment = new Appointment();
        appointment.setTimeSlot(oldSlot);

        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(timeSlotRepository.findById(2L)).thenReturn(Optional.of(newSlot));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> appointmentService.rescheduleAppointment(1L, 2L));
        
        assertEquals("Time slot is not available", exception.getMessage());
        verify(appointmentRepository, never()).save(any());
        verify(emailService, never()).sendAppointmentRescheduled(any());
    }
}
