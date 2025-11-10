'use client'; // Componente interativo (Client Component)

import { useEffect, useState, FormEvent } from 'react';
import styles from '../convite.module.scss';


type IntentionData = {
    nome: string;
    email: string;
};


type FormProps = {
    token: string;
};

export default function InviteRegistrationForm({ token }: FormProps) {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Estados dos campos do formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [cargo, setCargo] = useState('');


    useEffect(() => {
        async function validateToken() {
            try {

                const response = await fetch(`/api/invites/${token}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Falha ao validar convite.');
                }


                const intention: IntentionData = data;
                setNome(intention.nome);
                setEmail(intention.email);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        validateToken();
    }, [token]);

    // Funcao de Envio do Formulario
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {

            const response = await fetch('/api/invites/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    nome,
                    email,
                    senha,
                    telefone,
                    empresa,
                    cargo,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao completar cadastro.');
            }

            setSuccess('Cadastro realizado com sucesso! Você já pode fazer parte.');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <p className={styles.loading}>Validando convite...</p>;
    }

    if (error && !success) {
        return <p className={styles.error}>{error}</p>;
    }

    if (success) {
        return <p className={styles.feedbackSuccess}>{success}</p>;
    }

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
                    readOnly
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="senha">Crie uma Senha * (mín. 6 caracteres)</label>
                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    minLength={6}
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
                <label htmlFor="empresa">Empresa (Opcional)</label>
                <input
                    id="empresa"
                    type="text"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="cargo">Cargo (Opcional)</label>
                <input
                    id="cargo"
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                />
            </div>

            {error && <p className={styles.feedbackError}>{error}</p>}

            <button type="submit" disabled={isLoading} className={styles.button}>
                {isLoading ? 'Finalizando...' : 'Finalizar Cadastro'}
            </button>
        </form>
    );
}