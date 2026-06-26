import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config/api';
import { useLanguage } from '../context/LanguageContext';

function SelfHelpPage() {
  const [resources, setResources] = useState([]);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const { language } = useLanguage();

  useEffect(() => {
    axios.get(apiUrl(`/resources/?lang=${language}`))
      .then(response => setResources(response.data))
      .catch(() => setResources([]));
  }, [language]);

  const filteredResources = filter
    ? resources.filter(r => r.category === filter || r.title.toLowerCase().includes(filter))
    : resources;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Self Help Resources</h1>
        <p className="text-gray-600 mb-8">A collection of verified resources to help you on your wellness journey.</p>

        {filter && (
          <div className="mb-6">
            <span className="text-gray-600">Showing resources for: </span>
            <span className="font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{filter}</span>
            <Link to="/self-help" className="ml-4 text-sm text-blue-600 hover:underline">Clear Filter</Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <div key={resource.id} className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
                {resource.category}
              </span>
              <h2 className="text-lg font-bold text-gray-800 mt-4">{resource.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{resource.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelfHelpPage;
