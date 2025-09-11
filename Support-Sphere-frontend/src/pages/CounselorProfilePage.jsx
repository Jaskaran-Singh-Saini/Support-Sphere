import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const counselors = [
  { 
    id: 1, 
    name: 'Dr. Anjali Sharma', 
    specialty: 'Academic Stress & Anxiety', 
    bio: 'With over 10 years of experience, Dr. Sharma specializes in helping students manage academic pressure and anxiety through cognitive-behavioral techniques.',
    availableDates: ['2025-09-04', '2025-09-05', '2025-09-08', '2025-09-09', '2025-09-11', '2025-09-12', '2025-09-15']
  },
  { 
    id: 2, 
    name: 'Mr. Rohan Gupta', 
    specialty: 'Career & Relationship Counseling', 
    bio: 'Mr. Gupta focuses on guiding students through career decisions and navigating the complexities of personal relationships during college life.',
    availableDates: ['2025-09-03', '2025-09-04', '2025-09-10', '2025-09-11', '2025-09-17', '2025-09-18']
  },
  { 
    id: 3, 
    name: 'Ms. Priya Singh', 
    specialty: 'Depression & Burnout', 
    bio: 'Ms. Singh provides a supportive space for students dealing with feelings of depression, burnout, and emotional exhaustion.',
    availableDates: ['2025-09-08', '2025-09-10', '2025-09-12', '2025-09-16', '2025-09-18', '2025-09-22']
  },
];

const availableTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'];

function CounselorProfilePage() {
  const { counselorId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); 
  const [selectedDate, setSelectedDate] = useState(null);
  
  const counselor = counselors.find(c => c.id === parseInt(counselorId));

  if (!counselor) return <div>Counselor not found.</div>;

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth });

  const handleDateClick = (day) => {
    const fullDate = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (counselor.availableDates.includes(fullDate)) {
      setSelectedDate(fullDate);
    }
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    setSelectedDate(null);
  };
  
  const handleConfirmBooking = () => {
    setIsModalOpen(false);
    toast.success(`Session with ${counselor.name} confirmed!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/counseling" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to All Counselors
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <UserCircleIcon className="w-32 h-32 text-slate-300 mx-auto sm:mx-0 flex-shrink-0" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-800">{counselor.name}</h1>
              <p className="text-lg text-blue-600 font-semibold">{counselor.specialty}</p>
              <p className="text-gray-600 mt-4">{counselor.bio}</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-6 w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
                Book an Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Book with {counselor.name}</h2>
            <div>
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">&larr;</button>
                <h3 className="font-semibold text-lg">{monthName} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">&rarr;</button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day} className="font-medium text-gray-500">{day}</div>)}
                {emptyDays.map((_, i) => <div key={`empty-${i}`}></div>)}
                {calendarDays.map(day => {
                  const fullDate = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isAvailable = counselor.availableDates.includes(fullDate);
                  const isSelected = selectedDate === fullDate;
                  
                  return (
                    <button 
                      key={day} 
                      onClick={() => handleDateClick(day)}
                      disabled={!isAvailable}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' :
                        isAvailable ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
                <div className="mt-6">
                    <h3 className="font-semibold text-lg mb-2">Select an Available Time for {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableTimes.map(time => (
                            <button key={time} className="p-2 border border-gray-300 rounded-lg hover:bg-blue-500 hover:text-white transition-colors focus:bg-blue-500 focus:text-white">
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleConfirmBooking} disabled={!selectedDate} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CounselorProfilePage;