import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";
// import { getServerSession } from "next-auth/next";

// retornar um cadidato especifico atraves do seu id
export async function GET(req: NextRequest, { params }: { params: { idCandidate: string } }) {

    const idCandidate = params.idCandidate

    // const session = await getServerSession();

    // if (!session) {
    //     return NextResponse.json({ message: "Unauthorized", status: 401 });
    // }

    try {
        const candidate = await prisma.candidate.findUnique({
            where: {
                idCandidate
            }
        })

        return NextResponse.json({ candidate, status: 200 });

    } catch (err) {

        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}
