import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from "zod";
import { hash } from 'bcryptjs';

//Validacao de dados do formulario
const completeForm = z.object({
    token: z.string().min(1, 'Token é obrigatório'),
    nome: z.string().min(3, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    telefone: z.string().optional(),
    empresa: z.string().optional(),
    cargo: z.string().optional(),
})


export async function POST(req: NextRequest) {



    try {
        const body = await req.json();
        const data = completeForm.parse(body);

        const newMember = await prisma.$transaction(async (tx) => {

            const invitation = await tx.invitation.findUnique({
                where: { token: data.token },
            });

            if (!invitation || invitation.used || new Date() > invitation.expiresAt) {

                throw new Error("Convite invalido, usado ou expirado.");
            }

            const existingMember = await tx.member.findUnique({
                where: { email: data.email },
            });

            if (existingMember) {
                throw new Error("Um membro com este email ja existe.")
            }

            const passwordHash = await hash(data.senha, 10);

            const member = await tx.member.create({
                data: {
                    nome: data.nome,
                    email: data.email,
                    senha: passwordHash,
                    telefone: data.telefone,
                    empresa: data.empresa,
                    cargo: data.cargo,
                },
            });

            await tx.invitation.update({
                where: { id: invitation.id },
                data: { used: true },
            });

            return member;
        });

        return NextResponse.json(newMember, { status: 201 });

    } catch (error) {

        // Erro de validacao do Zod(email invalido, senha curta)
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: error.issues },
                { status: 400 }
            );
        }

        // Erro de Convite invalido, Email ja existe)
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        // Erro (falha ao conectar no banco)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );

    }

}