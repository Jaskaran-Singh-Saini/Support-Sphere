import { Link } from 'react-router-dom';
import MoodCheckin from '../components/MoodCheckin';

function ReflectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Dashboard
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Today's Reflection
          </h1>
          <p className="text-gray-500 mb-6">Take a moment to think about your day.</p>

          <div className="space-y-6">
            <div>
              <label htmlFor="prompt1" className="block text-md font-semibold text-gray-700 mb-2">
                One thing that went well today was...
              </label>
              <textarea
                id="prompt1"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="prompt2" className="block text-md font-semibold text-gray-700 mb-2">
                One thing I am grateful for is...
              </label>
              <textarea
                id="prompt2"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
          </div>
          
          <div className="mt-8">
            <MoodCheckin />
          </div>

          <div className="mt-8 text-right">
            <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              Save Reflection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReflectionPage;