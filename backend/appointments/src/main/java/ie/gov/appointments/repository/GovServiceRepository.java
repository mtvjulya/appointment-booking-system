package ie.gov.appointments.repository;

import ie.gov.appointments.entity.GovService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GovServiceRepository extends JpaRepository<GovService, Long> {

}