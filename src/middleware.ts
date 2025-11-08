import { NextRequest, NextResponse } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export function middleware(req: NextRequest) {

    // Para mostrar se o middleware esta funcionando
    console.log('--- MIDDLEWARE INTERCEPTOU: ', req.nextUrl.pathname);

    //verifica se a rota comeca com /api/admin
    if (req.nextUrl.pathname.startsWith('/api/admin')) {

        if (!ADMIN_SECRET) {
            console.error('ERRO GRAVE: ADMIN_SECRET nao esta definido no servidor.');
            return NextResponse.json({ error: 'Erro de configuracao do servidor' }, { status: 500 });
        }

        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split('Bearer ')[1]; // Ajuste no split

        if (token && token === ADMIN_SECRET) {
            return NextResponse.next();
        }

        return NextResponse.json(
            { error: 'Nao autorizado' },
            { status: 401 }
        );
    }

    // Se não for rota de admin, deixa passar
    return NextResponse.next();
}

// quais rotas o middleware vai ouvir
export const config = {
    matcher: '/api/admin/:path*', //para proteger tudo dentro de /api/admin
};