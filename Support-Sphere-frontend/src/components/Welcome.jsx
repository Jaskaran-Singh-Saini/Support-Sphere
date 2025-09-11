function Welcome({ name }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome back, {name}!
      </h1>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-500 mb-1">Affirmation of the day</p>
        <p className="text-gray-700 italic">You are capable of amazing things.</p>
      </div>
    </div>
  );
}

export default Welcome;