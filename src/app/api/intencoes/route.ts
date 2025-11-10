import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';


const intentionSchema = z.object({
    nome: z.string().min(3, { message: 'Nome é obrigatório' }),
    email: z.string().email({ message: 'Email inválido' }),
    telefone: z.string().optional(),
    mensagem: z.string().optional(),
});


export async function POST(req: NextRequest) {
    try {

        const body = await req.json();


        const data = intentionSchema.parse(body);


        const newIntention = await prisma.intention.create({
            data: {
                nome: data.nome,
                email: data.email,
                telefone: data.telefone,
                mensagem: data.mensagem,
                status: 'pending', // Status inicial
            },
        });


        return NextResponse.json(newIntention, { status: 201 });

    } catch (error) {

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: error.issues },
                { status: 400 }
            );
        }

        console.error('Erro ao criar intenção:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}