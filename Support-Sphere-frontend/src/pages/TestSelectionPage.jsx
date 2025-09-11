import { Link } from 'react-router-dom';

const tests = [
  { slug: 'gad-7', title: 'Anxiety Test (GAD-7)', description: 'A 7-question screening tool for generalized anxiety disorder.' },
  { slug: 'phq-9', title: 'Depression Test (PHQ-9)', description: 'A 9-question tool to screen for depression.' },
  { slug: 'ghq-12', title: 'General Wellness Test (GHQ-12)', description: 'A 12-item measure of general psychological well-being.' },
];

function TestSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Self-Assessments</h1>
        <p className="text-gray-600 mb-8">
          These are confidential screening tools to help you understand your feelings. They are not a diagnosis.
        </p>
        <div className="space-y-4">
          {tests.map(test => (
            <Link to={`/assessments/${test.slug}`} key={test.slug} className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-blue-600">{test.title}</h2>
              <p className="text-gray-600 mt-1">{test.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestSelectionPage;