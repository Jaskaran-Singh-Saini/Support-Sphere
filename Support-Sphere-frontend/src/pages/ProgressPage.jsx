import { useState, useEffect } from 'react';
import axios from 'axios';
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

function ProgressPage() {
  const { moodEntries } = useMood();
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log("Attempting to fetch reflections..."); // Debugging line
    axios.get('http://127.0.0.1:8000/api/reflections/')
      .then(response => {
        console.log("Reflections fetched successfully:", response.data); // Debugging line
        setReflections(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching reflections:", error);
        setLoading(false);
      });
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
            <StatCard icon={FireIcon} title="Current Streak" value="7 Days" color="orange" />
            <StatCard icon={PencilSquareIcon} title="Reflections Written" value={reflections.length} color="blue" />
            <StatCard icon={SparklesIcon} title="Self-Care Tasks" value="32" color="purple" />
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
                <Achievement icon={TrophyIcon} title="First Step" achieved={true} />
                <Achievement icon={PencilSquareIcon} title="Journalist" achieved={reflections.length > 0} />
                <Achievement icon={FireIcon} title="7-Day Streak" achieved={true} />
                <Achievement icon={SparklesIcon} title="Self-Care Pro" achieved={false} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
