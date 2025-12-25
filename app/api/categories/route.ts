import { prisma } from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories: " + error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, characteristics } = await req.json();
    const category = await prisma.category.create({
      data: {
        name,
        characteristics: {
          create: characteristics?.map((char: { name: string; displayedName: string }) => ({
            name: char.name,
            displayedName: char.displayedName,
          })) || [],
        },
      },
      include: {
        characteristics: true,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Error creating category: " + error },
      { status: 500 }
    );
  }
}