package ie.gov.appointments.repository;

import ie.gov.appointments.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserUserId(Long userId);
}