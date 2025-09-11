import { useState } from 'react';

function MoodCheckin() {
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = ['Awful', 'Bad', 'Okay', 'Good', 'Great'];
  const emojis = ['😞', '😐', '🙂', '😊', '😁'];

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        How are you feeling today?
      </h2>
      <div className="flex justify-around items-center">
        {moods.map((mood, index) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`text-4xl p-2 rounded-full transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none ${
              selectedMood === mood
                ? 'transform scale-125 ring-2 ring-blue-500 ring-offset-2'
                : ''
            }`}
          >
            {emojis[index]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodCheckin;