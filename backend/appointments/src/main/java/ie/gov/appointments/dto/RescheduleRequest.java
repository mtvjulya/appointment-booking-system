package ie.gov.appointments.dto;
 
public class RescheduleRequest {
    private Long newSlotId;
    
    public Long getNewSlotId() {
        return newSlotId;
    }
    
    public void setNewSlotId(Long newSlotId) {
        this.newSlotId = newSlotId;
    }
}