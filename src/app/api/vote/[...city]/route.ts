import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";
import { useSearchParams } from 'next/navigation'
// import { getServerSession } from "next-auth/next";

// Define a type for the candidate including the nested Position and vote count
type CandidateWithVoteCount = {
    idCandidate: string;
    name: string;
    description: string;
    image: string;
    idPosition: string;
    idParty: string;
    idCity: string;
    createdAt: Date;
    updatedAt: Date;
    Position: {
        idPosition: string;
        name: string;
    };
    voteCount: number;
};

export async function GET(req: NextRequest, { params }: { params: { idCity: string, idPosition: string } }) {

    console.log("\n\n-----------\n", params)

    const { idCity, idPosition } = params;

    try {
        // Buscar todos os candidatos para a cidade especificada e contar os votos
        const candidates = await prisma.candidate.findMany({
            where: {
                idCity,
                idPosition
            },
            include: {
                Position: true,
                _count: {
                    select: {
                        Vote: true,
                    },
                },
            },
        });

        if (candidates.length === 0) {
            return NextResponse.json({ message: "Nenhum candidato encontrado para esta cidade.", status: 404 });
        }

        // Mapear os candidatos para incluir a contagem de votos
        const candidatesWithVoteCount: CandidateWithVoteCount[] = candidates.map(candidate => ({
            ...candidate,
            voteCount: candidate._count.Vote,
        }));

        // Ordenar os candidatos pelo total de votos em ordem decrescente
        candidatesWithVoteCount.sort((a, b) => b.voteCount - a.voteCount);

        return NextResponse.json({ candidatesWithVoteCount, status: 200 });

    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}