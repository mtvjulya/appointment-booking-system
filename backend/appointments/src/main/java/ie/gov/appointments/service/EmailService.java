package ie.gov.appointments.service;

import ie.gov.appointments.entity.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendAppointmentConfirmation(Appointment appointment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(appointment.getUser().getEmail());
            message.setSubject("Appointment Confirmation - " + appointment.getService().getServiceName());
            
            String emailBody = buildConfirmationEmail(appointment);
            message.setText(emailBody);
            
            mailSender.send(message);
            System.out.println("Confirmation email sent to: " + appointment.getUser().getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendAppointmentCancellation(Appointment appointment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(appointment.getUser().getEmail());
            message.setSubject("Appointment Cancelled - " + appointment.getService().getServiceName());
            
            String emailBody = buildCancellationEmail(appointment);
            message.setText(emailBody);
            
            mailSender.send(message);
            System.out.println("Cancellation email sent to: " + appointment.getUser().getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void sendAppointmentRescheduled(Appointment appointment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(appointment.getUser().getEmail());
            message.setSubject("Appointment Rescheduled - " + appointment.getService().getServiceName());
            
            String emailBody = buildRescheduledEmail(appointment);
            message.setText(emailBody);
            
            mailSender.send(message);
            System.out.println("Rescheduled email sent to: " + appointment.getUser().getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildConfirmationEmail(Appointment appointment) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return String.format("""
            Dear %s %s,
            
            Your appointment has been successfully booked.
            
            APPOINTMENT DETAILS:
            -------------------
            Service: %s
            Date: %s
            Time: %s
            Centre: %s
            Address: %s
            
            IMPORTANT INFORMATION:
            - Please arrive 10 minutes before your appointment time
            - Bring a valid form of identification
            - If you need to cancel or reschedule, please do so at least 24 hours in advance
            
            You can manage your appointment at: http://localhost:5173/my-appointments
            
            If you have any questions, please contact us.
            
            Best regards,
            Government Services Team
            """,
            appointment.getUser().getFirstName(),
            appointment.getUser().getLastName(),
            appointment.getService().getServiceName(),
            appointment.getTimeSlot().getStartTime().format(dateFormatter),
            appointment.getTimeSlot().getStartTime().format(timeFormatter),
            appointment.getCentre().getCentreName(),
            appointment.getCentre().getAddress()
        );
    }

    private String buildCancellationEmail(Appointment appointment) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return String.format("""
            Dear %s %s,
            
            Your appointment has been cancelled.
            
            CANCELLED APPOINTMENT:
            ---------------------
            Service: %s
            Date: %s
            Time: %s
            Centre: %s
            
            If you did not request this cancellation, please contact us immediately.
            
            You can book a new appointment at: http://localhost:5173/services
            
            Best regards,
            Government Services Team
            """,
            appointment.getUser().getFirstName(),
            appointment.getUser().getLastName(),
            appointment.getService().getServiceName(),
            appointment.getTimeSlot().getStartTime().format(dateFormatter),
            appointment.getTimeSlot().getStartTime().format(timeFormatter),
            appointment.getCentre().getCentreName()
        );
    }

    private String buildRescheduledEmail(Appointment appointment) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return String.format("""
            Dear %s %s,
            
            Your appointment has been rescheduled.
            
            NEW APPOINTMENT DETAILS:
            -----------------------
            Service: %s
            Date: %s
            Time: %s
            Centre: %s
            Address: %s
            
            IMPORTANT INFORMATION:
            - Please arrive 10 minutes before your appointment time
            - Bring a valid form of identification
            
            You can manage your appointment at: http://localhost:5173/my-appointments
            
            Best regards,
            Government Services Team
            """,
            appointment.getUser().getFirstName(),
            appointment.getUser().getLastName(),
            appointment.getService().getServiceName(),
            appointment.getTimeSlot().getStartTime().format(dateFormatter),
            appointment.getTimeSlot().getStartTime().format(timeFormatter),
            appointment.getCentre().getCentreName(),
            appointment.getCentre().getAddress()
        );
    }
}
