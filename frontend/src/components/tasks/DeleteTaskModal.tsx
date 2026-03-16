import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Task } from '@/types'

interface DeleteTaskModalProps {
  task: Task | null
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteTaskModal({
  task,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteTaskModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete task"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isDeleting}>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete{' '}
        <span className="font-medium text-gray-900">
          &ldquo;{task?.title}&rdquo;
        </span>
        ? This action cannot be undone.
      </p>
    </Modal>
  )
}
