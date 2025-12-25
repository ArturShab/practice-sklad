'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DataTable } from '@/components/ui/data-table'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import CreateCategoryForm from '@/components/create-category-form'
import DeleteCategoryDialog from '@/components/delete-category-dialog'
import { Button } from '@/components/ui/button'

interface Category {
  id: number
  name: string
}

interface CategoriesTableProps {
  categories: Category[]
}

const columnHelper = createColumnHelper<Category>()

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState<{
    categoryId: number
    categoryName: string
  } | null>(null)

  const handleSuccess = () => {
    router.refresh()
  }

  const handleDeleteSuccess = () => {
    setDeleteDialog(null)
    router.refresh()
  }

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: 'link',
      header: 'Link',
      cell: (info) => (
        <Link
          href={`/dashboard?category=${info.row.original.name}`}
          className="text-white bg-primary rounded-md px-2 py-1 hover:underline text-sm"
        >
          ==&gt;
        </Link>
      ),
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
              categoryId: info.row.original.id,
              categoryName: info.row.original.name,
            })
          }
        >
          Delete
        </Button>
      ),
    }),
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <CreateCategoryForm onSuccess={handleSuccess} />
      </div>
      <DataTable columns={columns as ColumnDef<Category, unknown>[]} data={categories} />
      {deleteDialog && (
        <DeleteCategoryDialog
          categoryId={deleteDialog.categoryId}
          categoryName={deleteDialog.categoryName}
          onSuccess={handleDeleteSuccess}
          onCancel={() => setDeleteDialog(null)}
        />
      )}
    </div>
  )
}

