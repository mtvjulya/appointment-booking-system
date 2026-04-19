import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CreateSlotForm from '../components/CreateSlotForm';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';

function AdminPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [showCreateSlot, setShowCreateSlot] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsRes, slotsRes] = await Promise.all([
        api.get('/admin/appointments'),
        api.get('/slots')
      ]);
      setAppointments(appointmentsRes.data);
      setTimeSlots(slotsRes.data);
    } catch (err) {
      // TODO: Handle error in a more robust way, this is just a quick fix
      console.error('Failed to load admin data:', err);
    }
  };

  // Combine slots with appointments - bit messy but works for now
  const unifiedData = timeSlots.map(slot => {
    const appointment = appointments.find(apt => apt.timeSlot?.slotId === slot.slotId);
    return {
      ...slot,
      appointment: appointment || null
    };
  });

  const filteredData = unifiedData.filter(item => {
    // Status filter
    let matchesStatus = true;
    if (filterStatus === 'AVAILABLE') {
      matchesStatus = item.availabilityStatus === 'AVAILABLE';
    } else if (filterStatus === 'BOOKED') {
      matchesStatus = item.availabilityStatus === 'BOOKED';
    } else if (filterStatus === 'CANCELLED') {
      matchesStatus = item.appointment?.status === 'CANCELLED';
    } else if (filterStatus === 'RESCHEDULED') {
      matchesStatus = item.appointment?.status === 'RESCHEDULED';
    }
    
    // Search filter
    const matchesSearch = searchTerm === '' ||
      item.centre?.centreName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.centre?.service?.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.appointment?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.appointment?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminAuthTime');
      navigate('/admin/login');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) {
      return;
    }
    try {
      await api.delete(`/admin/slots/${slotId}`);
      await loadData();
    } catch (err) {
      console.error('Failed to delete slot:', err);
      alert('Failed to delete slot. Please try again.');
    }
  };

  return (
    <section className="page-content">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-header-actions">
            <button className="btn-primary" onClick={() => navigate('/admin/create-slots')}>
              + Create Time Slots
            </button>
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Unified Slots & Appointments Table */}
        <div className="admin-section">
          <h2>All Slots & Appointments</h2>
          
          <div className="admin-filters">
            <input
              type="text"
              placeholder="Search by user, centre or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="BOOKED">Booked</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RESCHEDULED">Rescheduled</option>
            </select>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Centre</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No slots found</td>
                  </tr>
                ) : (
                  filteredData
                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                    .map(item => (
                      <tr key={item.slotId}>
                        <td>{item.centre?.service?.serviceName || 'N/A'}</td>
                        <td>{item.centre?.centreName || 'N/A'}</td>
                        <td>{new Date(item.startTime).toLocaleDateString('en-IE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td>{new Date(item.startTime).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })} - {new Date(item.endTime).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>
                          <span style={{
                            color: item.appointment?.status === 'CANCELLED' ? '#dc3545' : 
                                   (item.appointment?.status === 'BOOKED' || item.appointment?.status === 'RESCHEDULED') ? '#28a745' : 
                                   '#1D70B8',
                            fontWeight: '700'
                          }}>
                            {item.appointment?.status || item.availabilityStatus}
                          </span>
                        </td>
                        <td>
                          {item.appointment ? (
                            <button 
                              className="btn-link"
                              onClick={() => setSelectedAppointment(item.appointment)}
                            >
                              View Details
                            </button>
                          ) : (
                            <button 
                              className="btn-link btn-danger"
                              onClick={() => handleDeleteSlot(item.slotId)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showCreateSlot && (
          <CreateSlotForm 
            onClose={() => setShowCreateSlot(false)}
            onSuccess={loadData}
          />
        )}
        
        {selectedAppointment && (
          <AppointmentDetailsModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onUpdate={loadData}
          />
        )}
      </div>
    </section>
  );
}

export default AdminPage;