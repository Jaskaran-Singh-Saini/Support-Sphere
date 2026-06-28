import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl } from '../config/api';

const STATUS_STYLES = {
  pending:  'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  expired:  'bg-gray-100 text-gray-700',
};

function CounselorListPageAdmin() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counselors, setCounselors] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('counselors');

  const [form, setForm] = useState({ name: '', email: '', specialty: '' });

  useEffect(() => {
    axios.get(apiUrl('/counselors/'))
      .then(r => setCounselors(r.data))
      .catch(() => toast.error('Could not load counselors.'))
      .finally(() => setLoadingCounselors(false));

    fetchInvitations();
  }, []);

  const fetchInvitations = () => {
    setLoadingInvitations(true);
    axios.get(apiUrl('/admin/counselor-invitations/'))
      .then(r => setInvitations(r.data))
      .catch(() => {})
      .finally(() => setLoadingInvitations(false));
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    setSending(true);
    try {
      const res = await axios.post(apiUrl('/admin/counselor-invitations/'), form);
      toast.success(`Invitation sent to ${res.data.email}`);
      setInvitations(prev => [res.data, ...prev]);
      setForm({ name: '', email: '', specialty: '' });
      setIsModalOpen(false);
      setActiveTab('invitations');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to send invitation.';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link to="/admin/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
              &larr; Back to Admin Dashboard
            </Link>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">Counselor Management</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                + Add New Counselor
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300 mb-6">
            {['counselors', 'invitations'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {tab === 'invitations' && invitations.filter(i => i.status === 'pending').length > 0 && (
                  <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs rounded-full px-1.5 py-0.5">
                    {invitations.filter(i => i.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Counselors Tab */}
          {activeTab === 'counselors' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              {loadingCounselors ? (
                <p className="text-center text-gray-400 py-12">Loading counselors...</p>
              ) : counselors.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-3">No counselors registered yet.</p>
                  <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline text-sm">
                    Send your first invitation →
                  </button>
                </div>
              ) : (
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Name</th>
                      <th className="p-3 font-semibold text-slate-600">Specialty</th>
                      <th className="p-3 font-semibold text-slate-600">Email</th>
                      <th className="p-3 font-semibold text-slate-600">Bio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counselors.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-slate-50">
                        <td className="p-3 font-semibold text-gray-800">{c.name}</td>
                        <td className="p-3 text-gray-600">{c.specialty || '—'}</td>
                        <td className="p-3 text-gray-500">{c.email || '—'}</td>
                        <td className="p-3 text-gray-500 max-w-xs truncate">{c.bio || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Invitations Tab */}
          {activeTab === 'invitations' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              {loadingInvitations ? (
                <p className="text-center text-gray-400 py-12">Loading invitations...</p>
              ) : invitations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-3">No invitations sent yet.</p>
                  <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline text-sm">
                    Send first invitation →
                  </button>
                </div>
              ) : (
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Name</th>
                      <th className="p-3 font-semibold text-slate-600">Email</th>
                      <th className="p-3 font-semibold text-slate-600">Specialty</th>
                      <th className="p-3 font-semibold text-slate-600">Invited By</th>
                      <th className="p-3 font-semibold text-slate-600">Sent At</th>
                      <th className="p-3 font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((inv) => (
                      <tr key={inv.id} className="border-t hover:bg-slate-50">
                        <td className="p-3 font-semibold text-gray-800">{inv.name}</td>
                        <td className="p-3 text-gray-600">{inv.email}</td>
                        <td className="p-3 text-gray-500">{inv.specialty || '—'}</td>
                        <td className="p-3 text-gray-500">{inv.invited_by}</td>
                        <td className="p-3 text-gray-400 text-sm">{inv.created_at}</td>
                        <td className="p-3">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[inv.status] || ''}`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-1 text-gray-800">Invite New Counselor</h2>
            <p className="text-sm text-gray-500 mb-6">An invitation email will be sent to the provided address.</p>
            <form onSubmit={handleSendInvitation}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University Email *</label>
                  <input
                    type="email" required value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="jane.doe@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                  <input
                    type="text" value={form.specialty}
                    onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Academic Stress, Anxiety, etc."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={sending}
                  className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {sending ? 'Sending...' : 'Send Invitation'}
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