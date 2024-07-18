import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";
// import { getServerSession } from "next-auth/next";

export async function GET(req: NextRequest) {

    // const session = await getServerSession();

    // if (!session) {
    //     return NextResponse.json({ message: "Unauthorized", status: 401 });
    // }

    try {
        const candidates = await prisma.candidate.findMany({
            orderBy: {
                name: "asc"
            },
            include: {
                City: true,
                Party: true,
                Position: true
            }
        });
        return NextResponse.json({ candidates, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }

    // const positions = await prisma.position.findMany({
    //         include: {
    //             Candidate: {
    //                 where: {
    //                     idCity,
    //                 },
    //                 orderBy: {
    //                     createdAt: 'desc', // Ordenar os candidatos por data de criação, se necessário
    //                 },
    //                 include: {
    //                     Party: true, // Incluir todas as informações do partido do candidato
    //                 },
    //             },
    //         },
    //     });
}

export async function POST(req: NextRequest) {

    const { name, description, idPosition, idParty, idCity } = await req.json();

    try {

        const candidate = await prisma.candidate.create({
            data: {
                name,
                description,
                idPosition,
                idParty,
                idCity,
                image: 'https://utfs.io/f/fb7096fd-d7b0-459a-9071-d7f78aab7a67-c8hb0h.png'
            },
        });

        return NextResponse.json({ candidate, status: 200 });

    } catch (err) {

        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { idCandidate, name, description, idPosition, idParty, idCity } = await req.json();
    try {
        const candidate = await prisma.candidate.update({
            where: {
                idCandidate,
            },
            data: {
                name, description, idPosition, idParty, idCity
            },
        });
        return NextResponse.json({ candidate, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { idCandidate } = await req.json();
    try {
        const candidate = await prisma.candidate.delete({
            where: {
                idCandidate,
            },
        });
        return NextResponse.json({ candidate, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}