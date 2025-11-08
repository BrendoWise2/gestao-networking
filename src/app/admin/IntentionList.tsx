'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.scss'; // Importa o SCSS

// Define o "tipo" de dado que esperamos da API
type Intention = {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
    status: string;
    createdAt: string;
};

export default function IntentionList() {
    const [intentions, setIntentions] = useState<Intention[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar os dados da API
    async function fetchIntentions() {
        setIsLoading(true);
        setError(null);
        try {
            // NOTA: Esta parte do prompt não é ideal para UX,
            // mas é a mais rápida para o teste (como permitido).
            const secret = prompt('Digite o ADMIN_SECRET para autenticar:');

            if (!secret) {
                throw new Error('O ADMIN_SECRET é obrigatório.');
            }

            const response = await fetch('/api/admin/intencoes', {
                headers: {
                    'Authorization': `Bearer ${secret}`,
                },
            });

            if (!response.ok) {
                throw new Error('Não autorizado ou falha ao buscar dados.');
            }

            const data: Intention[] = await response.json();
            setIntentions(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    // Hook para buscar os dados assim que o componente carregar
    useEffect(() => {
        fetchIntentions();
    }, []); // O array vazio [] faz isso rodar só uma vez

    // Função para lidar com Aprovação ou Recusa
    async function handleAction(id: string, action: 'approve' | 'reject') {
        if (!confirm(`Tem certeza que deseja ${action === 'approve' ? 'aprovar' : 'recusar'} esta intenção?`)) {
            return;
        }

        try {
            const secret = prompt('Digite o ADMIN_SECRET para autenticar:');

            if (!secret) {
                throw new Error('O ADMIN_SECRET é obrigatório.');
            }

            const response = await fetch(`/api/admin/intencoes/${id}/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${secret}`,
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Falha ao executar ação.');
            }

            // Se deu certo, atualiza o status na tela
            setIntentions((prevIntentions) =>
                prevIntentions.map((item) =>
                    item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item
                )
            );
            alert(`Intenção ${action === 'approve' ? 'aprovada' : 'recusada'}!`);

        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    }

    // Renderização da interface
    if (isLoading) {
        return <p>Carregando intenções...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>Erro: {error}</p>;
    }

    // Função para pegar a classe de status correta
    const getStatusClass = (status: string) => {
        if (status === 'approved') return styles.approved;
        if (status === 'rejected') return styles.rejected;
        return styles.pending;
    };

    return (
        <div>
            <h2>Lista de Intenções Submetidas</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {intentions.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>
                                Nenhuma intenção encontrada.
                            </td>
                        </tr>
                    ) : (
                        intentions.map((intention) => (
                            <tr key={intention.id}>
                                <td>{intention.nome}</td>
                                <td>{intention.email}</td>
                                <td>
                                    <span className={`${styles.statusSpan} ${getStatusClass(intention.status)}`}>
                                        {intention.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className={styles.actionsCell}>
                                    {intention.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction(intention.id, 'approve')}
                                                className={styles.buttonApprove}
                                            >
                                                Aprovar
                                            </button>
                                            <button
                                                onClick={() => handleAction(intention.id, 'reject')}
                                                className={styles.buttonReject}
                                            >
                                                Recusar
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}