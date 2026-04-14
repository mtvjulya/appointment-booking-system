package ie.gov.appointments.dto;

public class BookingRequest {

    private Long userId;
    private Long serviceId;
    private Long slotId;

   
    private String dateOfBirth;
    private String ppsn;
    private String address;
    private String eircode;
    private String notes;
    private int numberOfAttendees;
    private String accessibilityNeeds;
    private String documentNames;
    private Long centreId;

    public String getDocumentNames() { return documentNames; }
    public void setDocumentNames(String documentNames) { this.documentNames = documentNames; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getPpsn() { return ppsn; }
    public void setPpsn(String ppsn) { this.ppsn = ppsn; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEircode() { return eircode; }
    public void setEircode(String eircode) { this.eircode = eircode; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public int getNumberOfAttendees() { return numberOfAttendees; }
    public void setNumberOfAttendees(int numberOfAttendees) { this.numberOfAttendees = numberOfAttendees; }

    public String getAccessibilityNeeds() { return accessibilityNeeds; }
    public void setAccessibilityNeeds(String accessibilityNeeds) { this.accessibilityNeeds = accessibilityNeeds; }
    
    public Long getCentreId() { return centreId; }
    public void setCentreId(Long centreId) { this.centreId = centreId; }
}
