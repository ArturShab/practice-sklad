'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Category {
  id: number
  name: string
}

interface Characteristic {
  id: number
  name: string
  displayedName: string
}

interface CharacteristicValue {
  characteristicId: number
  value: string
}

export default function CreateItemForm({
  onSuccess,
}: {
  onSuccess?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('')
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([])
  const [characteristicValues, setCharacteristicValues] = useState<
    Record<number, string>
  >({})
  const [itemData, setItemData] = useState({
    name: '',
    manufacturer: '',
    quantity: '',
    price: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isLoadingCharacteristics, setIsLoadingCharacteristics] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  useEffect(() => {
    if (!selectedCategoryId) {
      setCharacteristics([])
      setCharacteristicValues({})
      return
    }

    setIsLoadingCharacteristics(true)
    const fetchChar = async () => {
      try {
        const response = await fetch(`/api/categories/${selectedCategoryId}`)
        if (response.ok) {
          const categoryDetail = await response.json()
          setCharacteristics(categoryDetail.characteristics || [])
          setCharacteristicValues({})
        } else {
          console.error('Failed to fetch category details')
          setCharacteristics([])
        }
      } catch (error) {
        console.error('Error fetching characteristics:', error)
        setCharacteristics([])
      } finally {
        setIsLoadingCharacteristics(false)
      }
    }
    fetchChar()
  }, [selectedCategoryId])

  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId ? Number(categoryId) : '')
    if (!categoryId) {
      setCharacteristics([])
      setCharacteristicValues({})
      return
    }

    setIsLoadingCharacteristics(true)
    try {
      const response = await fetch(`/api/categories/${categoryId}`)
      if (response.ok) {
        const categoryDetail = await response.json()
        setCharacteristics(categoryDetail.characteristics || [])
        // Reset characteristic values when category changes
        setCharacteristicValues({})
      } else {
        console.error('Failed to fetch category details')
        setCharacteristics([])
      }
    } catch (error) {
      console.error('Error fetching characteristics:', error)
      setCharacteristics([])
    } finally {
      setIsLoadingCharacteristics(false)
    }
  }

  const updateCharacteristicValue = (characteristicId: number, value: string) => {
    setCharacteristicValues({
      ...characteristicValues,
      [characteristicId]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategoryId) {
      alert('Please select a category')
      return
    }

    setIsSubmitting(true)

    try {
      const characteristicsArray: CharacteristicValue[] = characteristics.map(
        (char) => ({
          characteristicId: char.id,
          value: characteristicValues[char.id] || '',
        })
      )

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemData.name,
          manufacturer: itemData.manufacturer || null,
          quantity: Number(itemData.quantity),
          price: itemData.price,
          categoryId: Number(selectedCategoryId),
          characteristics: characteristicsArray,
        }),
      })

      if (response.ok) {
        setItemData({ name: '', manufacturer: '', quantity: '', price: '' })
        setSelectedCategoryId('')
        setCharacteristics([])
        setCharacteristicValues({})
        setIsOpen(false)
        onSuccess?.()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Failed to create item')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        Create Item
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="item-name" className="block text-sm font-medium mb-2">
                Item Name *
              </label>
              <input
                id="item-name"
                type="text"
                value={itemData.name}
                onChange={(e) =>
                  setItemData({ ...itemData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-input bg-background rounded-md"
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium mb-2">
                Manufacturer
              </label>
              <input
                id="manufacturer"
                type="text"
                value={itemData.manufacturer}
                onChange={(e) =>
                  setItemData({ ...itemData, manufacturer: e.target.value })
                }
                className="w-full px-4 py-2 border border-input bg-background rounded-md"
                placeholder="Enter manufacturer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                  Quantity *
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={itemData.quantity}
                  onChange={(e) =>
                    setItemData({ ...itemData, quantity: e.target.value })
                  }
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-input bg-background rounded-md"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">
                  Price *
                </label>
                <input
                  id="price"
                  type="text"
                  value={itemData.price}
                  onChange={(e) =>
                    setItemData({ ...itemData, price: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-input bg-background rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                disabled={isLoadingCategories}
                className="w-full px-4 py-2 border border-input bg-background rounded-md"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {isLoadingCharacteristics && (
              <div className="text-sm text-muted-foreground">Loading characteristics...</div>
            )}

            {characteristics.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Characteristics
                </label>
                <div className="space-y-3">
                  {characteristics.map((char) => (
                    <div key={char.id}>
                      <label
                        htmlFor={`char-${char.id}`}
                        className="block text-sm mb-1"
                      >
                        {char.displayedName}
                      </label>
                      <input
                        id={`char-${char.id}`}
                        type="text"
                        value={characteristicValues[char.id] || ''}
                        onChange={(e) =>
                          updateCharacteristicValue(char.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        placeholder={`Enter ${char.displayedName.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false)
                setItemData({ name: '', manufacturer: '', quantity: '', price: '' })
                setSelectedCategoryId('')
                setCharacteristics([])
                setCharacteristicValues({})
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

