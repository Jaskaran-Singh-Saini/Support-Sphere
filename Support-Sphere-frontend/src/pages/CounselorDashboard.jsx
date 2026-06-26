import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  confirmed: 'bg-green-100 text-green-800',
  pending:   'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
};

function CounselorDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    axios.get(apiUrl('/appointments/'))
      .then((res) => setAppointments(res.data))
      .catch(() => toast.error('Could not load appointments.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = (id, action) => {
    axios.post(apiUrl(`/appointments/${id}/${action}/`))
      .then(() => {
        toast.success(`Appointment ${action}ed.`);
        fetchAppointments();
      })
      .catch(() => toast.error(`Failed to ${action} appointment.`));
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Counselor Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-600">{user?.display_name || user?.username || 'Counselor'}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Appointments</h2>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 overflow-x-auto">
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments yet.</p>
            ) : (
              <table className="w-full text-left min-w-[600px]">
                <thead className="border-b">
                  <tr>
                    <th className="p-2 text-gray-600">Student</th>
                    <th className="p-2 text-gray-600">Date</th>
                    <th className="p-2 text-gray-600">Time</th>
                    <th className="p-2 text-gray-600">Status</th>
                    <th className="p-2 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => {
                    const { date, time } = formatDateTime(apt.scheduled_at);
                    return (
                      <tr key={apt.id} className="border-b last:border-0">
                        <td className="p-2 font-semibold text-blue-600">
                          <Link to={`/counselor/student/${apt.student}`} className="hover:underline">
                            Student #{apt.student}
                          </Link>
                        </td>
                        <td className="p-2">{date}</td>
                        <td className="p-2">{time}</td>
                        <td className="p-2">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${STATUS_STYLES[apt.status] || 'bg-gray-100 text-gray-700'}`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-2 flex gap-2">
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(apt.id, 'confirm')}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                              Confirm
                            </button>
                          )}
                          {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                            <button
                              onClick={() => updateStatus(apt.id, 'cancel')}
                              className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CounselorDashboard;