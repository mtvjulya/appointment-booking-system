import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function BookingPage() {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [termsError, setTermsError] = useState(false);
  const [form, setForm] = useState({
    fullName: user ? `${user.name}` : '',
    dateOfBirth: '',
    ppsn: '',
    address: '',
    eircode: '',
    notes: '',
    accessibilityNeeds: '',
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/services'),
      api.get(`/centres/service/${serviceId}`),
    ]).then(([servicesRes, centresRes]) => {
      const svc = servicesRes.data.find((s) => s.serviceId === Number(serviceId));
      setService(svc);
      setCentres(centresRes.data);
      if (centresRes.data.length === 1) {
        setSelectedCentre(centresRes.data[0]);
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [serviceId]);

  useEffect(() => {
    if (selectedCentre) {
      api.get(`/slots/available/${selectedCentre.centreId}`)
        .then((res) => {
          setSlots(res.data);
          setSelectedDate(null);
          setSelectedSlot(null);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [selectedCentre]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateFields = () => {
    const errors = {};
    
    // Date of Birth validation
    if (!form.dateOfBirth) {
      errors.dateOfBirth = 'Date of Birth is required';
    } else {
      const dob = new Date(form.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 16 || age > 120) {
        errors.dateOfBirth = 'You must be at least 16 years old';
      }
    }

    // PPS Number validation (format: 7 digits + 1-2 letters)
    if (!form.ppsn) {
      errors.ppsn = 'PPS Number is required';
    } else if (!/^\d{7}[A-Z]{1,2}$/i.test(form.ppsn.replace(/\s/g, ''))) {
      errors.ppsn = 'Invalid PPS Number format (e.g., 1234567AB)';
    }

    // Address validation
    if (!form.address) {
      errors.address = 'Address is required';
    } else if (form.address.length < 5) {
      errors.address = 'Please enter a valid address';
    }

    // Eircode validation (format: A65 F4E2 or A65F4E2)
    if (!form.eircode) {
      errors.eircode = 'Eircode is required';
    } else if (!/^[A-Z]\d{2}\s?[A-Z0-9]{4}$/i.test(form.eircode.replace(/\s/g, ''))) {
      errors.eircode = 'Invalid Eircode format (e.g., D08 XY00)';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const fileNames = files.map((f) => f.name).join(', ');
      await api.post('/appointments/book', {
        userId: user.userId,
        serviceId: Number(serviceId),
        slotId: selectedSlot.slotId,
        centreId: selectedCentre.centreId,
        ...form,
        documentNames: fileNames || null,
      });
      
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  // Group slots by date - probably could optimize this later
  const mySlotsByDate = {};
  slots.forEach((slot) => {
    const dateKey = slot.startTime.substring(0, 10);
    if (!mySlotsByDate[dateKey]) mySlotsByDate[dateKey] = [];
    mySlotsByDate[dateKey].push(slot);
  });
  const availableDates = Object.keys(mySlotsByDate).sort();

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
    return new Date(isoStr).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatFullDate = (isoStr) => {
    return new Date(isoStr).toLocaleDateString('en-IE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) return <section className="page-content"><div className="container">Loading...</div></section>;
  if (!service) return <section className="page-content"><div className="container"><p>Service not found.</p></div></section>;

  const stepLabels = ['Your details', 'Select centre', 'Choose a slot', 'Confirm'];

  return (
    <section className="page-content">
      <div className="container container-narrow">

        {/* Progress indicator */}
        {step <= 4 && (
          <div className="progress-bar">
            {stepLabels.map((label, i) => (
              <div key={i} className={`progress-step ${step > i ? 'progress-step-done' : ''} ${step === i + 1 ? 'progress-step-active' : ''}`}>
                {label}
              </div>
            ))}
          </div>
        )}

        <h1>{service.serviceName}</h1>
        {error && <p className="error-message">{error}</p>}

        {/* ===== STEP 1: Personal Details + T&C ===== */}
        {step === 1 && (
          <div>
            <h2>Your details</h2>
            <p className="section-desc">
              Please provide the following information for your appointment.
            </p>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue={form.fullName} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="text" defaultValue={user.email} />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth <span style={{color: 'var(--gov-error)'}}>*</span></label>
              <input 
                id="dob" 
                type="date" 
                value={form.dateOfBirth}
                onChange={(e) => handleFormChange('dateOfBirth', e.target.value)} 
                required 
                max={new Date().toISOString().split('T')[0]}
                className={fieldErrors.dateOfBirth ? 'input-error' : ''}
              />
              {fieldErrors.dateOfBirth && <p className="field-error-message">{fieldErrors.dateOfBirth}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="ppsn">PPS Number <span style={{color: 'var(--gov-error)'}}>*</span></label>
              <input 
                id="ppsn" 
                type="text" 
                value={form.ppsn}
                onChange={(e) => handleFormChange('ppsn', e.target.value.toUpperCase())}
                placeholder="e.g. 1234567AB" 
                required
                className={fieldErrors.ppsn ? 'input-error' : ''}
              />
              {fieldErrors.ppsn && <p className="field-error-message">{fieldErrors.ppsn}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address <span style={{color: 'var(--gov-error)'}}>*</span></label>
              <input 
                id="address" 
                type="text" 
                value={form.address}
                onChange={(e) => handleFormChange('address', e.target.value)} 
                required
                placeholder="e.g., 123 Main Street, Dublin"
                className={fieldErrors.address ? 'input-error' : ''}
              />
              {fieldErrors.address && <p className="field-error-message">{fieldErrors.address}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="eircode">Eircode <span style={{color: 'var(--gov-error)'}}>*</span></label>
              <input 
                id="eircode" 
                type="text" 
                value={form.eircode}
                onChange={(e) => handleFormChange('eircode', e.target.value.toUpperCase())}
                placeholder="e.g. D08 XY00" 
                required
                maxLength="8"
                className={fieldErrors.eircode ? 'input-error' : ''}
              />
              {fieldErrors.eircode && <p className="field-error-message">{fieldErrors.eircode}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="accessibility">Accessibility requirements (optional)</label>
              <select id="accessibility" value={form.accessibilityNeeds}
                onChange={(e) => handleFormChange('accessibilityNeeds', e.target.value)}>
                <option value="">None</option>
                <option value="Wheelchair access">Wheelchair access</option>
                <option value="Sign language interpreter">Sign language interpreter</option>
                <option value="Large print documents">Large print documents</option>
                <option value="Other">Other (specify in notes)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="documents">Upload supporting documents (optional)</label>
              <input id="documents" type="file" multiple onChange={handleFileChange} />
              {files.length > 0 && (
                <ul className="file-list">
                  {files.map((f, i) => <li key={i}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>)}
                </ul>
              )}
              <p className="file-note">
                Accepted formats: PDF, JPG, PNG. Max 5MB per file.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional notes (optional)</label>
              <textarea id="notes" value={form.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                rows={3} />
            </div>

            {/* Terms and Conditions */}
            <div className={`card card-bg-grey ${termsError ? 'card-error' : ''}`}>
              <div className="terms-checkbox-wrapper">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTermsAccepted(true);
                      setTermsError(false);
                    } else {
                      setTermsAccepted(false);
                    }
                  }}
                  className={`checkbox-large ${termsError ? 'checkbox-error' : ''}`}
                />
                <label htmlFor="terms" className="terms-label">
                  I have read and agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setShowTerms(!showTerms); 
                    }}
                    className="btn-link"
                  >
                    Terms and Conditions
                  </button>
                </label>
              </div>
              {termsError && <p className="field-error-message" style={{marginTop: '0.5rem'}}>You must accept the Terms and Conditions to continue</p>}

              {showTerms && service.termsUrl && (
                <div className="terms-content">
                  {service.termsUrl}
                </div>
              )}
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                const fieldsValid = validateFields();
                
                if (!termsAccepted) {
                  setTermsError(true);
                }
                
                if (!fieldsValid || !termsAccepted) {
                  setError('Please fill in all required fields and accept the Terms and Conditions');
                  return;
                }
                
                setError('');
                setTermsError(false);
                setStep(2);
              }}
            >
              Continue
            </button>
          </div>
        )}

        {/* ===== STEP 2: Select Centre ===== */}
        {step === 2 && (
          <div>
            <h2>Select a centre</h2>
            <p className="section-desc">
              Choose where you would like to attend your appointment.
            </p>

            <div className="centre-grid">
              {centres.map((c) => (
                <div
                  key={c.centreId}
                  className={`centre-card ${selectedCentre?.centreId === c.centreId ? 'centre-card-selected' : ''}`}
                  onClick={() => setSelectedCentre(c)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedCentre(c)}
                >
                  <h3 className="centre-name">{c.centreName}</h3>
                  <p className="centre-address">{c.address}</p>
                  <p className="centre-eircode">{c.eircode}</p>
                </div>
              ))}
            </div>

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" onClick={() => {
                if (!selectedCentre) {
                  setError('Please select a centre.');
                  return;
                }
                setError('');
                setStep(3);
              }}>Continue</button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: Calendar + Time Slots ===== */}
        {step === 3 && (
          <div>
            <h2>Select appointment</h2>
            <p className="text-grey">
              <strong>Centre:</strong> {selectedCentre.centreName}, {selectedCentre.address}
            </p>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-link text-small"
              style={{ marginBottom: '1.5rem', display: 'block' }}
            >
              Pick a different centre
            </button>

            {availableDates.length === 0 ? (
              <p className="text-red">No available slots for this centre at the moment.</p>
            ) : (
              <>
                {/* Calendar grid */}
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
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDate(dateStr); setSelectedSlot(null); } }}
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
                      {mySlotsByDate[selectedDate]
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
                      Book an appointment for <strong>{formatTime(selectedSlot.startTime)}</strong> on{' '}
                      <strong>{formatFullDate(selectedSlot.startTime)}</strong>?
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn-primary" onClick={() => {
                if (!selectedSlot) {
                  setError('Please select a time slot.');
                  return;
                }
                setError('');
                setStep(4);
              }}>Continue</button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: Confirm ===== */}
        {step === 4 && (
          <div>
            <h2>Confirm your appointment</h2>
            <p className="section-desc">
              Please review the details below before confirming.
            </p>

            <div className="card card-green-left">
              <p><strong>Service:</strong> {service.serviceName}</p>
              <p><strong>Centre:</strong> {selectedCentre.centreName}</p>
              <p><strong>Address:</strong> {selectedCentre.address}, {selectedCentre.eircode}</p>
              <p><strong>Date:</strong> {formatFullDate(selectedSlot.startTime)}</p>
              <p><strong>Time:</strong> {formatTime(selectedSlot.startTime)} — {formatTime(selectedSlot.endTime)}</p>
              <hr className="separator" />
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {form.dateOfBirth && <p><strong>Date of Birth:</strong> {form.dateOfBirth}</p>}
              <p><strong>PPS Number:</strong> {form.ppsn || 'Not provided'}</p>
              {form.address && <p><strong>Address:</strong> {form.address}</p>}
              {form.eircode && <p><strong>Eircode:</strong> {form.eircode}</p>}
              {form.accessibilityNeeds && <p><strong>Accessibility:</strong> {form.accessibilityNeeds}</p>}
              {files.length > 0 && <p><strong>Documents:</strong> {files.map(f => f.name).join(', ')}</p>}
              {form.notes && <p><strong>Notes:</strong> {form.notes}</p>}
            </div>

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(3)}>Back</button>
              <button className="btn-primary" onClick={handleSubmit}>Confirm booking</button>
            </div>
          </div>
        )}

        {/* ===== STEP 5: Success ===== */}
        {step === 5 && (
          <div className="text-center">
            <div className="success-icon">✓</div>
            <h1>Appointment confirmed</h1>
            <p className="subtitle">
              A confirmation has been sent to <strong>{user.email}</strong>.
            </p>

            <div className="card card-green-left" style={{ textAlign: 'left' }}>
              <p><strong>Service:</strong> {service.serviceName}</p>
              <p><strong>Centre:</strong> {selectedCentre.centreName}, {selectedCentre.address}</p>
              <p><strong>Date:</strong> {formatFullDate(selectedSlot.startTime)}</p>
              <p><strong>Time:</strong> {formatTime(selectedSlot.startTime)}</p>
            </div>

            <div className="btn-row-center">
              <button className="btn-primary" onClick={() => navigate('/my-appointments')}>View my appointments</button>
              <button className="btn-secondary" onClick={() => navigate('/services')}>Book another</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BookingPage;