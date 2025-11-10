import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {

    //controller para o metodo get
    try {
        const intentions = await prisma?.intention.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(intentions, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar intencoes:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}