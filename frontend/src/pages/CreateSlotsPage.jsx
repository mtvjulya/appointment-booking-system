import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreateSlotsPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [centres, setCentres] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Generate next 60 days for calendar
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Default time slots (9:00 - 17:00, 30 min intervals)
  const defaultTimeSlots = [
    { start: '09:00', end: '09:30' },
    { start: '09:30', end: '10:00' },
    { start: '10:00', end: '10:30' },
    { start: '10:30', end: '11:00' },
    { start: '11:00', end: '11:30' },
    { start: '11:30', end: '12:00' },
    { start: '12:00', end: '12:30' },
    { start: '12:30', end: '13:00' },
    { start: '13:00', end: '13:30' },
    { start: '13:30', end: '14:00' },
    { start: '14:00', end: '14:30' },
    { start: '14:30', end: '15:00' },
    { start: '15:00', end: '15:30' },
    { start: '15:30', end: '16:00' },
    { start: '16:00', end: '16:30' },
    { start: '16:30', end: '17:00' },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      loadCentres(selectedService.serviceId);
    }
  }, [selectedService]);

  const loadServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCentres = async (serviceId) => {
    try {
      const res = await api.get(`/centres/service/${serviceId}`);
      setCentres(res.data);
      if (res.data.length === 1) {
        setSelectedCentre(res.data[0]);
      }
    } catch (err) {
      setError('Failed to load centres');
      console.error(err);
    }
  };

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

  const toggleDate = (dateStr) => {
    setSelectedDates(prev => {
      const newDates = prev.includes(dateStr) 
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr];
      return newDates;
    });
  };

  const toggleTimeSlot = (slot) => {
    const slotKey = `${slot.start}-${slot.end}`;
    setTimeSlots(prev => {
      const newSlots = prev.some(s => `${s.start}-${s.end}` === slotKey)
        ? prev.filter(s => `${s.start}-${s.end}` !== slotKey)
        : [...prev, slot];
      return newSlots;
    });
  };

  const handleCreateSlots = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const slotsToCreate = [];
      
      // Create slot for each combination of date and time
      selectedDates.forEach(date => {
        timeSlots.forEach(timeSlot => {
          slotsToCreate.push({
            centre: { centreId: selectedCentre.centreId },
            startTime: `${date}T${timeSlot.start}:00`,
            endTime: `${date}T${timeSlot.end}:00`,
            availabilityStatus: 'AVAILABLE'
          });
        });
      });

      // Create all slots
      await Promise.all(
        slotsToCreate.map(slot => api.post('/admin/slots', slot))
      );

      setSuccess(`Successfully created ${slotsToCreate.length} time slots!`);
      
      // Keep user on step 5 with selections preserved
      // Success message will stay visible

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create slots');
    } finally {
      setLoading(false);
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="page-content">
        <div className="container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container container-narrow">
        
        {/* Header */}
        <div className="admin-header" style={{ marginBottom: '2rem' }}>
          <h1>Create Time Slots</h1>
          <button className="btn-secondary" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </button>
        </div>

        {/* Progress indicator */}
        <div className="progress-bar">
          {['Select Service', 'Select Centre', 'Choose Dates', 'Choose Times', 'Confirm'].map((label, i) => (
            <div key={i} className={`progress-step ${step > i + 1 ? 'progress-step-done' : ''} ${step === i + 1 ? 'progress-step-active' : ''}`}>
              {label}
            </div>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div>
            <h2>Select a service</h2>
            <p className="section-desc">Choose the service for which you want to create time slots.</p>

            <div className="centre-grid">
              {services.map((service) => (
                <div
                  key={service.serviceId}
                  role="button"
                  tabIndex={0}
                  className={`centre-card ${selectedService?.serviceId === service.serviceId ? 'centre-card-selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedService(service); } }}
                >
                  <h3 className="centre-name">{service.serviceName}</h3>
                  <p className="centre-address">{service.description}</p>
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button className="btn-primary" onClick={() => {
                if (!selectedService) { setError('Please select a service.'); return; }
                setError('');
                setStep(2);
              }}>Continue</button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Centre */}
        {step === 2 && (
          <div>
            <h2>Select a centre</h2>
            <p className="section-desc">
              <strong>Service:</strong> {selectedService.serviceName}
            </p>

            <div className="centre-grid">
              {centres.map((centre) => (
                <div
                  key={centre.centreId}
                  role="button"
                  tabIndex={0}
                  className={`centre-card ${selectedCentre?.centreId === centre.centreId ? 'centre-card-selected' : ''}`}
                  onClick={() => setSelectedCentre(centre)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCentre(centre); } }}
                >
                  <h3 className="centre-name">{centre.centreName}</h3>
                  <p className="centre-address">{centre.address}</p>
                  {centre.eircode && <p className="centre-eircode">{centre.eircode}</p>}
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" onClick={() => {
                if (!selectedCentre) { setError('Please select a centre.'); return; }
                setError('');
                setStep(3);
              }}>Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Dates */}
        {step === 3 && (
          <div>
            <h2>Select dates</h2>
            <p className="section-desc">
              <strong>Centre:</strong> {selectedCentre.centreName}<br />
              Choose one or multiple dates for the time slots. Selected: <strong>{selectedDates.length}</strong>
            </p>

            <div className="calendar-grid">
              {availableDates.map((dateStr) => {
                const d = formatDate(dateStr);
                const isSelected = selectedDates.includes(dateStr);
                return (
                  <div
                    key={dateStr}
                    role="button"
                    tabIndex={0}
                    aria-label={`${d.day} ${d.date} ${d.month} ${d.year}`}
                    className={`calendar-day ${isSelected ? 'calendar-day-selected' : ''}`}
                    onClick={() => toggleDate(dateStr)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDate(dateStr); } }}
                  >
                    <span className="calendar-day-name">{d.day}</span>
                    <span className="calendar-day-date">{d.date}</span>
                    <span className="calendar-day-month">{d.month}</span>
                    <span className="calendar-day-year">{d.year}</span>
                  </div>
                );
              })}
            </div>

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn-primary" onClick={() => {
                if (selectedDates.length === 0) { setError('Please select at least one date.'); return; }
                setError('');
                setStep(4);
              }}>Continue</button>
            </div>
          </div>
        )}

        {/* STEP 4: Select Time Slots */}
        {step === 4 && (
          <div>
            <h2>Select time slots</h2>
            <p className="section-desc">
              Choose one or multiple time slots to create for the selected dates.<br />
              Selected: <strong>{timeSlots.length}</strong> time slots
            </p>

            <div className="time-slots-grid">
              {defaultTimeSlots.map((slot, idx) => {
                const isSelected = timeSlots.some(s => s.start === slot.start && s.end === slot.end);
                return (
                  <button
                    key={idx}
                    className={`time-slot-btn ${isSelected ? 'time-slot-selected' : ''}`}
                    onClick={() => toggleTimeSlot(slot)}
                  >
                    {slot.start} - {slot.end}
                  </button>
                );
              })}
            </div>

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(3)}>Back</button>
              <button className="btn-primary" onClick={() => {
                if (timeSlots.length === 0) { setError('Please select at least one time slot.'); return; }
                setError('');
                setStep(5);
              }}>Continue</button>
            </div>
          </div>
        )}

        {/* STEP 5: Confirm */}
        {step === 5 && (
          <div>
            <h2>Confirm slot creation</h2>
            <p className="section-desc">
              Review the details below before creating the time slots.
            </p>

            <div className="card card-green-left">
              <p><strong>Service:</strong> {selectedService.serviceName}</p>
              <p><strong>Centre:</strong> {selectedCentre.centreName}</p>
              <p><strong>Address:</strong> {selectedCentre.address}, {selectedCentre.eircode}</p>
              <hr className="separator" />
              <p><strong>Dates selected:</strong> {selectedDates.length}</p>
              <ul className="file-list">
                {selectedDates.sort().map(date => (
                  <li key={date}>{new Date(date + 'T00:00:00').toLocaleDateString('en-IE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                ))}
              </ul>
              <hr className="separator" />
              <p><strong>Time slots selected:</strong> {timeSlots.length}</p>
              <ul className="file-list">
                {timeSlots.sort((a, b) => a.start.localeCompare(b.start)).map((slot, idx) => (
                  <li key={idx}>{slot.start} - {slot.end}</li>
                ))}
              </ul>
              <hr className="separator" />
              <p><strong>Total slots to create:</strong> {selectedDates.length * timeSlots.length}</p>
            </div>

            {!success && (
              <div className="btn-row">
                <button className="btn-secondary" onClick={() => setStep(4)}>Back</button>
                <button 
                  className="btn-primary" 
                  onClick={handleCreateSlots}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Slots'}
                </button>
              </div>
            )}
            
            {success && (
              <div className="btn-row">
                <button className="btn-secondary" onClick={() => navigate('/admin')}>
                  Back to Dashboard
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setSelectedDates([]);
                    setTimeSlots([]);
                    setSelectedService(null);
                    setSelectedCentre(null);
                    setStep(1);
                    setSuccess('');
                  }}
                >
                  Create More Slots
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateSlotsPage;
