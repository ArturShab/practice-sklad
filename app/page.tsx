import { prisma } from '@/app/lib/prisma'
import CategoriesTable from '@/components/categories-table'

export default async function Page() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return <CategoriesTable categories={categories} />
}

