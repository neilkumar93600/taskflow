import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { PaginatedTasksResponse, TaskFilters } from '@/types'

export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () =>
      api
        .get<PaginatedTasksResponse>('/tasks', { params: filters })
        .then((r) => r.data),
  })
}
