import { useState } from 'react';
import { Link } from 'react-router-dom';

const TASK_CATEGORIES = {
  body: {
    label: 'Body',
    color: 'bg-green-100 text-green-800',
    tasks: [
      { id: 1,  text: 'Drink 8 glasses of water today',       emoji: '💧' },
      { id: 2,  text: 'Walk or stretch for 10 minutes',        emoji: '🚶' },
      { id: 3,  text: 'Eat a proper meal — no skipping',       emoji: '🍱' },
      { id: 4,  text: 'Sleep by midnight tonight',             emoji: '😴' },
      { id: 5,  text: 'Step outside for fresh air',            emoji: '🌿' },
    ],
  },
  mind: {
    label: 'Mind',
    color: 'bg-blue-100 text-blue-800',
    tasks: [
      { id: 6,  text: 'Write 3 things you are grateful for',   emoji: '📝' },
      { id: 7,  text: 'Do a 5-minute breathing exercise',      emoji: '🧘' },
      { id: 8,  text: 'Take a 10-minute screen break',         emoji: '🖥️' },
      { id: 9,  text: 'Read something enjoyable for 15 mins',  emoji: '📖' },
    ],
  },
  connect: {
    label: 'Connect',
    color: 'bg-purple-100 text-purple-800',
    tasks: [
      { id: 10, text: 'Call or text a friend or family member', emoji: '☎️' },
      { id: 11, text: 'Share one positive thing with someone',  emoji: '💬' },
      { id: 12, text: 'Do one thing from your hobby',           emoji: '🎨' },
    ],
  },
};

const ALL_TASKS = Object.values(TASK_CATEGORIES).flatMap((c) => c.tasks);

function SelfCarePage() {
  const [completed, setCompleted] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('all');

  const toggle = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visibleTasks =
    activeCategory === 'all'
      ? ALL_TASKS
      : TASK_CATEGORIES[activeCategory]?.tasks || [];

  const pct = Math.round((completed.size / ALL_TASKS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Today's Self-Care Checklist</h1>
          <p className="text-gray-500 mb-4">Small actions, big difference. {completed.size}/{ALL_TASKS.length} done.</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          {pct === 100 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center text-green-700 font-semibold">
              🎉 All done for today! You showed up for yourself.
            </div>
          )}

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {['all', ...Object.keys(TASK_CATEGORIES)].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All' : TASK_CATEGORIES[cat].label}
              </button>
            ))}
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {visibleTasks.map((task) => {
              const done = completed.has(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => toggle(task.id)}
                  className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${
                    done
                      ? 'bg-green-50 border-green-300 text-gray-400'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className={`text-base ${done ? 'line-through' : 'text-gray-700'}`}>{task.text}</span>
                  </div>
                  <span className="text-2xl ml-2">{task.emoji}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelfCarePage;