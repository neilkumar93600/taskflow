import { TaskForm } from '@/components/tasks/TaskForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Task — TaskFlow' }

export default function NewTaskPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Task</h1>
      <TaskForm mode="create" />
    </div>
  )
}
