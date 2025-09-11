import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircleIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/solid';

function Header({ onMenuClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <header className="bg-white shadow-sm p-4 sticky top-0 z-10 border-b">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden p-1">
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-xl font-bold text-gray-800">Support Sphere</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setHasUnread(false); }} className="relative">
              <BellIcon className="h-7 w-7 text-gray-500 hover:text-blue-600" />
              {hasUnread && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>
            {isNotificationsOpen && (
              <div 
                onMouseLeave={() => setIsNotificationsOpen(false)}
                className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-20 border"
              >
                <div className="p-2 border-b"><p className="font-bold text-gray-800">Notifications</p></div>
                <Link to="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                  <p className="font-semibold">Appointment Confirmed</p>
                  <p className="text-xs text-gray-500">Your session with Dr. Sharma is confirmed for tomorrow.</p>
                </Link>
                 <Link to="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                  <p className="font-semibold">New Reply in Forum</p>
                  <p className="text-xs text-gray-500">"HelpfulBadger" replied to your post about exam stress.</p>
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
              <UserCircleIcon className="h-9 w-9 text-gray-500 hover:text-blue-600" />
            </button>
            {isDropdownOpen && (
              <div 
                onMouseLeave={() => setIsDropdownOpen(false)} 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border"
              >
                <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
                <Link to="/student/login" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;