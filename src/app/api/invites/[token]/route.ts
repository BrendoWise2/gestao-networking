import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { error } from 'console';


export async function GET(req: NextRequest, { params }: { token: string } }) {

    const token = params.token;

    //Validacao do convite como se existe, se e valido, ja utilizado ou expirou.

    try {
        const invitation = await prisma.invitation.findUnique({
            where: { token: token },
            include: {
                intention: true,
            },
        });

        if (!invitation) {
            return NextResponse.json({ error: "Convite Invalido" }, { status: 404 });
        }

        if (invitation.used) {
            return NextResponse.json({ error: "Convite ja utilizado" }, { status: 410 })
        }

        if (new Date() > invitation.expiresAt) {
            return NextResponse.json({ error: 'Convite expirado' }, { status: 410 });
        }

    } catch (error: any) {
        console.error("Erro ao validar o convite", error);

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }

}