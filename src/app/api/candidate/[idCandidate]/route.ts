import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";

export async function GET(req: NextRequest, { params }: { params: { idCandidate: string } }) {
    const { idCandidate } = params;

    if (!idCandidate) {
        return NextResponse.json({ message: "Missing idCandidate parameter", status: 400 });
    }

    try {
        const candidate = await prisma.candidate.findUnique({
            where: {
                idCandidate: idCandidate,
            },
        });

        if (!candidate) {
            return NextResponse.json({ message: "Candidate not found", status: 404 });
        }

        return NextResponse.json({ candidate, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}
