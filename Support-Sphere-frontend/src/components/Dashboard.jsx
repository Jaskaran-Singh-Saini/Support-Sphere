import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl } from '../config/api';
import { ChatBubbleLeftEllipsisIcon, CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useMood } from '../context/MoodContext';
import { useAuth } from '../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const resourcesByMood = {
  Great: [{ title: 'Practicing Gratitude', content: 'Take a moment to write down three things you are grateful for today. This helps reinforce positive feelings.' }, { title: 'Sharing Positivity', content: 'Reach out to a friend or family member and share a piece of good news. Spreading positivity can amplify it.' }],
  Good: [{ title: 'Mindfulness Exercises', content: 'Try a 5-minute mindfulness meditation. Focus on your breath and the sensations around you without judgment.' }, { title: 'Practicing Gratitude', content: 'Take a moment to write down three things you are grateful for today. This helps reinforce positive feelings.' }],
  Okay: [{ title: 'Journal Prompts', content: 'Use this prompt for your reflection: "What is one small thing I can do today to make my day a little better?"' }, { title: 'Breathing Techniques', content: 'Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. Repeat 3-5 times.' }],
  Bad: [{ title: 'Coping Strategies', content: 'Acknowledge your feelings without judgment. It\'s okay to not be okay. Consider taking a short walk to clear your head.' }, { title: 'Reaching Out', content: 'Sometimes just talking about it helps. Consider reaching out to a friend, family member, or our AI Chat for support.' }],
  Awful: [{ title: 'Emergency Help', content: 'If you are in crisis, please use the Emergency SOS button immediately. Your safety is the priority.' }, { title: 'Grounding Techniques', content: 'Focus on your five senses. Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.' }],
};

const moods = [
  {
    name: 'Awful',
    color: 'text-terra',
    ring: 'ring-terra',
    svg: (
      <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
        <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="13" cy="14" r="1.5" fill="currentColor"/>
        <circle cx="23" cy="14" r="1.5" fill="currentColor"/>
        <path d="M12 24c1.5-2 8.5-2 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13 11l-2-2M23 11l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Bad',
    color: 'text-terra/70',
    ring: 'ring-terra/70',
    svg: (
      <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
        <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="13" cy="15" r="1.5" fill="currentColor"/>
        <circle cx="23" cy="15" r="1.5" fill="currentColor"/>
        <path d="M13 23c1.5-1.5 8.5-1.5 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Okay',
    color: 'text-bark/60',
    ring: 'ring-bark/40',
    svg: (
      <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
        <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="13" cy="15" r="1.5" fill="currentColor"/>
        <circle cx="23" cy="15" r="1.5" fill="currentColor"/>
        <path d="M13 22h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Good',
    color: 'text-forest',
    ring: 'ring-forest',
    svg: (
      <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
        <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="13" cy="15" r="1.5" fill="currentColor"/>
        <circle cx="23" cy="15" r="1.5" fill="currentColor"/>
        <path d="M13 21c1.5 2 8.5 2 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Great',
    color: 'text-forest',
    ring: 'ring-forest',
    svg: (
      <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none">
        <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="13" cy="14" r="1.5" fill="currentColor"/>
        <circle cx="23" cy="14" r="1.5" fill="currentColor"/>
        <path d="M11 20c1.5 4 12.5 4 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13 11l2 2M23 11l-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function BreathingExercise() {
  const [text, setText] = useState('Breathe In...');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setText(prev => prev === 'Breathe In...' ? 'Breathe Out...' : 'Breathe In...');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center transition-transform duration-[4000ms] ease-in-out" style={{ transform: text === 'Breathe In...' ? 'scale(1.2)' : 'scale(1)' }}>
        <p className="text-xl font-semibold text-blue-800">{text}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const userName = user?.username || "User";
  const { moodEntries, addMoodEntry } = useMood();
  
  const [selectedMood, setSelectedMood] = useState('Good');
  const [reflectionText, setReflectionText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [resourceModalContent, setResourceModalContent] = useState(null);

  const handleMoodSelect = (moodName) => {
    setSelectedMood(moodName);
    addMoodEntry(moodName);
  };

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) {
        toast.error("Reflection cannot be empty.");
        return;
    }

    axios.post(apiUrl('/reflections/'), {
        mood: selectedMood,
        prompt1_text: reflectionText,
        prompt2_text: ''
    })
    .then(response => {
        toast.success("Reflection saved successfully!");
        setReflectionText('');
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
    })
    .catch(error => {
        console.error("Error saving reflection:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            toast.error("You must be logged in to save a reflection.");
        } else {
            toast.error("Could not save reflection. Please try again.");
        }
    });
  };
  
  const openSosModal = () => {
    setShowBreathing(false);
    setIsSosModalOpen(true);
  };

  const closeSosModal = () => setIsSosModalOpen(false);
  
  const chartData = {
    labels: moodEntries.map(entry => entry.date),
    datasets: [
      {
        label: 'Your Mood',
        data: moodEntries.map(entry => entry.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 5, ticks: { stepSize: 1, callback: (value) => ['','Awful', 'Bad', 'Okay', 'Good', 'Great'][value] }}},
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
        
        {/* --- Left Sidebar --- */}
        <div className="col-span-1 lg:col-span-3">
          <aside className="bg-slate-800 text-white rounded-2xl p-6 flex flex-col h-full">
            <div className="flex items-center space-x-2 mb-10">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-lg">SS</div>
              <span className="text-xl font-bold">Support Sphere</span>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome, {userName}!</h2>
              <img src="https://api.iconify.design/twemoji/seedling.svg" alt="GrowthPet" className="w-32 h-32 mx-auto mb-8" />
            </div>
            <nav className="flex flex-col space-y-3 flex-grow">
              <Link to="/chat" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <ChatBubbleLeftEllipsisIcon className="h-6 w-6" /><span className="font-semibold">Willow</span>
              </Link>
              <Link to="/counseling" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <CalendarDaysIcon className="h-6 w-6" /><span className="font-semibold">Book a Session</span>
              </Link>
              <Link to="/tasks" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <span className="text-xl">✅</span><span className="font-semibold">Self-Care</span>
              </Link>
              <Link to="/reflection" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <span className="text-xl">📝</span><span className="font-semibold">Reflection</span>
              </Link>
              <Link to="/progress" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <span className="text-xl">📈</span><span className="font-semibold">Progress</span>
              </Link>
              <Link to="/self-help" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <span className="text-xl">📚</span><span className="font-semibold">Resources</span>
              </Link>
              <Link to="/forum" className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                <span className="text-xl">💬</span><span className="font-semibold">Forum</span>
              </Link>
            </nav>
            <button
              onClick={openSosModal}
              className="w-full border border-terra/40 text-terra font-semibold py-2.5 px-4 rounded-xl hover:bg-terra/10 transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              I Need Support Now
            </button>
          </aside>
        </div>
        
        {/* --- Main Content --- */}
        <div className="col-span-1 lg:col-span-5">
          <div className="bg-white p-8 rounded-2xl shadow-sm h-full flex flex-col">
            <h2 className="text-3xl font-bold text-gray-800">Today's Focus</h2>
            <p className="mt-6 text-lg text-gray-600">How are you feeling?</p>
            <div className="mt-4 flex space-x-4">
              {moods.map(mood => (
                <button key={mood.name} onClick={() => handleMoodSelect(mood.name)}
                  className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none ${mood.color} ${selectedMood === mood.name ? `scale-125 ring-2 ring-offset-2 ${mood.ring}` : ''}`}
                  title={mood.name}
                >
                  {mood.svg}
                </button>
              ))}
            </div>
            <p className="mt-8 text-lg text-gray-600">Suggested resources</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {resourcesByMood[selectedMood].map(resource => (
                <button 
                  onClick={() => setResourceModalContent(resource)}
                  key={resource.title} 
                  className="p-4 rounded-lg font-semibold bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition-colors text-center"
                >
                  {resource.title}
                </button>
              ))}
            </div>
            <div className="flex-grow flex flex-col">
              <p className="mt-8 text-lg text-gray-600">Write a reflection</p>
              <textarea value={reflectionText} onChange={(e) => setReflectionText(e.target.value)} className="mt-4 w-full p-3 border border-gray-200 rounded-lg flex-grow" placeholder="Your thoughts are safe here..."></textarea>
              <div className="mt-4 text-right h-10">
                {showConfirmation && <p className="text-green-600 font-semibold animate-pulse">Reflection Saved!</p>}
                {reflectionText && !showConfirmation && (
                  <button onClick={handleSaveReflection} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">Save</button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* --- Right Sidebar --- */}
        <div className="col-span-1 lg:col-span-4">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-800">Your Week at a Glance</h3>
              <div className="mt-4">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-moss/30 p-5">
              <h3 className="font-heading font-semibold text-forest text-base mb-3">Next Appointment</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest font-bold text-sm flex-shrink-0">
                  DL
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Dr. Lee</p>
                  <p className="text-xs text-gray-500">Tomorrow · 10:00 AM</p>
                </div>
                <span className="ml-auto text-xs bg-moss/20 text-forest px-2 py-1 rounded-full font-medium">Confirmed</span>
              </div>
              <Link
                to="/call/1"
                className="w-full flex items-center justify-center gap-2 border border-forest text-forest font-semibold py-2 px-4 rounded-xl hover:bg-forest hover:text-white transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                </svg>
                Join Session
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- Emergency SOS Modal --- */}
      {isSosModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full text-center">
            {showBreathing ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Follow the Guide</h2>
                    <BreathingExercise />
                    <button onClick={() => setShowBreathing(false)} className="mt-6 bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300">Back</button>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Are you in immediate distress?</h2>
                    <p className="text-gray-600 mb-6">If this is an emergency, please call a helpline. Your safety is the priority.</p>
                    <div className="flex flex-col space-y-3">
                        <a href="tel:112" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 text-lg">
                            Call National Emergency Helpline (112)
                        </a>
                        <button onClick={() => setShowBreathing(true)} className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600">
                            Do a 1-Minute Grounding Exercise
                        </button>
                        <button onClick={closeSosModal} className="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
      )}

      {/* --- Resource Modal --- */}
      {resourceModalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative">
            <h2 className="text-2xl font-bold mb-4">{resourceModalContent.title}</h2>
            <p className="text-gray-700">{resourceModalContent.content}</p>
            <button 
              onClick={() => setResourceModalContent(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;