import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";
// import { getServerSession } from "next-auth/next";

export async function POST(req: NextRequest) {
    const { email, idCandidate } = await req.json();

    try {
        // Verificar se o email já está registrado na tabela de votos
        const existingVotes = await prisma.vote.findMany({
            where: {
                email,
            },
            include: {
                Candidate: {
                    include: {
                        Position: true,
                    },
                },
            },
        });

        if (existingVotes.length > 0) {
            // Buscar a posição do candidato atual passado na requisicao
            const candidate = await prisma.candidate.findUnique({
                where: {
                    idCandidate,
                },
                include: {
                    Position: true,
                },
            });

            if (!candidate) {
                return NextResponse.json({ message: "Candidato não encontrado.", status: 404 });
            }

            const candidatePositionId = candidate.idPosition;
            const candidatePositionName = candidate.Position.name;

            // Verificar se o email já votou para a mesma posição
            // 'existingVotes' é um array com todos os registros de votos deste email
            // o ciclo abaixo compara a posicao do candidato atual com a posicao dos candidatos presentes no array de registros
            for (const vote of existingVotes) {
                if (vote.Candidate.idPosition === candidatePositionId) {
                    return NextResponse.json({ message: `Voce já votou para um candidato no cargo de ${candidatePositionName}. Selecione um candidato de outro cargo para fazer um novo voto.`, status: 400 });
                }
            }
        }

        // Criar um novo voto
        const vote = await prisma.vote.create({
            data: {
                email,
                idCandidate,
            },
        });

        return NextResponse.json({ vote, status: 200 });

    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

