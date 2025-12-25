'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CharacteristicInput {
  name: string
  displayedName: string
}

export default function CreateCategoryForm({
  onSuccess,
}: {
  onSuccess?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [characteristics, setCharacteristics] = useState<CharacteristicInput[]>([
    { name: '', displayedName: '' },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addCharacteristic = () => {
    setCharacteristics([...characteristics, { name: '', displayedName: '' }])
  }

  const removeCharacteristic = (index: number) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index))
  }

  const updateCharacteristic = (
    index: number,
    field: 'name' | 'displayedName',
    value: string
  ) => {
    const updated = [...characteristics]
    updated[index][field] = value
    setCharacteristics(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryName,
          characteristics: characteristics.filter(
            (char) => char.name.trim() && char.displayedName.trim()
          ),
        }),
      })

      if (response.ok) {
        setCategoryName('')
        setCharacteristics([{ name: '', displayedName: '' }])
        setIsOpen(false)
        onSuccess?.()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        Create Category
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category-name" className="block text-sm font-medium mb-2">
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-input bg-background rounded-md"
              placeholder="Enter category name"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Characteristics</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCharacteristic}
              >
                Add Characteristic
              </Button>
            </div>

            <div className="space-y-3">
              {characteristics.map((char, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={char.name}
                      onChange={(e) =>
                        updateCharacteristic(index, 'name', e.target.value)
                      }
                      placeholder="Name (e.g., cores)"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mb-2"
                    />
                    <input
                      type="text"
                      value={char.displayedName}
                      onChange={(e) =>
                        updateCharacteristic(index, 'displayedName', e.target.value)
                      }
                      placeholder="Displayed Name (e.g., Number of Cores)"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    />
                  </div>
                  {characteristics.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCharacteristic(index)}
                      className="mt-6"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                setCategoryName('')
                setCharacteristics([{ name: '', displayedName: '' }])
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


