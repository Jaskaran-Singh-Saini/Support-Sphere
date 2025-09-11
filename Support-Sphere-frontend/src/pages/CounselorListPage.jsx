import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const counselors = [
  { id: 1, name: 'Dr. Anjali Sharma', specialty: 'Academic Stress & Anxiety', isAvailable: true },
  { id: 2, name: 'Mr. Rohan Gupta', specialty: 'Career & Relationship Counseling', isAvailable: false },
  { id: 3, name: 'Ms. Priya Singh', specialty: 'Depression & Burnout', isAvailable: true },
];

function CounselorListPage() {
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
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${counselor.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {counselor.isAvailable ? 'Available' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-blue-600 font-semibold">{counselor.specialty}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                <Link to={`/call/${counselor.id}`} className={`flex items-center justify-center space-x-2 w-full sm:w-auto font-semibold py-2 px-4 rounded-lg transition-colors ${!counselor.isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                  <span>Call Now</span>
                </Link>
                <Link to={`/call/${counselor.id}`} className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-red-50 text-red-700 font-bold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  <span>Hotline</span>
                </Link>
                <Link to={`/counseling/${counselor.id}`} className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                  <span>View Profile & Book</span>
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