import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user, logout } = useAuth();

  // Once AuthContext finishes loading /me/ after login, check the role
  useEffect(() => {
    if (loading && user) {
      if (user.role === 'admin') {
        toast.success('Welcome back, Admin.');
        navigate('/admin/dashboard');
      } else {
        toast.error('This account does not have admin access.');
        logout();
        setLoading(false);
      }
    }
  }, [user, loading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // role check happens in the useEffect above once `user` populates
    } catch (err) {
      toast.error('Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Support Sphere Admin</h1>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
          <h2 className="text-lg font-semibold text-center text-slate-300 mb-1">Administrator Sign In</h2>
          <p className="text-xs text-center text-slate-500 mb-6">Restricted access — admin accounts only.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-400">Admin Email</label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@supportsphere.app"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-400">Password</label>
              <input
                id="password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 transition-colors"
            >
              {loading ? 'Verifying...' : 'Sign In as Admin'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Not an admin?{' '}
            <Link to="/student/login" className="text-blue-400 hover:underline">Go to student login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;