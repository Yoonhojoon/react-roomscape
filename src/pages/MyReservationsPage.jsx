import { useState } from 'react';
import { fetchMyReservations, cancelReservation } from '../api/index.js';
import styles from './MyReservationsPage.module.css';

const STATUS = {
  CONFIRMED: { label: '예약 확정', className: 'confirmed' },
  PENDING: { label: '대기', className: 'pending' },
  COMPLETE: { label: '이용 완료', className: 'complete' },
  COMPLETED: { label: '이용 완료', className: 'complete' },
  CANCELLED: { label: '취소됨', className: 'cancelled' },
};

const CANCELLABLE = new Set(['CONFIRMED', 'PENDING']);

export default function MyReservationsPage({ onBack }) {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const load = async (searchName) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyReservations(searchName);
      setData(result);
    } catch (e) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    load(name.trim());
  };

  const handleCancel = async (id) => {
    if (!window.confirm('예약을 취소하시겠습니까?')) return;
    setCancelingId(id);
    setError(null);
    try {
      await cancelReservation(id);
      await load(name.trim());
    } catch (e) {
      setError(e.message);
    } finally {
      setCancelingId(null);
    }
  };

  const reservations = data?.reservationResponses ?? [];
  const waitings = data?.waitingReservationResponses ?? [];
  const isEmpty = data && reservations.length === 0 && waitings.length === 0;

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={onBack}>← 돌아가기</button>
      <h2>내 예약</h2>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예약자 이름을 입력하세요"
        />
        <button type="submit" className={styles.searchBtn} disabled={!name.trim() || loading}>
          {loading ? '조회 중...' : '조회'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {isEmpty && <p className={styles.message}>예약 내역이 없습니다.</p>}

      {reservations.length > 0 && (
        <section className={styles.section}>
          <h3>예약</h3>
          <div className={styles.list}>
            {reservations.map((r) => (
              <ReservationItem
                key={r.id}
                reservation={r}
                onCancel={handleCancel}
                canceling={cancelingId === r.id}
              />
            ))}
          </div>
        </section>
      )}

      {waitings.length > 0 && (
        <section className={styles.section}>
          <h3>예약 대기</h3>
          <div className={styles.list}>
            {waitings.map((r) => (
              <ReservationItem
                key={r.id}
                reservation={r}
                onCancel={handleCancel}
                canceling={cancelingId === r.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReservationItem({ reservation, onCancel, canceling }) {
  const status = STATUS[reservation.status] ?? { label: reservation.status, className: '' };
  const cancellable = CANCELLABLE.has(reservation.status);

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <div className={styles.themeRow}>
          <span className={styles.theme}>{reservation.theme.name}</span>
          <span className={`${styles.badge} ${styles[status.className] ?? ''}`}>
            {status.label}
            {reservation.waitingOrder != null && ` ${reservation.waitingOrder}번`}
          </span>
        </div>
        <p className={styles.meta}>
          {reservation.date} · {reservation.time.startAt.slice(0, 5)}
        </p>
      </div>
      {cancellable && (
        <button
          className={styles.cancelBtn}
          onClick={() => onCancel(reservation.id)}
          disabled={canceling}
        >
          {canceling ? '취소 중...' : '취소'}
        </button>
      )}
    </div>
  );
}
