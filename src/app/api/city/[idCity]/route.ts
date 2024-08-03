import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";

export async function GET(req: NextRequest, { params }: { params: { idCity: string } }) {

    const idCity = params.idCity

    try {
        const city = await prisma.city.findFirst({
            where: {
                idCity
            }
        });
        return NextResponse.json({ city, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}
