import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";

export async function GET(req: NextRequest) {

    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.searchParams)

    const idCandidate = searchParams.get('idCandidate') as string

    if(!idCandidate){
        return NextResponse.json({ message: `Error: Parâmetros incorretos.`, status: 500 });
    }

    try {
        // buscar um candidato com base no id e retornar todos os votos com a geolocalizacao
        const candidate = await prisma.candidate.findUnique({
            where: {
                idCandidate
            },
            include: {
                Vote: {
                    include: {
                        Geolocation: true
                    }
                }
            },
        });

        if (!candidate) {
            return NextResponse.json({ message: "Nenhum candidato encontrado para esta cidade.", status: 404 });
        }

        return NextResponse.json({ candidate, status: 200 });

    } catch (err) {
        console.error("ERRO: ", err);
        return NextResponse.json({ message: `Error: ${err}`, status: 500 });
    }
}