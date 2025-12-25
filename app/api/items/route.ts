import { prisma } from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await prisma.item.findMany();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const { name, manufacturer, quantity, price, categoryId, characteristics } = await req.json();
    
    // Get all characteristics for this category
    const categoryCharacteristics = await prisma.characteristic.findMany({
      where: { categoryId },
    });
    
    // Create the item with characteristic values
    const item = await prisma.item.create({
      data: {
        name,
        manufacturer,
        quantity,
        price,
        categoryId,
        charValues: {
          create: categoryCharacteristics.map((char) => {
            // Find the value for this characteristic from the request
            const charValue = characteristics?.find(
              (c: { characteristicId: number; value: string }) => c.characteristicId === char.id
            )?.value || "";
            
            return {
              characteristicId: char.id,
              value: charValue,
            };
          }),
        },
      },
      include: {
        charValues: {
          include: {
            characteristic: true,
          },
        },
      },
    });
    
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Error creating item: " + error },
      { status: 500 }
    );
  }
}