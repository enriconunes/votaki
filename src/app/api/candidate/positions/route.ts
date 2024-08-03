import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';

// ---- DESCONTINUADO ----

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const idCity = searchParams.get('idCity') as string;
    const number = searchParams.get('number') as string;

    try {
        // objeto where dinamico
        const whereClause: any = {};

        // Se um parâmetro for igual a 'all', ele não é incluído no where. se for diferente, seu valor é passado no where.
        if (idCity !== 'all') {
            whereClause.idCity = idCity;
        }
        if (number !== 'all') {
            whereClause.number = number;
        }

        const positions = await prisma.position.findMany({
            include: {
                Candidate: {
                    where: whereClause,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        Party: true,
                    },
                },
            },
        });

        return NextResponse.json({ positions, status: 200 });
    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}
