import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services')
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleServiceClick = (serviceId) => {
    if (!user) {
      navigate('/login', { state: { from: `/book/${serviceId}` } });
    } else {
      navigate(`/book/${serviceId}`);
    }
  };

  if (loading) return <div className="page-content"><div className="container">Loading services...</div></div>;

  return (
    <div className="page-content">
      <div className="container">
        <h1>Book an Appointment</h1>
        <p className="subtitle">
          Select a public service below to schedule your appointment.
        </p>

        <div className="grid-list">
          {services.map((s) => (
            <div
              key={s.serviceId}
              className="card card-interactive card-green-left"
              role="button"
              tabIndex={0}
              onClick={() => handleServiceClick(s.serviceId)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleServiceClick(s.serviceId); } }}
            >
              <div className="flex-between">
                <div>
                  <h3 className="heading-green">{s.serviceName}</h3>
                  <p>{s.description}</p>
                  {s.category && (
                    <span className="category-tag">
                      {s.category}
                    </span>
                  )}
                </div>
                <div className="text-right text-small text-grey">
                  {s.estimatedDuration && <p>{s.estimatedDuration} min</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <p className="text-grey">No services available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default ServicesPage;