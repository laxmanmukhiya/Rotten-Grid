import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiCalendar,
  FiBook,
  FiClock,
  FiCheckSquare,
  FiTrendingUp,
  FiX,
} from 'react-icons/fi'

const links = [
  { to: '/', label: 'Dashboard', icon: FiHome },
  { to: '/calendar', label: 'Calendar', icon: FiCalendar },
  { to: '/subjects', label: 'Subjects', icon: FiBook },
  { to: '/timer', label: 'Study Timer', icon: FiClock },
  { to: '/planner', label: 'Daily Planner', icon: FiCheckSquare },
  { to: '/progress', label: 'Progress', icon: FiTrendingUp },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-200 bg-white px-4 py-6 transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-950 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center >
              <img
                src= "/logo.png "
                alt = "RottenGrid Logo"
                className = "h-8 w-8 object-contain"
                />
            </div>
            <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              RottenGrid
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-400 lg:hidden">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
