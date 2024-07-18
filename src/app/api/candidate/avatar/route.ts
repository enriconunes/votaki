import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";
// import { getServerSession } from "next-auth/next";

// route to update candidate's image url
export async function PUT(req: NextRequest) {

    const { idCandidate, image } = await req.json();

    try {
        const candidate = await prisma.candidate.update({
            where: {
                idCandidate,
            },
            data: {
                image
            },
        });
        return NextResponse.json({ candidate, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}
