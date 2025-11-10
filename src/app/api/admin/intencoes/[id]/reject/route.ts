import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: intentionId } = await context.params;

        const intention = await prisma.intention.findUnique({
            where: { id: intentionId },
        });

        if (!intention) {
            return NextResponse.json({ error: 'Intenção não encontrada' }, { status: 404 });
        }

        const updatedIntention = await prisma.intention.update({
            where: { id: intentionId },
            data: { status: 'rejected' },
        });

        return NextResponse.json(updatedIntention, { status: 200 });

    } catch (error: any) {
        console.error('Erro ao recusar intenção:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}