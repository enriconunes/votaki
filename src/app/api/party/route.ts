import { NextRequest, NextResponse } from "next/server";

import prisma from "../../../../lib/db";

export async function GET(req: NextRequest){

    try{

        const party = await prisma.party.findMany()

        return NextResponse.json({party, status: 200})

    } catch(err){

        console.error("ERRO: ", err)
        return NextResponse.json({message: `Error: ${err}`, status: 500})

    }

}

export async function POST(req: NextRequest){

    const { name } = await req.json()

    try{
        const party = await prisma.party.create({
            data: {
                name
            }
        })

        return NextResponse.json({party, status: 200})

    } catch(err){

        console.error("ERRO: ", err)
        return NextResponse.json({message: `Error: ${err}`, status: 500})

    }

}

export async function PUT(req: NextRequest){

    const { idParty, name } = await req.json()

    try{
        const party = await prisma.party.update({
            where: {
                idParty
            },
            data: {
                name
            }
        })

        return NextResponse.json({party, status: 200})

    } catch(err){

        console.error("ERRO: ", err)
        return NextResponse.json({message: `Error: ${err}`, status: 500})

    }

}

export async function DELETE(req: NextRequest){

    const { idParty } = await req.json()

    try{
        const party = await prisma.party.delete({
            where: {
                idParty
            }
        })

        return NextResponse.json({party, status: 200})

    } catch(err){

        console.error("ERRO: ", err)
        return NextResponse.json({message: `Error: ${err}`, status: 500})

    }

}