export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface JwtPayload {
  userId: string
  email: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationMeta
}
