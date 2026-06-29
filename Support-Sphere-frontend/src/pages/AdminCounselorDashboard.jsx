import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import { apiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const TABS = ['Overview', 'Crisis Alerts', 'Users'];

function StatCard({ title, value, color = 'blue' }) {
  const colors = {
    blue: 'border-blue-500 text-blue-600',
    red: 'border-red-500 text-red-600',
    green: 'border-green-500 text-green-600',
    orange: 'border-orange-500 text-orange-600',
    purple: 'border-purple-500 text-purple-600',
  };
  return (
    <div className={`bg-white p-5 rounded-lg shadow-sm border-l-4 ${colors[color]}`}>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value ?? '—'}</p>
    </div>
  );
}

function AdminCounselorDashboard() {
  const { logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [crisisAlerts, setCrisisAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(apiUrl('/admin/analytics/'))
      .then(r => { setAnalytics(r.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load analytics.'); setLoading(false); });
  }, []);

  useEffect(() => {
    if (activeTab === 'Crisis Alerts') {
      axios.get(apiUrl('/admin/crisis-alerts/'))
        .then(r => setCrisisAlerts(r.data))
        .catch(() => toast.error('Failed to load crisis alerts.'));
    }
    if (activeTab === 'Users') {
      axios.get(apiUrl('/admin/users/'))
        .then(r => setUsers(r.data))
        .catch(() => toast.error('Failed to load users.'));
    }
  }, [activeTab]);

  const resolveAlert = (id) => {
    axios.post(apiUrl(`/admin/crisis-alerts/${id}/resolve/`))
      .then(() => {
        toast.success('Alert marked as resolved.');
        setCrisisAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
      })
      .catch(() => toast.error('Failed to resolve alert.'));
  };

  const highlights = analytics?.weekly_highlights || {};

  const moodTrendData = {
    labels: analytics?.mood_trend?.labels || [],
    datasets: [{
      label: 'Reflections',
      data: analytics?.mood_trend?.values || [],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3,
      fill: true,
    }],
  };

  const issuesData = {
    labels: analytics?.issues?.labels || [],
    datasets: [{
      label: 'Assessments Taken',
      data: analytics?.issues?.values || [],
      backgroundColor: ['rgba(59,130,246,0.6)', 'rgba(16,185,129,0.6)', 'rgba(245,158,11,0.6)'],
    }],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">⚙️ Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Link to="/admin/counselor-list" className="text-sm text-blue-600 hover:underline">Counselor List</Link>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex gap-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab === 'Crisis Alerts' && highlights.crisis_alerts > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {highlights.crisis_alerts}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="p-6 max-w-7xl mx-auto space-y-8">

        {/* ── Overview Tab ── */}
        {activeTab === 'Overview' && (
          <>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white rounded-lg animate-pulse" />)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <StatCard title="Anxiety Reports" value={highlights.anxiety_reports} color="orange" />
                  <StatCard title="Avg Mood Score" value={highlights.avg_mood_score ? `${highlights.avg_mood_score}/5` : '—'} color="green" />
                  <StatCard title="Sessions Booked" value={highlights.sessions_booked} color="blue" />
                  <StatCard title="Registered Users" value={highlights.new_users} color="purple" />
                  <StatCard title="Open Crisis Alerts" value={highlights.crisis_alerts} color="red" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard title="Total Reflections" value={analytics?.total_reflections} color="green" />
                  <StatCard title="Students Reflected" value={analytics?.unique_students_reflected} color="blue" />
                  <StatCard title="Forum Posts" value={analytics?.forum_posts} color="blue" />
                  <StatCard title="Flagged Content" value={analytics?.flagged_content} color="red" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Reflection Activity Over Time</h2>
                    {(analytics?.mood_trend?.labels?.length ?? 0) > 0
                      ? <Line data={moodTrendData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                      : <p className="text-gray-400 text-center py-8">No reflection data yet.</p>
                    }
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Assessments by Type</h2>
                    {(analytics?.issues?.labels?.length ?? 0) > 0
                      ? <Bar data={issuesData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                      : <p className="text-gray-400 text-center py-8">No assessment data yet.</p>
                    }
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Crisis Alerts Tab ── */}
        {activeTab === 'Crisis Alerts' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Crisis Alerts</h2>
              <span className="text-sm text-gray-500">{crisisAlerts.filter(a => !a.resolved).length} unresolved</span>
            </div>
            {crisisAlerts.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No crisis alerts recorded.</p>
            ) : (
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Message Snippet</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {crisisAlerts.map(alert => (
                    <tr key={alert.id} className={`border-t ${alert.resolved ? 'opacity-50' : ''}`}>
                      <td className="p-3 whitespace-nowrap text-gray-500">{alert.created_at}</td>
                      <td className="p-3 font-medium">{alert.username}<br /><span className="text-xs text-gray-400">{alert.email}</span></td>
                      <td className="p-3 capitalize">{alert.source}</td>
                      <td className="p-3 max-w-xs truncate text-gray-600" title={alert.snippet}>{alert.snippet}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${alert.resolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {alert.resolved ? 'Resolved' : 'Open'}
                        </span>
                      </td>
                      <td className="p-3">
                        {!alert.resolved && (
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'Users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Registered Users ({users.length})</h2>
            </div>
            {users.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No users found.</p>
            ) : (
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr>
                    <th className="p-3">Username</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Joined</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{u.username}</td>
                      <td className="p-3 text-gray-500">{u.email}</td>
                      <td className="p-3 capitalize">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'counselor' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{u.role}</span>
                      </td>
                      <td className="p-3 text-gray-500">{u.date_joined}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminCounselorDashboard;