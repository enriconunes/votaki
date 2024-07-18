import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";
// import { getServerSession } from "next-auth/next";

export async function GET(req: NextRequest) {

    // const session = await getServerSession();

    // if (!session) {
    //     return NextResponse.json({ message: "Unauthorized", status: 401 });
    // }

    try {
        const cities = await prisma.city.findMany();
        return NextResponse.json({ cities, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { name } = await req.json();
    try {
        const city = await prisma.city.create({
            data: {
                name,
            },
        });
        return NextResponse.json({ city, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { idCity, name } = await req.json();
    try {
        const city = await prisma.city.update({
            where: {
                idCity,
            },
            data: {
                name,
            },
        });
        return NextResponse.json({ city, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { idCity } = await req.json();
    try {
        const city = await prisma.city.delete({
            where: {
                idCity,
            },
        });
        return NextResponse.json({ city, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}