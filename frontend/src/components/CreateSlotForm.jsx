import { useState, useEffect } from 'react';
import api from '../services/api';

function CreateSlotForm({ onClose, onSuccess }) {
  const [centres, setCentres] = useState([]);
  const [form, setForm] = useState({
    centreId: '',
    startTime: '',
    endTime: '',
    date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/centres')
      .then(res => setCentres(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Combine date and time
      const startDateTime = `${form.date}T${form.startTime}:00`;
      const endDateTime = `${form.date}T${form.endTime}:00`;

      await api.post('/admin/slots', {
        centre: { centreId: Number(form.centreId) },
        startTime: startDateTime,
        endTime: endDateTime,
        availabilityStatus: 'AVAILABLE'
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Time Slot</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label htmlFor="centre">Centre <span style={{color: 'var(--gov-error)'}}>*</span></label>
            <select
              id="centre"
              value={form.centreId}
              onChange={(e) => setForm({ ...form, centreId: e.target.value })}
              required
            >
              <option value="">Select a centre</option>
              {centres.map(centre => (
                <option key={centre.centreId} value={centre.centreId}>
                  {centre.centreName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date <span style={{color: 'var(--gov-error)'}}>*</span></label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time <span style={{color: 'var(--gov-error)'}}>*</span></label>
              <input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time <span style={{color: 'var(--gov-error)'}}>*</span></label>
              <input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSlotForm;
