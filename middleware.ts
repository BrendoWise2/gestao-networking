import { error } from "console";
import { NextRequest, NextResponse } from "next/server";


const ADMIN_SECRET = process.env.ADMIN_SECRET;

export function middleware(req: NextRequest) {

    //verifica se a rota comeca com /api/admin
    if (req.nextUrl.pathname.startsWith('/api/admin')) {

        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split('Bearer')[1];

        if (token === ADMIN_SECRET) {
            return NextResponse.next();
        }

        return NextResponse.json({
            error: 'Nao autorizado'
        }, { status: 401 });
    }

    return NextResponse.next();
}

// quais rotas o middleware vai ouvir
export const config = {
    matcher: '/api/admin/:path*', //para proteger tudo dentro de /api/admin
};