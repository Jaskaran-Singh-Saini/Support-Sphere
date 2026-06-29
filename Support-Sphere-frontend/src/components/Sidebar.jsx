import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  BeakerIcon,
  UserGroupIcon,
  HeartIcon,
  PhoneIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  SparklesIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const navGroups = [
  {
    label: 'Today',
    items: [
      { href: '/',           icon: HomeIcon,                    label: 'Dashboard' },
      { href: '/reflection', icon: PencilSquareIcon,            label: 'Reflection' },
      { href: '/tasks',      icon: CheckCircleIcon,             label: 'Self-Care' },
    ],
  },
  {
    label: 'Grow',
    items: [
      { href: '/assessments', icon: BeakerIcon,    label: 'Assessments' },
      { href: '/progress',    icon: HeartIcon,     label: 'My Progress' },
      { href: '/self-help',   icon: SparklesIcon,  label: 'Resources' },
    ],
  },
  {
    label: 'Connect',
    items: [
      { href: '/forum',      icon: UserGroupIcon,               label: 'Forum' },
      { href: '/chat',       icon: ChatBubbleLeftEllipsisIcon,  label: 'Willow AI' },
    ],
  },
  {
    label: 'Support',
    items: [
      { href: '/counseling', icon: PhoneIcon,      label: 'Counseling' },
    ],
  },
];

function Sidebar() {
  const activeCls  = 'flex items-center space-x-3 p-3 rounded-xl transition-all bg-forest text-white font-semibold shadow-sm';
  const defaultCls = 'flex items-center space-x-3 p-3 rounded-xl transition-all text-bark hover:bg-moss/20 hover:text-forest';

  return (
    <aside className="w-64 bg-cream border-r border-moss/30 flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-moss/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white stroke-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6M9 9l3-3 3 3"/>
            </svg>
          </div>
          <span className="font-heading font-bold text-forest text-lg">Support Sphere</span>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="nav-group-label">{group.label}</p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) => isActive ? activeCls : defaultCls}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;