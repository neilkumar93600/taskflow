'use client'

import { useParams } from 'next/navigation'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTask } from '@/hooks/useTask'

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useTask(id)

  if (isLoading) {
    return (
      <div className="max-w-xl space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p className="text-danger font-medium">Task not found or access denied.</p>
    )
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
      <TaskForm mode="edit" task={data.task} />
    </div>
  )
}
