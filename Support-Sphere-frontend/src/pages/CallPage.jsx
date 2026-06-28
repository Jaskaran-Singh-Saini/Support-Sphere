import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { apiUrl } from '../config/api';

function CallPage() {
  const { counselorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [counselor, setCounselor] = useState(null);
  const [callState, setCallState] = useState('connecting'); // connecting | active | ended
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (counselorId) {
      axios.get(apiUrl(`/counselors/${counselorId}/`))
        .then(r => setCounselor(r.data))
        .catch(() => setCounselor({ name: 'Counselor', specialty: '' }));
    }
    // Simulate connection after 2s
    const connectTimeout = setTimeout(() => setCallState('active'), 2000);
    return () => clearTimeout(connectTimeout);
  }, [counselorId]);

  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setCallState('ended');
    setTimeout(() => navigate('/counseling'), 2000);
  };

  const displayName = counselor?.name || 'Counselor';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full animate-pulse bg-green-400" />
          <span className="text-sm font-medium text-gray-300">
            {callState === 'connecting' ? 'Connecting...' : callState === 'active' ? 'Session Active' : 'Call Ended'}
          </span>
        </div>
        {callState === 'active' && (
          <div className="bg-slate-700 px-3 py-1 rounded-full text-sm font-mono font-semibold text-green-400">
            {formatTime(seconds)}
          </div>
        )}
        <div className="text-sm text-gray-400">Support Sphere</div>
      </div>

      {/* Video grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3">

        {/* Counselor feed */}
        <div className="relative bg-slate-800 rounded-2xl flex flex-col items-center justify-center min-h-[240px] overflow-hidden border border-slate-700">
          <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white mb-3">
            {initials}
          </div>
          <p className="text-lg font-semibold">{displayName}</p>
          {counselor?.specialty && (
            <p className="text-sm text-gray-400 mt-1">{counselor.specialty}</p>
          )}
          <div className="absolute top-3 right-3">
            {callState === 'connecting' ? (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Connecting...</span>
            ) : callState === 'active' ? (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">● Live</span>
            ) : (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Disconnected</span>
            )}
          </div>
        </div>

        {/* Your feed */}
        <div className="relative bg-slate-700 rounded-2xl flex flex-col items-center justify-center min-h-[240px] overflow-hidden border border-slate-600">
          {isCameraOff ? (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={1.5} />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Camera off</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
                {user?.display_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'Y'}
              </div>
              <p className="text-gray-300 text-sm">{user?.display_name || user?.username || 'You'}</p>
            </div>
          )}
          {isMuted && (
            <div className="absolute bottom-3 left-3 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
              Muted
            </div>
          )}
          <div className="absolute top-3 left-3 text-xs text-gray-400 bg-black/30 px-2 py-1 rounded-full">You</div>
        </div>
      </div>

      {/* Call ended overlay */}
      {callState === 'ended' && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-2xl font-bold mb-2">Session Complete</p>
            <p className="text-gray-400">Duration: {formatTime(seconds)}</p>
            <p className="text-sm text-gray-500 mt-3">Redirecting to counseling page...</p>
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div className="bg-slate-800/90 backdrop-blur-sm px-4 py-4 flex justify-center items-center gap-4">

        {/* Mute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="3" y1="3" x2="21" y2="21" strokeWidth={2} strokeLinecap="round"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 23h8"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
            </svg>
          )}
        </button>

        {/* Camera */}
        <button
          onClick={() => setIsCameraOff(!isCameraOff)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isCameraOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'
          }`}
          title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
            {isCameraOff && <line x1="3" y1="3" x2="21" y2="21" strokeWidth={2} strokeLinecap="round"/>}
          </svg>
        </button>

        {/* End call */}
        <button
          onClick={endCall}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all scale-110"
          title="End call"
        >
          <svg className="w-6 h-6 rotate-135" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
        </button>

        {/* Screen share placeholder */}
        <button
          className="w-12 h-12 rounded-full bg-slate-600 hover:bg-slate-500 flex items-center justify-center transition-all opacity-60"
          title="Screen share (coming soon)"
          disabled
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CallPage;