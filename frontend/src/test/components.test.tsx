import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DeleteTaskModal } from '@/components/tasks/DeleteTaskModal'
import { Task } from '@/types'

// ── Badge ─────────────────────────────────────────────────────────────────────
describe('Badge', () => {
  it('renders "Pending" for pending status', () => {
    render(<Badge status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders "In Progress" for in_progress status', () => {
    render(<Badge status="in_progress" />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders "Completed" for completed status', () => {
    render(<Badge status="completed" />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })
})

// ── Button ────────────────────────────────────────────────────────────────────
describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('is disabled when loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Save</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick} disabled>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})

// ── DeleteTaskModal ────────────────────────────────────────────────────────────
const mockTask: Task = {
  id: '1',
  title: 'Test task',
  description: null,
  status: 'pending',
  dueDate: null,
  userId: 'u1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('DeleteTaskModal', () => {
  it('shows task title in confirmation text', () => {
    render(
      <DeleteTaskModal
        task={mockTask}
        isOpen={true}
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )
    expect(screen.getByText(/Test task/)).toBeInTheDocument()
  })

  it('calls onConfirm when Delete button is clicked', async () => {
    const onConfirm = vi.fn()
    render(
      <DeleteTaskModal
        task={mockTask}
        isOpen={true}
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Cancel button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <DeleteTaskModal
        task={mockTask}
        isOpen={true}
        isDeleting={false}
        onClose={onClose}
        onConfirm={vi.fn()}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows loading state while deleting', () => {
    render(
      <DeleteTaskModal
        task={mockTask}
        isOpen={true}
        isDeleting={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )
    expect(screen.getByText(/deleting/i)).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <DeleteTaskModal
        task={mockTask}
        isOpen={false}
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    )
    expect(screen.queryByText(/Test task/)).not.toBeInTheDocument()
  })
})
