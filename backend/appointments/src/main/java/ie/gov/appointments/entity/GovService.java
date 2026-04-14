package ie.gov.appointments.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "services")
public class GovService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;

    private String serviceName;

    private String description;
    
    private String category;       
       
    private Integer estimatedDuration; 
    
    @Column(columnDefinition = "TEXT")
    private String termsUrl;

    public GovService() {}

    public GovService(String serviceName, String description) {
        this.serviceName = serviceName;
        this.description = description;
    }

    public Long getServiceId() { return serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTermsUrl() { return termsUrl; }
    public void setTermsUrl(String termsUrl) { this.termsUrl = termsUrl; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }
}
