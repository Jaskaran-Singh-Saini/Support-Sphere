import { Link } from 'react-router-dom';

function ReportConcernPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Report a Concern
          </h1>
          <p className="text-gray-600 mb-6">
            If you are concerned about a fellow student's well-being, you can use this confidential form. This report will be sent directly to the head of the university's counseling department for review.
          </p>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">
                Name of the student you are concerned about
              </label>
              <input
                type="text"
                id="studentName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Please describe your concern
              </label>
              <textarea
                id="reason"
                rows="6"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Describe the behavior or situation that worries you..."
              ></textarea>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Link to="/" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                Cancel
              </Link>
              <button type="submit" className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                Submit Confidential Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportConcernPage;