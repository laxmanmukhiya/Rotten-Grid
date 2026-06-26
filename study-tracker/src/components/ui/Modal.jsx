import { FiX } from 'react-icons/fi'

export default function Modal({ open, onClose, title, children, className = '' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <FiX size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
