import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '@/lib/axios'
import { CreateTaskPayload, UpdateTaskPayload, Task } from '@/types'

// ── Create ────────────────────────────────────────────────────────────────────

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      api.post<{ task: Task }>('/tasks', payload).then((r) => r.data.task),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task created!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create task')
    },
  })
}

// ── Update ────────────────────────────────────────────────────────────────────

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) =>
      api.patch<{ task: Task }>(`/tasks/${id}`, data).then((r) => r.data.task),
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['task', task.id] })
      toast.success('Task updated!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update task')
    },
  })
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/tasks/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Task deleted')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete task')
    },
  })
}

// ── Toggle ────────────────────────────────────────────────────────────────────

export function useToggleTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<{ task: Task }>(`/tasks/${id}/toggle`).then((r) => r.data.task),
    onSuccess: (task) => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['task', task.id] })
      toast.success(`Status → ${task.status.replace('_', ' ')}`)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update status')
    },
  })
}
