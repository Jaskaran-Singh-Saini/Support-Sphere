import { Link } from 'react-router-dom';

const currentVolunteers = [
    { id: 1, name: 'Amit Patel', studentId: '2021EE304' },
    { id: 2, name: 'Sneha Reddy', studentId: '2022BT112' },
];

function CurrentVolunteersPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
                &larr; Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Current Volunteers</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="space-y-3">
            {currentVolunteers.map(volunteer => (
              <div key={volunteer.id} className="p-3 border rounded-lg flex justify-between items-center">
                <p className="font-semibold text-gray-700">{volunteer.name} <span className="font-normal text-sm text-gray-500">({volunteer.studentId})</span></p>
                <button className="bg-gray-100 text-gray-600 font-semibold py-1 px-3 rounded-md hover:bg-gray-200">Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentVolunteersPage;