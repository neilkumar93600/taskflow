export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface User {
  id: string
  name: string
  email: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  dueDate: string | null
  createdAt: string
  updatedAt: string
  userId: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedTasksResponse {
  status: string
  tasks: Task[]
  pagination: PaginationMeta
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  dueDate?: string
}

export interface UpdateTaskPayload {
  title?: string
  description?: string | null
  status?: TaskStatus
  dueDate?: string | null
}

export interface TaskFilters {
  page?: number
  limit?: number
  status?: TaskStatus
  search?: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  setAccessToken: (token: string) => void
}
