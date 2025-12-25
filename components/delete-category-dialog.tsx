'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface DeleteCategoryDialogProps {
  categoryId: number
  categoryName: string
  onSuccess: () => void
  onCancel: () => void
}

export default function DeleteCategoryDialog({
  categoryId,
  categoryName,
  onSuccess,
  onCancel,
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Delete Category</h2>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete the category <strong>"{categoryName}"</strong>?
          This action cannot be undone. Categories with existing items cannot be deleted.
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}


