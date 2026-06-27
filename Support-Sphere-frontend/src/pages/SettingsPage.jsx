import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiUrl } from '../config/api';

function SettingsToggle({ label, enabled, setEnabled }) {
  return (
    <div onClick={() => setEnabled(!enabled)} className="flex items-center justify-between cursor-pointer py-1">
      <span className="font-medium text-gray-700">{label}</span>
      <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </div>
  );
}

function SettingsPage() {
  const { user, setUser } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [displayName, setDisplayName] = useState(user?.display_name || user?.username || '');
  const [saving, setSaving] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [forumReplies, setForumReplies] = useState(true);
  const [reflectionReminders, setReflectionReminders] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(apiUrl('/me/'), {
        display_name: displayName,
        preferred_language: language,
      });
      // Update auth context so header shows new name immediately
      if (setUser) setUser((prev) => ({ ...prev, display_name: res.data.display_name }));
      toast.success('Profile updated!');
    } catch {
      toast.error('Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences.</p>
        </div>

        {/* Profile */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">University Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Language / भाषा</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <SettingsToggle label="Appointment Reminders" enabled={appointmentReminders} setEnabled={setAppointmentReminders} />
            <SettingsToggle label="New Forum Replies" enabled={forumReplies} setEnabled={setForumReplies} />
            <SettingsToggle label="Daily Reflection Reminder" enabled={reflectionReminders} setEnabled={setReflectionReminders} />
          </div>
          <p className="text-xs text-gray-400 mt-4">Notification delivery coming in a future update.</p>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;