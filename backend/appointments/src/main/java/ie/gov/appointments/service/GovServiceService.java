package ie.gov.appointments.service;

import ie.gov.appointments.entity.GovService;
import ie.gov.appointments.repository.GovServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GovServiceService {

    private final GovServiceRepository repository;

    public GovServiceService(GovServiceRepository repository) {
        this.repository = repository;
    }

    public GovService create(GovService service) {
        return repository.save(service);
    }

    public List<GovService> getAll() {
        return repository.findAll();
    }
}