import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const counselors = {
  1: { name: 'Dr. Anjali Sharma' },
  2: { name: 'Mr. Rohan Gupta' },
  3: { name: 'Ms. Priya Singh' },
};

function CallPage() {
  const { counselorId } = useParams();
  const counselor = counselors[counselorId] || { name: 'Counselor' };
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col p-4">
      {/* Video Feeds */}
      <div className="relative flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Counselor Video */}
        <div className="relative bg-slate-800 rounded-lg flex flex-col items-center justify-center overflow-hidden">
          <UserCircleIcon className="w-32 h-32 text-slate-600" />
          <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded-lg">
            <p className="font-semibold">{counselor.name}</p>
          </div>
          <div className="absolute top-4 right-4 text-sm text-gray-300">
            Connecting...
          </div>
        </div>

        {/* User Video Placeholder */}
        <div className="relative bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
          {isCameraOff ? (
            <div className="text-center">
              <p className="text-6xl mb-2">🚫</p>
              <p className="mt-2 text-lg">Camera is off</p>
            </div>
          ) : (
            <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded-lg">
              <p className="font-semibold">You</p>
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="mt-4 bg-slate-800/80 backdrop-blur-sm rounded-full p-3 flex justify-center items-center space-x-4 self-center">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${isMuted ? 'bg-yellow-500' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          {isMuted ? 'Unmute 🎙️' : 'Mute 🔇'}
        </button>
        <button 
          onClick={() => setIsCameraOff(!isCameraOff)} 
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${isCameraOff ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          {isCameraOff ? 'Cam On 📹' : 'Cam Off 🚫'}
        </button>
        <Link 
          to="/counseling" 
          className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
          aria-label="End Call"
        >
          <span className="text-2xl">📞</span>
        </Link>
      </div>
    </div>
  );
}

export default CallPage;