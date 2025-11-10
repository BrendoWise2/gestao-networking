import styles from './dashboard.module.scss';

const getDashboardData = async () => {

    return {
        totalMembers: 1,
        totalReferrals: 0,
        totalThankYous: 0,
    };
};


export default async function DashboardStats() {

    const stats = await getDashboardData();

    return (
        <div className={styles.statsGrid}>

            <div className={styles.statCard}>
                <p className={styles.statValue}>{stats.totalMembers}</p>
                <p className={styles.statLabel}>Membros Ativos</p>
            </div>


            <div className={styles.statCard}>
                <p className={styles.statValue}>{stats.totalReferrals}</p>
                <p className={styles.statLabel}>Indicações no Mês</p>
            </div>

            <div className={styles.statCard}>
                <p className={styles.statValue}>{stats.totalThankYous}</p>
                <p className={styles.statLabel}>"Obrigados" no Mês</p>
            </div>
        </div>
    );
}