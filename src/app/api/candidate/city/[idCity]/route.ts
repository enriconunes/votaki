import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../lib/db';

// rota para retornar todas as posições com seus candidatos associados para uma cidade específica
export async function GET(req: NextRequest, { params }: { params: { idCity: string } }) {
    const { idCity } = params;
    
    try {
        // Buscar todas as posições e incluir os candidatos associados à cidade especificada
        const positions = await prisma.position.findMany({
            include: {
                Candidate: {
                    where: {
                        idCity,
                    },
                    orderBy: {
                        createdAt: 'desc', // Ordenar os candidatos por data de criação, se necessário
                    },
                    include: {
                        Party: true, // Incluir todas as informações do partido do candidato
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
