'use client'; // Componente interativo (Client Component)

import { useEffect, useState, FormEvent } from 'react';
import styles from '../convite.module.scss'; // Importa o SCSS da pasta pai

// O "tipo" de dado que esperamos da API de validação (GET)
type IntentionData = {
    nome: string;
    email: string;
};

// As props que este componente recebe (o token da URL)
type FormProps = {
    token: string;
};

export default function InviteRegistrationForm({ token }: FormProps) {
    // Estados de UI
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

    // 1. Efeito de Validação do Token (ao carregar)
    useEffect(() => {
        async function validateToken() {
            try {
                // Chama a API GET que você criou
                const response = await fetch(`/api/invites/${token}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Falha ao validar convite.');
                }

                // Se o token for válido, preenchemos o nome e email
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
    }, [token]); // Roda sempre que o 'token' mudar

    // 2. Função de Envio do Formulário
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Chama a API POST que você criou
            const response = await fetch('/api/invites/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token, // Envia o token junto
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
                // Ex: "Email já existe" ou "Senha muito curta"
                throw new Error(data.error || 'Falha ao completar cadastro.');
            }

            // Deu tudo certo!
            setSuccess('Cadastro realizado com sucesso! Você já pode fazer parte.');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    // ---- RENDERIZAÇÃO ----

    if (isLoading) {
        return <p className={styles.loading}>Validando convite...</p>;
    }

    // Se o token for inválido (expirado, usado, etc.), mostra o erro
    if (error && !success) {
        return <p className={styles.error}>{error}</p>;
    }

    // Se o cadastro foi um sucesso, não mostre mais o formulário
    if (success) {
        return <p className={styles.feedbackSuccess}>{success}</p>;
    }

    // Se o token for válido, mostra o formulário
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
                    readOnly // O email não pode ser mudado
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