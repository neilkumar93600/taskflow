'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Task, TaskStatus } from '@/types'
import { useCreateTask } from '@/hooks/useCreateTask'
import { useUpdateTask } from '@/hooks/useUpdateTask'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  dueDate: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface TaskFormProps {
  mode: 'create' | 'edit'
  task?: Task
}

const STATUS_OPTIONS: { label: string; value: TaskStatus }[] = [
  { label: 'Pending',     value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed',   value: 'completed' },
]

export function TaskForm({ mode, task }: TaskFormProps) {
  const router = useRouter()
  const { mutate: createTask, isPending: isCreating } = useCreateTask()
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()
  const isPending = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    // Cast resolver to align with react-hook-form v7 + latest zod resolver types
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title:       task?.title ?? '',
      description: task?.description ?? '',
      status:      task?.status ?? 'pending',
      dueDate:     task?.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : '',
    },
  })

  const onSubmit = (data: FormData) => {
    const payload = {
      title:       data.title,
      description: data.description || undefined,
      status:      data.status,
      dueDate:     data.dueDate || undefined,
    }

    if (mode === 'create') {
      createTask(payload, { onSuccess: () => router.push('/dashboard') })
    } else if (task) {
      updateTask(
        { id: task.id, data: payload },
        { onSuccess: () => router.push('/dashboard') }
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5"
      noValidate
    >
      {/* Title */}
      <Input
        {...register('title')}
        id="title"
        label="Title *"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        autoFocus
      />

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          placeholder="Add more details (optional)…"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-all duration-150 resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-danger">{errors.description.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          {...register('status')}
          id="status"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     transition-all duration-150"
        >
          {STATUS_OPTIONS.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Due date */}
      <Input
        {...register('dueDate')}
        id="dueDate"
        type="date"
        label="Due Date"
        error={errors.dueDate?.message}
      />

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" loading={isPending}>
          {mode === 'create'
            ? isPending ? 'Creating…' : 'Create Task'
            : isPending ? 'Saving…'   : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dashboard')}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
