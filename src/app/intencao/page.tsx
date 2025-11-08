import IntentionForm from './IntentionForm';
import styles from './intencao.module.scss';

export default function IntencaoPage() {
    return (
        <main className={styles.page}>
            <h1>Formulário de Intenção</h1>
            <p>
                Interessado em fazer parte do nosso grupo de networking?
                <br />
                Preencha o formulário abaixo e nossa diretoria analisará sua intenção.
            </p>

            <hr />

            <IntentionForm />
        </main>
    );
}