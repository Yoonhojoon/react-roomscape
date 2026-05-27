import { Link, NavLink, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.css';

const tabClass = ({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab);

export default function AdminLayout() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link to="/admin" className={`${styles.logo} display`}>
            ADMIN<span className={styles.logoAccent}>·CONSOLE</span>
          </Link>
          <Link to="/" className={styles.exit}>← 사이트로</Link>
        </div>
        <nav className={styles.tabs}>
          <NavLink to="/admin/themes" className={tabClass}>테마 관리</NavLink>
          <NavLink to="/admin/times" className={tabClass}>시간 관리</NavLink>
          <NavLink to="/admin/reservations" className={tabClass}>예약 관리</NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
