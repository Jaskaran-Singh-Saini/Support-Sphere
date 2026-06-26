import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { apiUrl } from '../config/api';
import toast from 'react-hot-toast';

const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00'];

function CounselorProfilePage() {
  const { counselorId } = useParams();
  const [counselor, setCounselor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    axios.get(apiUrl(`/counselors/${counselorId}/`))
      .then(response => setCounselor(response.data))
      .catch(() => toast.error('Counselor not found.'));
  }, [counselorId]);

  if (!counselor) {
    return <div className="p-8 text-center text-gray-600">Loading counselor profile...</div>;
  }

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) return;

    const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

    axios.post(apiUrl('/appointments/'), {
      counselor: counselor.id,
      scheduled_at: scheduledAt,
    })
      .then(() => {
        toast.success(`Session with ${counselor.name} booked successfully!`);
        setIsModalOpen(false);
      })
      .catch(() => toast.error('Booking failed. Please log in and try again.'));
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 border rounded-lg transition-colors ${selectedTime === time ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-blue-50'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleConfirmBooking} disabled={!selectedDate || !selectedTime} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CounselorProfilePage;
