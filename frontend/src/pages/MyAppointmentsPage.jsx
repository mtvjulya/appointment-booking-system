import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function MyAppointmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get(`/appointments/user/${user.userId}`)
        .then((res) => setAppointments(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => a.appointmentId === appointmentId ? { ...a, status: 'CANCELLED' } : a)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment.');
    }
  };

  if (loading) return <section className="page-content"><div className="container">Loading...</div></section>;

  return (
    <section className="page-content">
      <div className="container">
        <h1>My Appointments</h1>

        {appointments.length === 0 ? (
          <p className="text-grey">You have no appointments yet.</p>
        ) : (
          <div className="grid-list">
            {appointments.map((apt) => (
              <div key={apt.appointmentId} className="card" style={{
                borderLeft: `4px solid ${
                  apt.status === 'BOOKED' ? 'var(--gov-green)' :
                  apt.status === 'CANCELLED' ? 'var(--gov-error)' : 'var(--gov-gold)'
                }`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3>{apt.service?.serviceName}</h3>
                    <p><strong>Date:</strong> {apt.timeSlot?.startTime
                      ? new Date(apt.timeSlot.startTime).toLocaleDateString('en-IE', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })
                      : 'N/A'}
                    </p>
                    <p><strong>Time:</strong> {apt.timeSlot?.startTime
                      ? new Date(apt.timeSlot.startTime).toLocaleTimeString('en-IE', {
                          hour: '2-digit', minute: '2-digit',
                        })
                      : 'N/A'}
                    </p>
                    <p><strong>Centre:</strong> {apt.centre?.centreName || 'N/A'}</p>
                    {apt.centre?.address && (
                      <p className="text-small">{apt.centre.address}, {apt.centre.eircode}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="status-badge" style={{
                      backgroundColor:
                        apt.status === 'BOOKED' ? 'var(--gov-green)' :
                        apt.status === 'CANCELLED' ? 'var(--gov-error)' : 'var(--gov-gold)',
                    }}>
                      {apt.status}
                    </span>
                  </div>
                </div>

                {(apt.status === 'BOOKED' || apt.status === 'RESCHEDULED') && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-danger" onClick={() => handleCancel(apt.appointmentId)}>
                      Cancel
                    </button>

                    <button className='btn-primary' onClick={() => navigate(`/reschedule/${apt.appointmentId}`)}>
                      Reschedule
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyAppointmentsPage;