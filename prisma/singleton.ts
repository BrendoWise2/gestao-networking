import { POST } from './route';
import { prismaMock } from 'prisma/singleton';
import { NextRequest } from 'next/server';


describe('API POST /api/admin/intencoes/[id]/approve', () => {

    // "it" (ou "test") descreve o que o teste deve fazer
    it('deve aprovar uma intenção e criar um convite com sucesso', async () => {

        // --- 1. CONFIGURAÇÃO (Arrange) ---
        // O que esperamos que o "dublê" do Prisma faça

        // Simula a intenção que o Prisma vai "encontrar"
        const mockIntention = {
            id: 'test-intention-id',
            status: 'pending',
            // ... (não precisa dos outros campos para este teste)
        };

        // Diz ao dublê: "Quando o código chamar 'prisma.intention.findUnique', 
        // finja que achou isso:"
        prismaMock.intention.findUnique.mockResolvedValue(mockIntention as any);

        // Diz ao dublê: "Quando o código chamar 'prisma.$transaction',
        // apenas execute o que te passarem (mas usando o dublê)"
        prismaMock.$transaction.mockImplementation((callback) => callback(prismaMock));

        // --- 2. EXECUÇÃO (Act) ---
        // Chama a sua função POST de verdade

        const request = {} as NextRequest; // Simula a requisição

        // Simula os 'params' (como o Next.js faria)
        const context = {
            params: Promise.resolve({ id: 'test-intention-id' }),
        };

        const response = await POST(request, context as any);
        const body = await response.json();

        // --- 3. VERIFICAÇÃO (Assert) ---
        // Checa se o resultado foi o esperado

        // A resposta da API foi 201 (Created)?
        expect(response.status).toBe(201);

        // O corpo da resposta tem um token? (provando que o convite foi criado)
        expect(body.token).toBeDefined();

        // O dublê do Prisma foi chamado para ATUALIZAR a intenção?
        expect(prismaMock.intention.update).toHaveBeenCalledWith({
            where: { id: 'test-intention-id' },
            data: { status: 'approved' },
        });

        // O dublê do Prisma foi chamado para CRIAR o convite?
        expect(prismaMock.invitation.create).toHaveBeenCalled();
    });

    it('deve retornar erro se a intenção já foi aprovada', async () => {
        // 1. Configuração (Simula uma intenção que já está "approved")
        const alreadyApprovedIntention = { id: 'test-id', status: 'approved' };
        prismaMock.intention.findUnique.mockResolvedValue(alreadyApprovedIntention as any);
        prismaMock.$transaction.mockImplementation((callback) => callback(prismaMock));

        // 2. Execução
        const request = {} as NextRequest;
        const context = {
            params: Promise.resolve({ id: 'test-id' }),
        };
        const response = await POST(request, context as any);
        const body = await response.json();

        // 3. Verificação
        expect(response.status).toBe(500); // Esperamos um erro do servidor
        expect(body.error).toBe('Esta intenção já foi aprovada.');
    });
});