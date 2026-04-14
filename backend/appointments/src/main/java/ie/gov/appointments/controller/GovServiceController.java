package ie.gov.appointments.controller;

import ie.gov.appointments.entity.GovService;
import ie.gov.appointments.service.GovServiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class GovServiceController {

    private final GovServiceService service;

    public GovServiceController(GovServiceService service) {
        this.service = service;
    }

    @PostMapping
    public GovService create(@RequestBody GovService govService) {
        return service.create(govService);
    }

    @GetMapping
    public List<GovService> getAll() {
        return service.getAll();
    }
}