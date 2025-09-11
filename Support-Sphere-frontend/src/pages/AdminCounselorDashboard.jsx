import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Mock Data for Charts
const moodTrendData = {
  labels: ['May', 'June', 'July', 'August', 'September'],
  datasets: [{ label: 'Average Mood Score', data: [3.2, 3.5, 3.1, 3.8, 4.1], borderColor: 'rgb(59, 130, 246)', tension: 0.1 }],
};
const issuesData = {
  labels: ['Academic Stress', 'Anxiety', 'Depression', 'Relationships', 'Homesickness'],
  datasets: [{ label: 'Reported Issues', data: [120, 95, 60, 55, 40], backgroundColor: 'rgba(59, 130, 246, 0.5)' }],
};

// Reusable Stat Card Component
function StatCard({ title, value, change, isPositive = false }) {
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
    const Icon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className={`flex items-center text-sm font-semibold ${changeColor}`}>
                <Icon className="h-4 w-4 mr-1" />
                {change}% from last week
            </p>
        </div>
    );
}

function AdminCounselorDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <Link to="/admin/counselor-list" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Counselor List & Activity
                </Link>
                <Link to="/admin/volunteer-applications" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Volunteer Applications
                </Link>
                <Link to="/admin/current-volunteers" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Current Volunteers
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Weekly Highlights Section */}
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Anxiety Reports" value="95" change={15} isPositive={false} />
                <StatCard title="Avg. Mood Score" value="4.1 / 5" change={8} isPositive={true} />
                <StatCard title="Sessions Booked" value="42" change={5} isPositive={true} />
                <StatCard title="New Users" value="112" change={20} isPositive={true} />
            </div>
        </div>

        {/* Trend Checker Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Overall Mood Trend</h2>
                <Line data={moodTrendData} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Reported Issues</h2>
                <Bar data={issuesData} options={{ indexAxis: 'y' }} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCounselorDashboard;