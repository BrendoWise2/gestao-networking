import IntentionList from './IntentionList';
import styles from './admin.module.scss'; // Importa o SCSS

export default function AdminPage() {
    return (
        <main className={styles.adminPage}>
            <h1>Painel Administrativo</h1>
            <p>Gestão de Intenções de Novos Membros.</p>

            {/* IntentionList será renderizada aqui */}
            <IntentionList />
        </main>
    );
}