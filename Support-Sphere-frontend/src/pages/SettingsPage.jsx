import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function SettingsToggle({ label, enabled, setEnabled }) {
  return (
    <div onClick={() => setEnabled(!enabled)} className="flex items-center justify-between cursor-pointer">
      <span className="font-medium text-gray-700">{label}</span>
      <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </div>
  );
}

function SettingsPage() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [forumReplies, setForumReplies] = useState(true);
  const [reflectionReminders, setReflectionReminders] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('settings')}</h1>
          <p className="text-gray-600">Manage your account and notification preferences.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Display Name</label>
              <input type="text" defaultValue={user?.display_name || user?.username || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">University Email</label>
              <input type="email" defaultValue={user?.email || ''} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Language / भाषा</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <SettingsToggle label="Appointment Reminders" enabled={appointmentReminders} setEnabled={setAppointmentReminders} />
            <SettingsToggle label="New Forum Replies" enabled={forumReplies} setEnabled={setForumReplies} />
            <SettingsToggle label="Daily Reflection Reminder" enabled={reflectionReminders} setEnabled={setReflectionReminders} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
