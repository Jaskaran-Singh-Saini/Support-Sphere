import { Link } from 'react-router-dom';

function VolunteerApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/forum" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Forum
        </Link>
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Become a Peer Support Volunteer
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in helping our community. Please fill out the form below. Our counseling team will review your application.
          </p>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                Student ID Number
              </label>
              <input
                type="text"
                id="studentId"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Why do you want to be a volunteer? (Briefly)
              </label>
              <textarea
                id="reason"
                rows="4"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input id="consent" name="consent" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="consent" className="font-medium text-gray-700">I understand that this role requires mandatory training and is supervised by the university's counseling department.</label>
                </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Link to="/forum" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                Cancel
              </Link>
              <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VolunteerApplicationPage;