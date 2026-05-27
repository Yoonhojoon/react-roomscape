import { useEffect, useState } from 'react';
import {
  fetchAllReservations,
  fetchThemes,
  fetchAvailableTimes,
  updateReservation,
  cancelReservation,
  deleteReservation,
} from '../../api/index.js';
import styles from './admin.module.css';

const STATUS = {
  CONFIRMED: { label: '예약 확정', badge: 'badge-confirmed' },
  PENDING: { label: '대기', badge: 'badge-pending' },
  COMPLETE: { label: '이용 완료', badge: 'badge-complete' },
  COMPLETED: { label: '이용 완료', badge: 'badge-complete' },
  CANCELLED: { label: '취소됨', badge: 'badge-cancelled' },
};

const CANCELLABLE = new Set(['CONFIRMED', 'PENDING']);
const today = new Date().toISOString().split('T')[0];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = () => fetchAllReservations().then(setReservations).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const run = async (fn, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setError(null);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>예약 관리</h1>
      <p className={styles.desc}>전체 예약을 조회하고 수정·취소·삭제합니다.</p>

      {error && <p className="alert" style={{ marginBottom: 20 }}>{error}</p>}

      {reservations.length === 0 ? (
        <p className="empty">예약이 없습니다.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>예약자</th>
                <th>테마</th>
                <th>일시</th>
                <th>상태</th>
                <th style={{ textAlign: 'right' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => {
                const status = STATUS[r.status] ?? { label: r.status, badge: '' };
                return (
                  <tr key={r.id}>
                    <td className={styles.muted}>#{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.theme.name}</td>
                    <td className={styles.muted}>{r.date} {r.time.startAt.slice(0, 5)}</td>
                    <td><span className={`badge ${status.badge}`}>{status.label}</span></td>
                    <td>
                      <div className={styles.actions}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditing(r)}>수정</button>
                        {CANCELLABLE.has(r.status) && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => run(() => cancelReservation(r.id), '예약을 취소하시겠습니까?')}
                          >
                            취소
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => run(() => deleteReservation(r.id), '예약을 완전히 삭제하시겠습니까?')}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditModal
          reservation={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load();
          }}
        />
      )}
    </div>
  );
}

function EditModal({ reservation, onClose, onSaved }) {
  const [themes, setThemes] = useState([]);
  const [themeId, setThemeId] = useState(String(reservation.theme.id));
  const [date, setDate] = useState(reservation.date);
  const [times, setTimes] = useState([]);
  const [slotId, setSlotId] = useState('');
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchThemes().then(setThemes).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!themeId || !date) return;
    setLoadingTimes(true);
    setSlotId('');
    fetchAvailableTimes(date, themeId)
      .then(setTimes)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingTimes(false));
  }, [themeId, date]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!slotId) return;
    setSaving(true);
    setError(null);
    try {
      await updateReservation(reservation.id, { themeSlotId: Number(slotId) });
      await onSaved();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>예약 #{reservation.id} 수정</h2>
        {error && <p className="alert" style={{ marginBottom: 16 }}>{error}</p>}
        <form onSubmit={handleSave} className={styles.modalForm}>
          <div className="field">
            <label>테마</label>
            <select value={themeId} onChange={(e) => setThemeId(e.target.value)}>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>날짜</label>
            <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field">
            <label>시간 슬롯</label>
            {loadingTimes ? (
              <p className={styles.muted}>불러오는 중...</p>
            ) : times.length === 0 ? (
              <p className={styles.muted}>가능한 시간이 없습니다.</p>
            ) : (
              <div className={styles.timeGrid}>
                {times.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!t.isAvailable}
                    className={`${styles.timeChip} ${slotId === String(t.id) ? styles.selected : ''}`}
                    onClick={() => setSlotId(String(t.id))}
                  >
                    {t.startAt.slice(0, 5)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={styles.modalActions}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
            <button type="submit" className="btn btn-primary" disabled={!slotId || saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
