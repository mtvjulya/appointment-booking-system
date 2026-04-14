import { useState } from 'react';
import api from '../services/api';

function AppointmentDetailsModal({ appointment, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-IE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setLoading(true);
    try {
      await api.put(`/appointments/${appointment.appointmentId}/cancel`);
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Appointment Details</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Appointment Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{appointment.appointmentId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Service:</span>
                <span className="detail-value">{appointment.service?.serviceName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Centre:</span>
                <span className="detail-value">{appointment.centre?.centreName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date & Time:</span>
                <span className="detail-value">{formatDateTime(appointment.timeSlot?.startTime)}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>User Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">
                  {appointment.user?.firstName} {appointment.user?.lastName}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{appointment.user?.email || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{appointment.user?.phoneNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Personal Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">{appointment.dateOfBirth || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">PPS Number:</span>
                <span className="detail-value">{appointment.ppsn || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{appointment.address || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Eircode:</span>
                <span className="detail-value">{appointment.eircode || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Accessibility Needs:</span>
                <span className="detail-value">{appointment.accessibilityNeeds || 'None'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Number of Attendees:</span>
                <span className="detail-value">{appointment.numberOfAttendees || '1'}</span>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <div className="detail-section">
              <h3>Additional Notes</h3>
              <p className="detail-notes">{appointment.notes}</p>
            </div>
          )}

          {appointment.documentNames && (
            <div className="detail-section">
              <h3>Documents</h3>
              <p className="detail-value">{appointment.documentNames}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>Timestamps</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDateTime(appointment.createdAt)}</span>
              </div>
              {appointment.updatedAt && (
                <div className="detail-item">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDateTime(appointment.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {(appointment.status === 'BOOKED' || appointment.status === 'RESCHEDULED') && (
            <button 
              className="btn-danger" 
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? 'Cancelling...' : 'Cancel Appointment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailsModal;
