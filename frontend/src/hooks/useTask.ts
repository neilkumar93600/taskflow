import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Task } from '@/types'

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () =>
      api.get<{ status: string; task: Task }>(`/tasks/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}
