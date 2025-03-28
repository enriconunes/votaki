import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";
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
    City: {
        idCity: string;
        name: string;
    };
    voteCount: number;
};

// obter votos de uma cidade e cargo específicos
export async function GET(req: NextRequest) {

    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.searchParams)

    const idCity = searchParams.get('idCity') as string
    const idPosition = searchParams.get('idPosition') as string

    if(!idCity || !idPosition){
        return NextResponse.json({ message: `Error: Parâmetros de pesquisa incorretos.`, status: 500 });
    }

    try {
        // Buscar todos os candidatos para a cidade especificada e contar os votos
        const candidates = await prisma.candidate.findMany({
            where: {
                idCity,
                idPosition
            },
            include: {
                Position: true,
                City: true,
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

export async function POST(req: NextRequest) {
    const { email, idCandidate, latitude, longitude } = await req.json();

    try {
        // Verificar se o email já está registrado na tabela de votos
        const existingVotes = await prisma.vote.findMany({
            where: { email },
            include: {
                Candidate: { include: { Position: true } },
            },
        });

        if (existingVotes.length > 0) {
            // Buscar a posição do candidato atual enviado na requisicao
            const candidate = await prisma.candidate.findUnique({
                where: { idCandidate },
                include: { Position: true },
            });

            if (!candidate) {
                return NextResponse.json({ message: "Candidato não encontrado.", status: 404 });
            }

            const candidatePositionId = candidate.idPosition;
            const candidatePositionName = candidate.Position.name;

            // Verificar se o email já votou para o mesmo cargo
            for (const vote of existingVotes) {
                if (vote.Candidate.idPosition === candidatePositionId) {
                    return NextResponse.json({ message: `Você já votou para um candidato no cargo de ${candidatePositionName}. Selecione um candidato de outro cargo para fazer um novo voto.`, status: 400 });
                }
            }
        }

        // Criar novo voto
        const vote = await prisma.vote.create({
            data: {
                email,
                idCandidate,
            },
        });

        // Se as coordenadas forem válidas, criar um registro de Geolocation
        if (latitude !== null && longitude !== null) {
            await prisma.geolocation.create({
                data: {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    idVote: vote.idVote,  // Assume que idVote é o identificador do voto criado
                },
            });
        }

        return NextResponse.json({ vote, status: 200 });

    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}

