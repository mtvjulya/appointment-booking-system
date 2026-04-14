package ie.gov.appointments.repository;

import ie.gov.appointments.entity.ServiceCentre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceCentreRepository extends JpaRepository<ServiceCentre, Long> {
    List<ServiceCentre> findByServiceServiceId(Long serviceId);
}