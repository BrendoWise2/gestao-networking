import DashboardStats from './DashboardStats';
import styles from '../admin.module.scss';
import Link from 'next/link';
import { Suspense } from 'react';

export default function DashboardPage() {
    return (
        <main className={styles.adminPage}>

            <Link href="/admin" style={{ textDecoration: 'none' }}>
                &larr; Voltar para Gestão de Intenções
            </Link>

            <h1 style={{ marginTop: '1.5rem' }}>Dashboard de Performance</h1>
            <p>Indicadores chave do grupo (dados simulados).</p>

            <hr style={{ margin: '2rem 0' }} />

            <Suspense fallback={<p>Carregando indicadores...</p>}>
                <DashboardStats />
            </Suspense>
        </main>
    );
}