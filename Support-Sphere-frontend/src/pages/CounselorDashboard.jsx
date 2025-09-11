import { Link } from 'react-router-dom';

function CounselorDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Counselor Dashboard
          </h1>
          <span className="font-semibold text-gray-600">Dr. Anjali Sharma</span>
        </div>
      </header>

      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Upcoming Appointments
          </h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <table className="w-full text-left">
              <thead className="border-b">
                <tr>
                  <th className="p-2">Student Name</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">
                    <Link to="/counselor/student/rohan-v" className="text-blue-600 font-semibold hover:underline">Rohan V.</Link>
                  </td>
                  <td className="p-2">02 Sep 2025</td>
                  <td className="p-2">02:30 PM</td>
                  <td className="p-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Confirmed</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">
                    <Link to="/counselor/student/priya-k" className="text-blue-600 font-semibold hover:underline">Priya K.</Link>
                  </td>
                  <td className="p-2">02 Sep 2025</td>
                  <td className="p-2">04:00 PM</td>
                  <td className="p-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Confirmed</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <Link to="/counselor/student/aman-s" className="text-blue-600 font-semibold hover:underline">Aman S.</Link>
                  </td>
                  <td className="p-2">03 Sep 2025</td>
                  <td className="p-2">02:00 PM</td>
                  <td className="p-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CounselorDashboard;