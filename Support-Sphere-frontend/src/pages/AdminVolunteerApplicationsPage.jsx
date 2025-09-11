import { Link } from 'react-router-dom';

const volunteerApplications = [
    { id: 1, name: 'Riya Sharma', studentId: '2022CS101', reason: 'I want to help my fellow students and create a more supportive campus community.' },
    { id: 2, name: 'Sameer Khan', studentId: '2023ME205', reason: 'I have experience with peer support from my previous school and believe I can contribute effectively.' },
];

function VolunteerApplicationsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
                &larr; Back to Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Volunteer Applications</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="space-y-4">
            {volunteerApplications.map(app => (
              <div key={app.id} className="p-4 border rounded-lg bg-slate-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{app.name} <span className="font-normal text-sm text-gray-500">({app.studentId})</span></p>
                    <p className="text-gray-600 mt-2 italic">"{app.reason}"</p>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <button className="bg-green-100 text-green-800 font-semibold py-1 px-3 rounded-md hover:bg-green-200">Approve</button>
                    <button className="bg-red-100 text-red-800 font-semibold py-1 px-3 rounded-md hover:bg-red-200">Decline</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VolunteerApplicationsPage;