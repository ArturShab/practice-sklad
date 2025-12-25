'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import CreateItemForm from '@/components/create-item-form'
import DeleteItemDialog from '@/components/delete-item-dialog'
import { Button } from '@/components/ui/button'

interface Item {
  id: number
  name: string
  manufacturer: string | null
  quantity: number
  price: string | { toString(): string }
  categoryId: number
  category: {
    id: number
    name: string
  }
  charValues: Array<{
    id: number
    value: string
    characteristic: {
      id: number
      name: string
      displayedName: string
    }
  }>
}

interface Characteristic {
  id: number
  name: string
  displayedName: string
}

interface ItemsTableProps {
  items: Item[]
  characteristics: Characteristic[]
  categoryName?: string
}

const columnHelper = createColumnHelper<Item>()

export default function ItemsTable({
  items,
  characteristics,
  categoryName,
}: ItemsTableProps) {
  const router = useRouter()
  const [editingQuantity, setEditingQuantity] = useState<number | null>(null)
  const [quantityValue, setQuantityValue] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    itemId: number
    itemName: string
  } | null>(null)

  const handleSuccess = () => {
    router.refresh()
  }

  const handleDeleteSuccess = () => {
    setDeleteDialog(null)
    router.refresh()
  }

  const handleQuantityEdit = (itemId: number, currentQuantity: number) => {
    setEditingQuantity(itemId)
    setQuantityValue(currentQuantity.toString())
  }

  const handleQuantityCancel = () => {
    setEditingQuantity(null)
    setQuantityValue('')
  }

  const handleQuantitySave = async (itemId: number) => {
    const newQuantity = parseInt(quantityValue)
    
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert('Quantity must be a number and cannot be less than 0')
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (response.ok) {
        setEditingQuantity(null)
        setQuantityValue('')
        router.refresh()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    } finally {
      setIsUpdating(false)
    }
  }

  const baseColumns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('manufacturer', {
      header: 'Manufacturer',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: (info) => {
        const itemId = info.row.original.id
        const currentQuantity = info.getValue()
        
        if (editingQuantity === itemId) {
          return (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={quantityValue}
                onChange={(e) => setQuantityValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleQuantitySave(itemId)
                  } else if (e.key === 'Escape') {
                    handleQuantityCancel()
                  }
                }}
                className="w-20 px-2 py-1 border border-input bg-background rounded-md text-sm"
                autoFocus
                disabled={isUpdating}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantitySave(itemId)}
                disabled={isUpdating}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuantityCancel}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          )
        }
        
        return (
          <div className="flex items-center gap-2">
            <span>{currentQuantity}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleQuantityEdit(itemId, currentQuantity)}
            >
              Edit
            </Button>
          </div>
        )
      },
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: (info) => {
        const value = info.getValue()
        return typeof value === 'string' ? value : value.toString()
      },
    }),
    columnHelper.display({
      id: 'delete',
      header: 'Delete',
      cell: (info) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() =>
            setDeleteDialog({
              itemId: info.row.original.id,
              itemName: info.row.original.name,
            })
          }
        >
          Delete
        </Button>
      ),
    }),
  ] as ColumnDef<Item, unknown>[]

  // Add category column only if showing all items
  if (!categoryName) {
    baseColumns.push(
      columnHelper.accessor('category.name', {
        header: 'Category',
        cell: (info) => info.getValue(),
      }) as ColumnDef<Item, unknown>
    )
  }

  // Create dynamic columns for characteristics
  const characteristicColumns = characteristics.map((char) =>
    columnHelper.display({
      id: `char-${char.id}`,
      header: char.displayedName,
      cell: (info) => {
        const charValue = info.row.original.charValues.find(
          (cv) => cv.characteristic.id === char.id
        )
        return charValue ? charValue.value : '-'
      },
    })
  ) as ColumnDef<Item, unknown>[]

  const columns = [...baseColumns, ...characteristicColumns] as ColumnDef<Item, unknown>[]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {categoryName ? `Items - ${categoryName}` : 'All Items'}
        </h1>
        <CreateItemForm onSuccess={handleSuccess} />
      </div>
      <DataTable columns={columns as ColumnDef<Item, unknown>[]} data={items} />
      {deleteDialog && (
        <DeleteItemDialog
          itemId={deleteDialog.itemId}
          itemName={deleteDialog.itemName}
          onSuccess={handleDeleteSuccess}
          onCancel={() => setDeleteDialog(null)}
        />
      )}
    </div>
  )
}

