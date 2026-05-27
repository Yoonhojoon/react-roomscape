import { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import ReservationPage from './pages/ReservationPage.jsx';
import ConfirmPage from './pages/ConfirmPage.jsx';
import MyReservationsPage from './pages/MyReservationsPage.jsx';
import styles from './App.module.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [reservation, setReservation] = useState(null);

  const goToReservation = () => setPage('reservation');
  const goToMyReservations = () => setPage('myReservations');
  const goToConfirm = (data) => {
    setReservation(data);
    setPage('confirm');
  };
  const goHome = () => {
    setReservation(null);
    setPage('home');
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 onClick={goHome} className={styles.logo}>🔐 RoomScape</h1>
        <nav className={styles.nav}>
          <button className={styles.navLink} onClick={goToMyReservations}>
            내 예약
          </button>
        </nav>
      </header>
      <main className={styles.main}>
        {page === 'home' && <HomePage onReserve={goToReservation} />}
        {page === 'reservation' && (
          <ReservationPage onConfirm={goToConfirm} onBack={goHome} />
        )}
        {page === 'confirm' && (
          <ConfirmPage
            reservation={reservation}
            onHome={goHome}
            onMyReservations={goToMyReservations}
          />
        )}
        {page === 'myReservations' && <MyReservationsPage onBack={goHome} />}
      </main>
    </div>
  );
}
