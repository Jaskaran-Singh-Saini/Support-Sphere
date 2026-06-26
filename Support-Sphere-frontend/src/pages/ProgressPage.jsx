import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useMood } from '../context/MoodContext';
import { FireIcon, PencilSquareIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/solid';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StatCard({ icon: Icon, title, value, color }) {
  const colorClasses = {
    orange: 'text-orange-600 bg-orange-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function Achievement({ icon: Icon, title, achieved = false }) {
    return (
        <div className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center text-center ${achieved ? 'bg-amber-50 border-amber-300' : 'bg-gray-100 border-gray-200'}`}>
            <Icon className={`h-10 w-10 mb-2 ${achieved ? 'text-amber-500' : 'text-gray-400'}`} />
            <p className={`font-semibold ${achieved ? 'text-amber-800' : 'text-gray-500'}`}>{title}</p>
        </div>
    );
}

function calcStreak(reflections) {
  if (!reflections.length) return 0;
  const days = [...new Set(reflections.map(r => r.created_at?.slice(0, 10)))].sort().reverse();
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const day of days) {
    const d = new Date(day);
    const diff = Math.round((cursor - d) / 86400000);
    if (diff <= 1) { streak++; cursor = d; }
    else break;
  }
  return streak;
}

function ProgressPage() {
  const { moodEntries, refreshMoods } = useMood();
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(apiUrl('/reflections/'))
      .then(response => {
        setReflections(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reflections:', error);
        setLoading(false);
      });
    refreshMoods?.();
  }, []);

  const chartData = {
    labels: moodEntries.map(entry => entry.date),
    datasets: [{
      label: 'Your Mood',
      data: moodEntries.map(entry => entry.score),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.4,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 5, ticks: { stepSize: 1, callback: (value) => ['','Awful', 'Bad', 'Okay', 'Good', 'Great'][value] }}},
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Progress</h1>
            <p className="text-gray-600">See your wellness journey at a glance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={FireIcon} title="Current Streak" value={`${calcStreak(reflections)} Days`} color="orange" />
            <StatCard icon={PencilSquareIcon} title="Reflections Written" value={reflections.length} color="blue" />
            <StatCard icon={SparklesIcon} title="Mood Check-ins" value={moodEntries.length} color="purple" />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mood History</h2>
            <div className="h-64">
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reflection History</h2>
            <div className="space-y-4">
                {loading ? <p>Loading reflections...</p> : 
                 reflections.length > 0 ? reflections.map(reflection => (
                    <div key={reflection.id} className="p-4 bg-slate-50 rounded-lg border">
                        <p className="font-semibold text-gray-500">{reflection.formatted_date} - (Mood: {reflection.mood})</p>
                        <p className="text-gray-700 mt-2 italic">"{reflection.prompt1_text}"</p>
                    </div>
                 )) : <p>You haven't saved any reflections yet.</p>
                }
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Achievement icon={TrophyIcon} title="First Step" achieved={reflections.length > 0} />
                <Achievement icon={PencilSquareIcon} title="Journalist" achieved={reflections.length >= 5} />
                <Achievement icon={FireIcon} title="7-Day Streak" achieved={calcStreak(reflections) >= 7} />
                <Achievement icon={SparklesIcon} title="10 Reflections" achieved={reflections.length >= 10} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;