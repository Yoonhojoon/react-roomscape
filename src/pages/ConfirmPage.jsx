import styles from './ConfirmPage.module.css';

export default function ConfirmPage({ reservation, onHome, onMyReservations }) {
  const isWaiting = reservation.status === 'PENDING';

  return (
    <div className={styles.page}>
      <div className={styles.icon}>{isWaiting ? '⏳' : '✅'}</div>
      <h2>{isWaiting ? '예약 대기 신청이 완료되었습니다!' : '예약이 완료되었습니다!'}</h2>

      {isWaiting && (
        <p className={styles.note}>앞선 예약이 취소되면 순번에 따라 자동으로 확정됩니다.</p>
      )}

      <div className={styles.card}>
        <Row label="예약 번호" value={`#${reservation.id}`} />
        <Row label="상태" value={isWaiting ? '대기' : '예약 확정'} />
        <Row label="테마" value={reservation.theme.name} />
        <Row label="날짜" value={reservation.date} />
        <Row label="시간" value={reservation.time.startAt.slice(0, 5)} />
        <Row label="예약자" value={reservation.name} />
      </div>

      <div className={styles.actions}>
        <button className={styles.secondaryBtn} onClick={onMyReservations}>
          내 예약 확인
        </button>
        <button className={styles.homeBtn} onClick={onHome}>
          홈으로 돌아가기
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
