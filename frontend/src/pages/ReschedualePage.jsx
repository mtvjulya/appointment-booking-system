import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function ReschedulePage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [appointment, setAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    api.get(`/appointments/${appointmentId}`)
      .then(res => {
        setAppointment(res.data);
        return api.get(`/slots/available/${res.data.centre.centreId}`);
      })
      .then(res => {
        setAvailableSlots(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading appointment:', err);
        alert('Failed to load appointment details');
        navigate('/my-appointments');
      });
  }, [appointmentId, user, navigate]);
  
  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const date = slot.startTime.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});
  
  const availableDates = Object.keys(slotsByDate).sort();
  
  // Format functions (same as BookingPage)
  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      year: d.getFullYear(),
    };
  };

  const formatTime = (isoStr) => {
    return new Date(isoStr).toLocaleTimeString('en-IE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const formatFullDate = (isoStr) => {
    return new Date(isoStr).toLocaleDateString('en-IE', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    });
  };
  
  const handleReschedule = async () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }
    
    try {
      await api.put(`/appointments/${appointmentId}/reschedule`, {
        newSlotId: selectedSlot.slotId
      });
      alert('Appointment rescheduled successfully!');
      navigate('/my-appointments');
    } catch (error) {
      console.error('Reschedule error:', error);
      alert(error.response?.data?.message || 'Failed to reschedule appointment');
    }
  };
  
  if (loading) {
    return <div className="page-content"><p>Loading...</p></div>;
  }
  
  if (!appointment) {
    return <div className="page-content"><p>Appointment not found</p></div>;
  }
  
  return (
    <div className="page-content">
      <div className="container container-narrow">
        <h1>Reschedule Appointment</h1>
        
        <div className="current-appointment-info">
          <h2>Current Appointment</h2>
          <div className="card">
            <p><strong>Service:</strong> {appointment.service.serviceName}</p>
            <p><strong>Centre:</strong> {appointment.centre.centreName}</p>
            <p><strong>Current Date & Time:</strong> {formatFullDate(appointment.timeSlot.startTime)} at {formatTime(appointment.timeSlot.startTime)}</p>
          </div>
        </div>
        
        <div className="reschedule-section">
          <h2>Select New Date & Time</h2>
          
          {availableDates.length === 0 ? (
            <p>No available slots for this centre at the moment.</p>
          ) : (
            <>
              {/* Calendar grid (same as BookingPage) */}
              <div className="calendar-grid">
                {availableDates.map((dateStr) => {
                  const d = formatDate(dateStr);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <div
                      key={dateStr}
                      role="button"
                      tabIndex={0}
                      aria-label={`${d.day} ${d.date} ${d.month} ${d.year}`}
                      className={`calendar-day ${isSelected ? 'calendar-day-selected' : ''}`}
                      onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                      onKeyDown={(e) => { 
                        if (e.key === 'Enter' || e.key === ' ') { 
                          e.preventDefault(); 
                          setSelectedDate(dateStr); 
                          setSelectedSlot(null); 
                        } 
                      }}
                    >
                      <span className="calendar-day-name">{d.day}</span>
                      <span className="calendar-day-date">{d.date}</span>
                      <span className="calendar-day-month">{d.month}</span>
                      <span className="calendar-day-year">{d.year}</span>
                    </div>
                  );
                })}
              </div>

              {/* Time slots for selected date */}
              {selectedDate && (
                <div>
                  <h3>Choose a time on {formatFullDate(selectedDate + 'T00:00:00')}</h3>
                  <div className="time-slots-grid">
                    {slotsByDate[selectedDate]
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((slot) => (
                        <button
                          key={slot.slotId}
                          className={`time-slot-btn ${selectedSlot?.slotId === slot.slotId ? 'time-slot-selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {formatTime(slot.startTime)}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Confirmation prompt */}
              {selectedSlot && (
                <div className="card card-green-left card-highlight">
                  <p>
                    Reschedule appointment to <strong>{formatTime(selectedSlot.startTime)}</strong> on{' '}
                    <strong>{formatFullDate(selectedSlot.startTime)}</strong>?
                  </p>
                </div>
              )}
            </>
          )}
          
          {/* Action Buttons */}
          <div className="btn-row">
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/my-appointments')}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleReschedule}
              disabled={!selectedSlot}
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
          
export default ReschedulePage;