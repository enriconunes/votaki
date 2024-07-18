import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function GET(req: NextRequest) {
    try {
        const positions = await prisma.position.findMany();
        return NextResponse.json({ positions, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { name } = await req.json();
    try {
        const position = await prisma.position.create({
            data: {
                name,
            },
        });
        return NextResponse.json({ position, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { idPosition, name } = await req.json();
    try {
        const position = await prisma.position.update({
            where: {
                idPosition,
            },
            data: {
                name,
            },
        });
        return NextResponse.json({ position, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { idPosition } = await req.json();
    try {
        const position = await prisma.position.delete({
            where: {
                idPosition,
            },
        });
        return NextResponse.json({ position, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}
