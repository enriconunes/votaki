import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";

export async function GET(req: NextRequest, { params }: { params: { idPosition: string } }) {

    const idPosition = params.idPosition

    try {
        const position = await prisma.position.findFirst({
            where: {
                idPosition
            }
        });
        return NextResponse.json({ position, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}
