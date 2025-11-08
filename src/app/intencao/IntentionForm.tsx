'use client';

import { useState, FormEvent } from 'react';
import styles from './intencao.module.scss';

export default function IntentionForm() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/intencoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome,
                    email,
                    telefone,
                    mensagem,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocorreu um erro desconhecido.');
            }

            setSuccess('Intenção enviada com sucesso! Entraremos em contato em breve.');
            setNome('');
            setEmail('');
            setTelefone('');
            setMensagem('');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    // ✅ USA AS CLASSES DO SCSS
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="nome">Nome Completo *</label>
                <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="telefone">Telefone (Opcional)</label>
                <input
                    id="telefone"
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="mensagem">Por que você quer participar? (Opcional)</label>
                <textarea
                    id="mensagem"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows={4}
                />
            </div>

            <button type="submit" disabled={isLoading} className={styles.button}>
                {isLoading ? 'Enviando...' : 'Enviar Intenção'}
            </button>

            {success && <p className={styles.feedbackSuccess}>{success}</p>}
            {error && <p className={styles.feedbackError}>{error}</p>}
        </form>
    );
}