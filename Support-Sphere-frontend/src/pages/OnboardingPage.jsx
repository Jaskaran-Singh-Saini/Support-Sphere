import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, UserGroupIcon, ChatBubbleLeftEllipsisIcon, PhoneIcon } from '@heroicons/react/24/outline';

function OnboardingPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center">
        {step === 1 && (
          <div>
            <SparklesIcon className="w-16 h-16 mx-auto text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800 mt-4">Welcome to Support Sphere!</h1>
            <p className="text-gray-600 mt-2">We're glad you're here. Let's get your space set up.</p>
            <button onClick={nextStep} className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Get Started</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">What are your main goals?</h2>
            <p className="text-gray-600 mt-2 mb-6">Select one or more. This helps us personalize your experience.</p>
            <div className="space-y-3">
              <button className="w-full p-4 border rounded-lg text-left font-semibold hover:bg-blue-50 hover:border-blue-400">Manage Stress & Anxiety</button>
              <button className="w-full p-4 border rounded-lg text-left font-semibold hover:bg-blue-50 hover:border-blue-400">Improve Focus</button>
              <button className="w-full p-4 border rounded-lg text-left font-semibold hover:bg-blue-50 hover:border-blue-400">Feel Happier</button>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="text-gray-600 font-semibold py-2 px-4">Back</button>
              <button onClick={nextStep} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Key Features</h2>
            <p className="text-gray-600 mt-2 mb-6">Here are the tools available to support you.</p>
            <div className="space-y-4 text-left">
              <div className="bg-slate-50 p-4 rounded-lg flex items-center space-x-4">
                <ChatBubbleLeftEllipsisIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">Chat with Willow</h3>
                  <p className="text-sm text-gray-600">Your AI companion is available 24/7 for a confidential chat.</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg flex items-center space-x-4">
                <UserGroupIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">Peers Forum</h3>
                  <p className="text-sm text-gray-600">Connect with other students anonymously in our safe, moderated community.</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg flex items-center space-x-4">
                <PhoneIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">Professional Counselors</h3>
                  <p className="text-sm text-gray-600">Book confidential sessions with verified on-campus counselors.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={prevStep} className="text-gray-600 font-semibold py-2 px-4">Back</button>
              <Link to="/" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Finish Setup</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;