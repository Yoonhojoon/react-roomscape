import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styles from './ConfirmPage.module.css';

export default function ConfirmPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const reservation = state?.reservation;

  if (!reservation) return <Navigate to="/" replace />;

  const isWaiting = reservation.status === 'PENDING';

  return (
    <div className={styles.page}>
      <div className={`${styles.icon} ${isWaiting ? styles.waitingGlow : styles.confirmGlow}`}>
        {isWaiting ? '⏳' : '✅'}
      </div>
      <h1 className={`${styles.title} display`}>
        {isWaiting ? '대기 신청 완료' : '예약 완료'}
      </h1>
      <p className={styles.note}>
        {isWaiting
          ? '앞선 예약이 취소되면 순번에 따라 자동으로 확정됩니다.'
          : '예약이 정상적으로 등록되었습니다.'}
      </p>

      <div className={`${styles.card} panel`}>
        <Row label="예약 번호" value={`#${reservation.id}`} />
        <Row
          label="상태"
          value={
            <span className={`badge ${isWaiting ? 'badge-pending' : 'badge-confirmed'}`}>
              {isWaiting ? '대기' : '예약 확정'}
            </span>
          }
        />
        <Row label="테마" value={reservation.theme.name} />
        <Row label="날짜" value={reservation.date} />
        <Row label="시간" value={reservation.time.startAt.slice(0, 5)} />
        <Row label="예약자" value={reservation.name} />
      </div>

      <div className={styles.actions}>
        <button className="btn btn-secondary" onClick={() => navigate('/my')}>
          내 예약 확인
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          홈으로
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
