import { useState } from 'react';
import { Link } from 'react-router-dom';

const counselors = [
  { id: 1, name: 'Dr. Anjali Sharma', specialty: 'Academic Stress & Anxiety', pairedStudents: 12, status: 'In a Session', nextAppointment: '02:30 PM' },
  { id: 2, name: 'Mr. Rohan Gupta', specialty: 'Career & Relationship Counseling', pairedStudents: 8, status: 'Available', nextAppointment: '04:00 PM' },
  { id: 3, name: 'Ms. Priya Singh', specialty: 'Depression & Burnout', pairedStudents: 15, status: 'Offline', nextAppointment: 'Tomorrow at 9:00 AM' },
];

function CounselorListPageAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
              <Link to="/admin/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
                  &larr; Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Counselor Management</h1>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">All Counselors</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Add New Counselor
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600">Counselor Name</th>
                    <th className="p-3 font-semibold text-slate-600">Current Status</th>
                    <th className="p-3 font-semibold text-slate-600">Next Appointment</th>
                    <th className="p-3 font-semibold text-slate-600">Paired Students</th>
                    <th className="p-3 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {counselors.map((counselor, index) => (
                    <tr key={counselor.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="p-3 font-semibold text-gray-700">{counselor.name}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          counselor.status === 'Available' ? 'bg-green-100 text-green-800' : 
                          counselor.status === 'In a Session' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {counselor.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{counselor.nextAppointment}</td>
                      <td className="p-3 text-gray-600">{counselor.pairedStudents}</td>
                      <td className="p-3">
                          <button className="font-medium text-blue-600 hover:text-blue-800">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">New Counselor Details</h2>
            <form>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Dr. Jane Doe"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">University Email</label>
                  <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="jane.doe@university.edu"/>
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
                  <input type="text" id="specialty" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Academic Stress, Anxiety, etc."/>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CounselorListPageAdmin;