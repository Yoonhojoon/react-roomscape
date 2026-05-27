import { useState } from 'react';
import { fetchMyReservations, cancelReservation } from '../api/index.js';
import styles from './MyReservationsPage.module.css';

const STATUS = {
  CONFIRMED: { label: '예약 확정', badge: 'badge-confirmed' },
  PENDING: { label: '대기', badge: 'badge-pending' },
  COMPLETE: { label: '이용 완료', badge: 'badge-complete' },
  COMPLETED: { label: '이용 완료', badge: 'badge-complete' },
  CANCELLED: { label: '취소됨', badge: 'badge-cancelled' },
};

const CANCELLABLE = new Set(['CONFIRMED', 'PENDING']);

export default function MyReservationsPage() {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const load = async (searchName) => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchMyReservations(searchName));
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
      <h1 className={`${styles.title} display`}>내 예약</h1>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예약자 이름을 입력하세요"
        />
        <button type="submit" className="btn btn-primary" disabled={!name.trim() || loading}>
          {loading ? '조회 중...' : '조회'}
        </button>
      </form>

      {error && <p className="alert" style={{ marginBottom: 20 }}>{error}</p>}
      {isEmpty && <p className="empty">예약 내역이 없습니다.</p>}

      {reservations.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>예약 <span className={styles.count}>{reservations.length}</span></h2>
          <div className={styles.list}>
            {reservations.map((r) => (
              <Item key={r.id} r={r} onCancel={handleCancel} canceling={cancelingId === r.id} />
            ))}
          </div>
        </section>
      )}

      {waitings.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>예약 대기 <span className={styles.count}>{waitings.length}</span></h2>
          <div className={styles.list}>
            {waitings.map((r) => (
              <Item key={r.id} r={r} onCancel={handleCancel} canceling={cancelingId === r.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Item({ r, onCancel, canceling }) {
  const status = STATUS[r.status] ?? { label: r.status, badge: '' };
  const cancellable = CANCELLABLE.has(r.status);

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <div className={styles.head}>
          <span className={styles.theme}>{r.theme.name}</span>
          <span className={`badge ${status.badge}`}>
            {status.label}
            {r.waitingOrder != null && ` ${r.waitingOrder}번`}
          </span>
        </div>
        <p className={styles.meta}>{r.date} · {r.time.startAt.slice(0, 5)}</p>
      </div>
      {cancellable && (
        <button className="btn btn-danger btn-sm" onClick={() => onCancel(r.id)} disabled={canceling}>
          {canceling ? '취소 중...' : '취소'}
        </button>
      )}
    </div>
  );
}
