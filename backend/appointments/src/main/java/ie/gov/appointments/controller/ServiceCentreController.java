package ie.gov.appointments.controller;

import ie.gov.appointments.entity.ServiceCentre;
import ie.gov.appointments.repository.ServiceCentreRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/centres")
public class ServiceCentreController {

    private final ServiceCentreRepository repository;

    public ServiceCentreController(ServiceCentreRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/service/{serviceId}")
    public List<ServiceCentre> getByService(@PathVariable Long serviceId) {
        return repository.findByServiceServiceId(serviceId);
    }
}