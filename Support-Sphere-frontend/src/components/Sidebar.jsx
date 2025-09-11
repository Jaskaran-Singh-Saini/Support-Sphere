import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  BeakerIcon,
  BookOpenIcon,
  UserGroupIcon,
  HeartIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { href: '/', icon: HomeIcon, label: 'Dashboard' },
  { href: '/chat', icon: ChatBubbleLeftEllipsisIcon, label: 'Willow' },
  { href: '/assessments', icon: BeakerIcon, label: 'Assessments' },
  { href: '/self-help', icon: BookOpenIcon, label: 'Self Help' },
  { href: '/forum', icon: UserGroupIcon, label: 'Forum' },
  { href: '/progress', icon: HeartIcon, label: 'My Progress' },
  { href: '/counseling', icon: PhoneIcon, label: 'Counseling' },
];

function Sidebar() {
  const navLinkClasses = ({ isActive }) => 
    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white font-semibold'
        : 'text-gray-600 hover:bg-gray-100'
    }`;
  
  return (
    <aside className="w-64 bg-white p-4 border-r border-gray-200 flex-shrink-0">
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink to={item.href} key={item.label} className={navLinkClasses} end>
              <Icon className="h-6 w-6" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;