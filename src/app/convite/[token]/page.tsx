import InviteRegistrationForm from './InviteRegistrationForm';
import styles from '../convite.module.scss';

type ConvitePageProps = {
    params: Promise<{
        token: string;
    }>;
};


export default async function ConvitePage({ params }: ConvitePageProps) {
    const { token } = await params;

    return (
        <main className={styles.page}>
            <h1>Finalize seu Cadastro</h1>
            <p>
                Parabéns! Sua intenção foi aprovada. Preencha os campos abaixo para
                se tornar um membro oficial.
            </p>

            <InviteRegistrationForm token={token} />
        </main>
    );
}