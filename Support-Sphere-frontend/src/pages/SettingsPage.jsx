import { useState } from 'react';

function SettingsToggle({ label, enabled, setEnabled }) {
    return (
        <div 
            onClick={() => setEnabled(!enabled)}
            className="flex items-center justify-between cursor-pointer"
        >
            <span className="font-medium text-gray-700">{label}</span>
            <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
            </div>
        </div>
    );
}

function SettingsPage() {
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [forumReplies, setForumReplies] = useState(true);
  const [reflectionReminders, setReflectionReminders] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Profile & Settings</h1>
          <p className="text-gray-600">Manage your account and notification preferences.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Profile Information</h2>
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <input type="text" defaultValue="Karan" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">University Email</label>
                <input type="email" defaultValue="karan@university.edu" disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100" />
              </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <SettingsToggle label="Appointment Reminders" enabled={appointmentReminders} setEnabled={setAppointmentReminders} />
            <SettingsToggle label="New Forum Replies" enabled={forumReplies} setEnabled={setForumReplies} />
            <SettingsToggle label="Daily Reflection Reminder" enabled={reflectionReminders} setEnabled={setReflectionReminders} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Security</h2>
          <button className="font-semibold text-blue-600 hover:text-blue-800">Change Password</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;