import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { apiUrl } from '../config/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function AdminCounselorDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    axios.get(apiUrl('/admin/analytics/'))
      .then(response => setAnalytics(response.data))
      .catch(error => console.error('Analytics load failed:', error));
  }, []);

  const moodTrendData = {
    labels: analytics?.mood_trend?.labels || [],
    datasets: [{
      label: 'Reflection Activity',
      data: analytics?.mood_trend?.values || [],
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1,
    }],
  };

  const issuesData = {
    labels: analytics?.issues?.labels || [],
    datasets: [{
      label: 'Assessment Reports',
      data: analytics?.issues?.values || [],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    }],
  };

  const highlights = analytics?.weekly_highlights || {};

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {isMenuOpen && (
              <div onMouseLeave={() => setIsMenuOpen(false)} className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border">
                <Link to="/admin/counselor-list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Counselor List</Link>
                <Link to="/admin/volunteer-applications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Volunteer Applications</Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Campus Wellness Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard title="Anxiety Reports" value={highlights.anxiety_reports ?? '—'} />
            <StatCard title="Avg. Mood Score" value={highlights.avg_mood_score ? `${highlights.avg_mood_score} / 5` : '—'} />
            <StatCard title="Sessions Booked" value={highlights.sessions_booked ?? '—'} />
            <StatCard title="Registered Users" value={highlights.new_users ?? '—'} />
            <StatCard title="Open Crisis Alerts" value={highlights.crisis_alerts ?? '—'} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reflection Activity Trend</h2>
            <Line data={moodTrendData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Assessment Distribution</h2>
            <Bar data={issuesData} options={{ indexAxis: 'y' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCounselorDashboard;
