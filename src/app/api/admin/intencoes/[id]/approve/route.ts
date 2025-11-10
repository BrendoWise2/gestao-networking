import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id: intentionId } = await context.params;

    try {
        const newInvitation = await prisma.$transaction(async (tx) => {
            const intention = await tx.intention.findUnique({
                where: { id: intentionId },
            });

            if (!intention) {
                throw new Error("Intenção não encontrada.");
            }

            if (intention.status === "approved") {
                throw new Error("Esta intenção já foi aprovada.");
            }

            const token = randomBytes(32).toString("hex");

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await tx.intention.update({
                where: { id: intentionId },
                data: { status: "approved" },
            });

            const invitation = await tx.invitation.create({
                data: {
                    token,
                    expiresAt,
                    intentionId,
                },
            });

            return invitation;
        });

        const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            }/convite/${newInvitation.token}`;

        console.log("------------------------------------------------");
        console.log("SIMULAÇÃO DE ENVIO DE E-MAIL");
        console.log(`Link de Convite para ${newInvitation.intentionId}:`);
        console.log(invitationLink);
        console.log("------------------------------------------------");

        return NextResponse.json(newInvitation, { status: 201 });
    } catch (error: any) {
        console.error("Erro ao aprovar intenção:", error);
        return NextResponse.json(
            { error: error.message || "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
