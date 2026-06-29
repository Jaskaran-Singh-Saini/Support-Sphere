import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl } from '../config/api';
import { useMood } from '../context/MoodContext';

const moods = ['Awful', 'Bad', 'Okay', 'Good', 'Great'];

const moodGlyphs = [
  { name: 'Awful', color: 'text-terra', ring: 'ring-terra',
    svg: <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none"><circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="14" r="1.5" fill="currentColor"/><circle cx="23" cy="14" r="1.5" fill="currentColor"/><path d="M12 24c1.5-2 8.5-2 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 11l-2-2M23 11l2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { name: 'Bad',   color: 'text-terra/70', ring: 'ring-terra/70',
    svg: <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none"><circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="15" r="1.5" fill="currentColor"/><circle cx="23" cy="15" r="1.5" fill="currentColor"/><path d="M13 23c1.5-1.5 8.5-1.5 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { name: 'Okay',  color: 'text-bark/60', ring: 'ring-bark/40',
    svg: <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none"><circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="15" r="1.5" fill="currentColor"/><circle cx="23" cy="15" r="1.5" fill="currentColor"/><path d="M13 22h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { name: 'Good',  color: 'text-forest', ring: 'ring-forest',
    svg: <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none"><circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="15" r="1.5" fill="currentColor"/><circle cx="23" cy="15" r="1.5" fill="currentColor"/><path d="M13 21c1.5 2 8.5 2 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { name: 'Great', color: 'text-forest', ring: 'ring-forest',
    svg: <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none"><circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="14" r="1.5" fill="currentColor"/><circle cx="23" cy="14" r="1.5" fill="currentColor"/><path d="M11 20c1.5 4 12.5 4 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 11l2 2M23 11l-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
];

function ReflectionPage() {
  const navigate = useNavigate();
  const { addMoodEntry } = useMood();
  const [prompt1, setPrompt1] = useState('');
  const [prompt2, setPrompt2] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood before saving.');
      return;
    }
    setSaving(true);
    try {
      await axios.post(apiUrl('/reflections/'), {
        prompt1_text: prompt1,
        prompt2_text: prompt2,
        mood: selectedMood.toLowerCase(),
      });
      addMoodEntry(selectedMood);
      toast.success('Reflection saved!');
      navigate('/progress');
    } catch (err) {
      console.error('Failed to save reflection:', err);
      toast.error('Could not save reflection. Are you logged in?');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Today's Reflection</h1>
          <p className="text-gray-500 mb-6">Take a moment to think about your day.</p>

          <div className="space-y-6">
            <div>
              <label htmlFor="prompt1" className="block text-md font-semibold text-gray-700 mb-2">
                One thing that went well today was...
              </label>
              <textarea
                id="prompt1"
                rows="3"
                value={prompt1}
                onChange={(e) => setPrompt1(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Write your thoughts here..."
              />
            </div>

            <div>
              <label htmlFor="prompt2" className="block text-md font-semibold text-gray-700 mb-2">
                One thing I am grateful for is...
              </label>
              <textarea
                id="prompt2"
                rows="3"
                value={prompt2}
                onChange={(e) => setPrompt2(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Write your thoughts here..."
              />
            </div>
          </div>

          <div className="mt-8 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">How are you feeling today?</h2>
            <div className="flex justify-around items-center">
              {moodGlyphs.map((mood) => (
                <button
                  key={mood.name}
                  type="button"
                  onClick={() => setSelectedMood(mood.name)}
                  title={mood.name}
                  className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none ${mood.color} ${
                    selectedMood === mood.name ? `scale-125 ring-2 ring-offset-2 ${mood.ring}` : ''
                  }`}
                >
                  {mood.svg}
                </button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-center text-sm text-gray-500 mt-3">Feeling: <span className="font-semibold text-gray-700">{selectedMood}</span></p>
            )}
          </div>

          <div className="mt-8 text-right">
            <button
              onClick={handleSave}
              disabled={saving || !selectedMood}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Reflection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReflectionPage;