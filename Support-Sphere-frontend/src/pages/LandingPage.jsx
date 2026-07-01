import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-moss/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white stroke-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6M9 9l3-3 3 3"/>
            </svg>
          </div>
          <span className="font-bold text-forest text-lg">Support Sphere</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/student/login" className="text-sm font-medium text-bark hover:text-forest transition-colors">
            Sign In
          </Link>
          <Link to="/student/register" className="text-sm font-semibold bg-forest text-white px-4 py-2 rounded-xl hover:bg-forest/90 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">

          {/* Sprout icon */}
          <div className="w-20 h-20 rounded-2xl bg-forest/10 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
              <path d="M24 40V20" stroke="#2D5A3D" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M24 28c0 0-8-4-8-12 0 0 4-4 8-4s8 4 8 4c0 8-8 12-8 12z" fill="#A8C0A0" stroke="#2D5A3D" strokeWidth="2"/>
              <path d="M24 34c0 0-6 2-10-4" stroke="#2D5A3D" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-forest mb-4 leading-tight">
            Your mental health<br />matters here.
          </h1>
          <p className="text-lg text-bark/70 mb-10 max-w-lg mx-auto leading-relaxed">
            Support Sphere is a safe, confidential space for students to reflect, grow, and connect with counselors — at any time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/student/register"
              className="bg-forest text-white font-semibold px-8 py-3 rounded-xl hover:bg-forest/90 transition-colors text-base"
            >
              Create Free Account
            </Link>
            <Link
              to="/student/login"
              className="bg-white border border-moss text-forest font-semibold px-8 py-3 rounded-xl hover:bg-moss/10 transition-colors text-base"
            >
              Sign In
            </Link>
          </div>

          <p className="text-xs text-bark/40 mt-6">
            Counselors & admins:{' '}
            <Link to="/admin/login" className="underline hover:text-forest">Staff login →</Link>
          </p>
        </div>

        {/* Feature strip */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full mx-auto">
          {[
            { icon: '💬', title: 'Willow AI', desc: 'A compassionate AI companion available 24/7 to listen and guide.' },
            { icon: '📝', title: 'Daily Reflection', desc: 'Track your mood and journal your thoughts in a private, encrypted space.' },
            { icon: '🧑‍⚕️', title: 'Book a Counselor', desc: 'Connect with professional counselors at your convenience, anonymously.' },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-moss/30 rounded-2xl p-6 text-left shadow-sm">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-forest mb-1">{f.title}</h3>
              <p className="text-sm text-bark/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-bark/30 border-t border-moss/20">
        © 2026 Support Sphere · Confidential & Secure
      </footer>
    </div>
  );
}

export default LandingPage;