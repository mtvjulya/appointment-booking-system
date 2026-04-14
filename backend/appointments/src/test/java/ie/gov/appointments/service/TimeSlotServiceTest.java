package ie.gov.appointments.service;

import ie.gov.appointments.entity.SlotStatus;
import ie.gov.appointments.entity.TimeSlot;
import ie.gov.appointments.repository.TimeSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TimeSlotServiceTest {

    @Mock
    private TimeSlotRepository timeSlotRepository;

    @InjectMocks
    private TimeSlotService timeSlotService;

    private TimeSlot testSlot;

    @BeforeEach
    void setUp() {
        testSlot = new TimeSlot();
        testSlot.setAvailabilityStatus(SlotStatus.AVAILABLE);
        testSlot.setStartTime(LocalDateTime.now().plusDays(1));
        testSlot.setEndTime(LocalDateTime.now().plusDays(1).plusMinutes(30));
    }

    @Test
    void createSlot_Success() {
        // Given
        when(timeSlotRepository.save(any(TimeSlot.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        TimeSlot result = timeSlotService.createSlot(testSlot);

        // Then
        assertNotNull(result);
        assertEquals(SlotStatus.AVAILABLE, result.getAvailabilityStatus());
        verify(timeSlotRepository).save(testSlot);
    }

    @Test
    void deleteSlot_Success() {
        // Given
        Long slotId = 1L;

        // When
        timeSlotService.deleteSlot(slotId);

        // Then
        verify(timeSlotRepository).deleteById(slotId);
    }

    @Test
    void getAvailableCount_ReturnsCorrectCount() {
        // Given
        when(timeSlotRepository.countByAvailabilityStatus(SlotStatus.AVAILABLE)).thenReturn(5L);

        // When
        long count = timeSlotService.getAvailableCount();

        // Then
        assertEquals(5L, count);
        verify(timeSlotRepository).countByAvailabilityStatus(SlotStatus.AVAILABLE);
    }
}
