import { prisma } from "../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);
    const { quantity } = await req.json();

    // Validate quantity is a number and >= 0
    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: "Quantity must be a number and cannot be less than 0" },
        { status: 400 }
      );
    }

    // Check if item exists
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Update the item quantity
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        quantity: Math.floor(quantity), // Ensure it's an integer
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Error updating item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);

    // Check if item exists
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // Delete the item (charValues will be deleted via cascade)
    await prisma.item.delete({
      where: { id: itemId },
    });

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Error deleting item" },
      { status: 500 }
    );
  }
}

