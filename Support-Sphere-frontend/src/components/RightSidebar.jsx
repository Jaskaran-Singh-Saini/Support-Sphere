function RightSidebar() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-800">Your Week at a Glance</h3>
        <div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Mood Trend Graph</div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-800">Next Appointment</h3>
        <div className="mt-4">
          <p className="font-semibold text-gray-700">Therapy Session with Dr. Lee</p>
          <p className="text-gray-500">Tomorrow at 10:00 AM</p>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;