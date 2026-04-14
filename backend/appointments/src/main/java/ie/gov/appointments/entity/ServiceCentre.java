package ie.gov.appointments.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_centres")
public class ServiceCentre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long centreId;

    private String centreName;
    private String address;
    private String eircode;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private GovService service;

    public ServiceCentre() {}

    public Long getCentreId() { return centreId; }

    public String getCentreName() { return centreName; }
    public void setCentreName(String centreName) { this.centreName = centreName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEircode() { return eircode; }
    public void setEircode(String eircode) { this.eircode = eircode; }

    public GovService getService() { return service; }
    public void setService(GovService service) { this.service = service; }
}