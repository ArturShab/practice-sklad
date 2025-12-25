import { prisma } from '@/app/lib/prisma'
import ItemsTable from '@/components/items-table'

interface DashboardPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { category: categoryName } = await searchParams

  const items = await (categoryName
    ? (async () => {
        const category = await prisma.category.findUnique({
          where: { name: categoryName },
          include: {
            characteristics: {
              orderBy: { name: 'asc' },
            },
          },
        })
        if (!category) return { items: [], characteristics: [] }
        const fetchedItems = await prisma.item.findMany({
          where: { categoryId: category.id },
          include: {
            category: true,
            charValues: {
              include: {
                characteristic: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        })
        return { items: fetchedItems, characteristics: category.characteristics }
      })()
    : (async () => {
        const fetchedItems = await prisma.item.findMany({
          include: {
            category: true,
            charValues: {
              include: {
                characteristic: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        })
        // Get all unique characteristics from all items
        const characteristicsMap = new Map()
        fetchedItems.forEach((item) => {
          item.charValues.forEach((charValue) => {
            const char = charValue.characteristic
            if (!characteristicsMap.has(char.id)) {
              characteristicsMap.set(char.id, char)
            }
          })
        })
        return {
          items: fetchedItems,
          characteristics: Array.from(characteristicsMap.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        }
      })())

  return (
    <ItemsTable
      items={items.items}
      characteristics={items.characteristics}
      categoryName={categoryName}
    />
  )
}