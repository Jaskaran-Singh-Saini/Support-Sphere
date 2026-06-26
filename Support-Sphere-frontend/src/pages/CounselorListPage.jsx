import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { apiUrl } from '../config/api';
import toast from 'react-hot-toast';

function CounselorListPage() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(apiUrl('/counselors/'))
      .then(response => setCounselors(response.data))
      .catch(() => toast.error('Could not load counselors.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading counselors...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find a Counselor</h1>
        <p className="text-gray-600 mb-8">Connect with our on-campus counselors.</p>

        <div className="space-y-6">
          {counselors.map(counselor => (
            <div key={counselor.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-shadow hover:shadow-lg">
              <div className="flex items-center space-x-6">
                <UserCircleIcon className="w-24 h-24 text-slate-300 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-800">{counselor.name}</h2>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${counselor.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {counselor.is_available ? 'Available' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-blue-600 font-semibold">{counselor.specialty}</p>
                  <p className="text-gray-600 mt-2">{counselor.bio}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                <Link to={`/counseling/${counselor.id}`} className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  View Profile & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CounselorListPage;
