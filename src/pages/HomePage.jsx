import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchThemes, fetchPopularThemes } from '../api/index.js';
import ThemeCard from '../components/ThemeCard.jsx';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchThemes(), fetchPopularThemes()])
      .then(([all, pop]) => {
        setThemes(all);
        setPopular(pop);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const reserveTheme = (themeId) => navigate(`/reservation?themeId=${themeId}`);

  return (
    <div>
      <section className={styles.hero}>
        <p className={styles.kicker}>REAL ESCAPE BOOKING</p>
        <h1 className={`${styles.title} display`}>
          방을 <span className="glow-cyan">탈출</span>하라
        </h1>
        <p className={styles.subtitle}>테마를 고르고 날짜·시간을 선택해 예약하세요. 만석이면 대기도 가능합니다.</p>
        <button className="btn btn-primary" onClick={() => navigate('/reservation')}>
          ▶ 예약 시작하기
        </button>
      </section>

      {loading && <p className="loading">불러오는 중...</p>}
      {error && <p className="alert">{error}</p>}

      {!loading && !error && (
        <>
          {popular.length > 0 && (
            <section className={styles.section}>
              <h2 className={`${styles.sectionTitle} display`}>
                🔥 인기 테마 <span className="glow-magenta">TOP {popular.length}</span>
              </h2>
              <div className={styles.grid}>
                {popular.map((t, i) => (
                  <ThemeCard key={t.id} theme={t} rank={i + 1} onClick={() => reserveTheme(t.id)} />
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h2 className={`${styles.sectionTitle} display`}>전체 테마</h2>
            {themes.length === 0 ? (
              <p className="empty">등록된 테마가 없습니다.</p>
            ) : (
              <div className={styles.grid}>
                {themes.map((t) => (
                  <ThemeCard key={t.id} theme={t} onClick={() => reserveTheme(t.id)} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
