import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'

export default function CalendarGrid({ currentMonth, selectedDate, onSelectDate, eventsByDate }) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-zinc-400">
        {weekDays.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd')
          const dayEvents = eventsByDate[key] || []
          const inMonth = isSameMonth(d, currentMonth)
          const selected = isSameDay(d, selectedDate)

          return (
            <button
              key={key}
              onClick={() => onSelectDate(d)}
              className={`flex min-h-[64px] flex-col items-start gap-1 rounded-xl p-2 text-left transition-colors sm:min-h-[84px] ${
                selected
                  ? 'bg-zinc-900 dark:bg-white'
                  : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800'
              } ${!inMonth ? 'opacity-40' : ''}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  selected
                    ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white'
                    : isToday(d)
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-300'
                }`}
              >
                {format(d, 'd')}
              </span>
              <div className="flex flex-wrap gap-1">
                {dayEvents.slice(0, 3).map((ev) => (
                  <span
                    key={ev.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: ev.color || '#6366f1' }}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className={`text-[10px] ${selected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    +{dayEvents.length - 3}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
