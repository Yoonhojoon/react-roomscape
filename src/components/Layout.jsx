import { Link, NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const navClass = ({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link);

export default function Layout() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link to="/" className={`${styles.logo} display`}>
          🔐 ROOM<span className={styles.logoAccent}>SCAPE</span>
        </Link>
        <nav className={styles.nav}>
          <NavLink to="/" end className={navClass}>홈</NavLink>
          <NavLink to="/my" className={navClass}>내 예약</NavLink>
          <NavLink to="/admin" className={styles.adminLink}>관리자</NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
