package ie.gov.appointments.repository;

import ie.gov.appointments.entity.Appointment;
import ie.gov.appointments.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserUserId(Long userId);
    boolean existsByUserUserIdAndServiceServiceIdAndStatusNot(Long userId, Long serviceId, AppointmentStatus status);
}