import { useState } from 'react';
import { Link } from 'react-router-dom';

const tasks = [
  { id: 1, text: 'Drink a glass of water', emoji: '💧' },
  { id: 2, text: 'Walk for 10 minutes', emoji: '🚶' },
  { id: 3, text: 'Talk to a friend', emoji: '☎️' },
  { id: 4, text: 'Do one thing from your hobby', emoji: '🎨' },
];

function SelfCarePage() {
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleToggleTask = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };
  
  const completionPercentage = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Today's Self-Care Checklist
          </h1>
          <p className="text-gray-500 mb-4">Small actions can make a big difference.</p>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-50 border-green-300 text-gray-400'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-lg ${isCompleted ? 'line-through' : ''}`}>
                    {task.text}
                  </span>

                  <span className="text-2xl">
                    {task.emoji}
                  </span>
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