'use client'

import { Search } from 'lucide-react'
import { useCallback, useRef } from 'react'
import { TaskFilters as Filters, TaskStatus } from '@/types'
import { cn } from '@/utils/cn'

interface TaskFiltersProps {
  filters: Filters
  onChange: (filters: Partial<Filters>) => void
}

const STATUS_TABS: { label: string; value: TaskStatus | undefined }[] = [
  { label: 'All',         value: undefined },
  { label: 'Pending',     value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed' },
]

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onChange({ search: value || undefined })
      }, 350)
    },
    [onChange]
  )

  return (
    <div className="space-y-3">
      {/* Status tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {STATUS_TABS.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => onChange({ status: value })}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap',
              filters.status === value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search tasks…"
          defaultValue={filters.search ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className={cn(
            'w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white',
            'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-150'
          )}
        />
      </div>
    </div>
  )
}
