import { useState } from 'react';

const resourcesByMood = {
  Great: [{ title: 'Building on Momentum', theme: 'purple' }, { title: 'Sharing Positivity', theme: 'orange' }],
  Good: [{ title: 'Mindfulness Exercises', theme: 'orange' }, { title: 'Practicing Gratitude', theme: 'purple' }],
  Okay: [{ title: 'Journal Prompts', theme: 'purple' }, { title: 'Breathing Techniques', theme: 'green' }],
  Bad: [{ title: 'Coping Strategies', theme: 'green' }, { title: 'Reaching Out', theme: 'orange' }],
  Awful: [{ title: 'Emergency Help', theme: 'red' }, { title: 'Grounding Techniques', theme: 'green' }],
};

const moods = [
    { name: 'Awful', emoji: '😞' },
    { name: 'Bad', emoji: '😐' },
    { name: 'Okay', emoji: '🙂' },
    { name: 'Good', emoji: '😊' },
    { name: 'Great', emoji: '😁' },
];

function MainContent() {
  const [selectedMood, setSelectedMood] = useState('Good');
  const [reflectionText, setReflectionText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSaveReflection = () => {
    setShowConfirmation(true);
    setReflectionText('');
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm h-full">
      <h2 className="text-3xl font-bold text-gray-800">Today's Focus</h2>
      
      <p className="mt-6 text-lg text-gray-600">How are you feeling?</p>
      <div className="mt-4 flex space-x-4">
        {moods.map(mood => (
          <button 
            key={mood.name} 
            onClick={() => setSelectedMood(mood.name)}
            className={`text-4xl p-2 rounded-full transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none ${
                selectedMood === mood.name ? 'transform scale-125 ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      
      <p className="mt-8 text-lg text-gray-600">Suggested resources</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {resourcesByMood[selectedMood].map(resource => (
          <div key={resource.title} className={`p-4 rounded-lg font-semibold bg-${resource.theme}-50 text-${resource.theme}-800`}>
            {resource.title}
          </div>
        ))}
      </div>

      <p className="mt-8 text-lg text-gray-600">Write a reflection</p>
      <textarea 
        value={reflectionText}
        onChange={(e) => setReflectionText(e.target.value)}
        className="mt-4 w-full p-3 border border-gray-200 rounded-lg h-32"
        placeholder="Your thoughts are safe here..."
      ></textarea>
      
      <div className="mt-4 text-right h-10">
        {showConfirmation && <p className="text-green-600 font-semibold">Reflection Saved!</p>}
        {reflectionText && !showConfirmation && (
          <button onClick={handleSaveReflection} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
            Save
          </button>
        )}
      </div>
    </div>
  );
}

export default MainContent;