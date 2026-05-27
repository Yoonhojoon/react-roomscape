import styles from './ThemeCard.module.css';

export default function ThemeCard({ theme, rank, onClick }) {
  const clickable = typeof onClick === 'function';

  return (
    <div
      className={`${styles.card} ${clickable ? styles.clickable : ''}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {rank && <span className={styles.rank}>#{rank}</span>}
      <div className={styles.thumb}>
        {theme.thumbnailUrl && (
          <img
            className={styles.img}
            src={theme.thumbnailUrl}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <span className={styles.icon}>🔓</span>
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{theme.name}</p>
        {theme.description && <p className={styles.desc}>{theme.description}</p>}
      </div>
    </div>
  );
}
