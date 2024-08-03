import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const idCity = searchParams.get('idCity') as string;
    const idPosition = searchParams.get('idPosition') as string;
    const number = searchParams.get('number') as string;

    try {
        const candidate = await prisma.candidate.findFirst({
            where: {
                idPosition,
                idCity,
                number
            },
            include: {
                Party: true,
                Position: true
            },
        });

        return NextResponse.json({ candidate, status: 200 });
    } catch (err) {
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}
