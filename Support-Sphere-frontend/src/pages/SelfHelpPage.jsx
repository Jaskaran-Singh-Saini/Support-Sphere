import { Link, useSearchParams } from 'react-router-dom';

const resources = [
  { title: 'Understanding Anxiety', category: 'Articles', tag: 'anxiety' },
  { title: '5-Minute Breathing Exercise', category: 'Audio', tag: 'breathing' },
  { title: 'How to Deal with Exam Stress', category: 'Videos', tag: 'stress' },
  { title: 'The Importance of a Good Sleep Routine', category: 'Articles', tag: 'wellness' },
  { title: 'Guided Meditation for Focus', category: 'Audio', tag: 'mindfulness' },
  { title: 'Building Healthy Friendships in College', category: 'Videos', tag: 'social' },
  { title: 'Practicing Gratitude Daily', category: 'Articles', tag: 'gratitude' },
  { title: 'Quick Grounding Techniques', category: 'Exercises', tag: 'grounding' },
];

function SelfHelpPage() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');

  const filteredResources = filter 
    ? resources.filter(r => r.tag === filter) 
    : resources;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Self Help Resources</h1>
        <p className="text-gray-600 mb-8">
          A collection of resources to help you on your wellness journey.
        </p>

        {filter && (
          <div className="mb-6">
            <span className="text-gray-600">Showing resources for: </span>
            <span className="font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{filter}</span>
            <Link to="/self-help" className="ml-4 text-sm text-blue-600 hover:underline">Clear Filter</Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <a href="#" key={index} className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                resource.category === 'Articles' ? 'bg-blue-100 text-blue-800' :
                resource.category === 'Audio' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {resource.category}
              </span>
              <h2 className="text-lg font-bold text-gray-800 mt-4">{resource.title}</h2>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelfHelpPage;