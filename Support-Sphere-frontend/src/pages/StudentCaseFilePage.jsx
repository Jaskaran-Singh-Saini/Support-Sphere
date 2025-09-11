import { Link, useParams } from 'react-router-dom';

const students = {
  'rohan-v': { name: 'Rohan V.', lastCheckin: 'Good', reflections: ['Struggled with a tough assignment but managed to finish it.', 'Felt happy after talking to a friend from home.'], moodHistory: [4, 4, 3, 5, 4] },
  'priya-k': { name: 'Priya K.', lastCheckin: 'Okay', reflections: ['Feeling a bit homesick today.', 'Was happy with my quiz score.'], moodHistory: [3, 2, 3, 4, 3] },
  'aman-s': { name: 'Aman S.', lastCheckin: 'Bad', reflections: ['Feeling very stressed about the upcoming exams.', 'Skipped lunch because I had too much to study.'], moodHistory: [2, 2, 1, 2, 1] },
};

function StudentCaseFilePage() {
  const { studentId } = useParams();
  const student = students[studentId];

  if (!student) {
    return <div>Student not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/counselor/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Reflections</h2>
              <div className="space-y-4">
                {student.reflections.map((note, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-gray-700 italic">"{note}"</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Counselor's Private Notes</h2>
                <textarea className="w-full p-3 border border-gray-300 rounded-lg" rows="5" placeholder="Add session notes here..."></textarea>
                <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Save Note</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <div className="mt-6">
                <h3 className="font-bold text-gray-700">Recent Mood</h3>
                <p className={`text-lg font-semibold ${student.lastCheckin === 'Good' ? 'text-green-600' : 'text-yellow-600'}`}>{student.lastCheckin}</p>
            </div>
            <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">Mood Trend (Last 5 Days)</h3>
                <div className="flex items-end h-24 space-x-2">
                    {student.moodHistory.map((mood, index) => (
                        <div key={index} className="w-full bg-blue-200 rounded-t-sm" style={{ height: `${mood * 20}%`}}></div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCaseFilePage;