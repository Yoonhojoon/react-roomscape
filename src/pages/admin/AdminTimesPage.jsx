import { useEffect, useState } from 'react';
import { fetchTimes, createTime, deleteTime } from '../../api/index.js';
import styles from './admin.module.css';

export default function AdminTimesPage() {
  const [times, setTimes] = useState([]);
  const [startAt, setStartAt] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => fetchTimes().then(setTimes).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!startAt) return;
    setSubmitting(true);
    setError(null);
    try {
      await createTime({ startAt });
      setStartAt('');
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('시간을 삭제하시겠습니까?')) return;
    setError(null);
    try {
      await deleteTime(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>시간 관리</h1>
      <p className={styles.desc}>예약 가능한 시작 시간을 등록하고 삭제합니다.</p>

      <form onSubmit={handleCreate} className={styles.createForm}>
        <div className={`field ${styles.grow}`}>
          <label>시작 시간</label>
          <input type="time" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-magenta" disabled={submitting || !startAt}>
          {submitting ? '추가 중...' : '추가'}
        </button>
      </form>

      {error && <p className="alert" style={{ marginBottom: 20 }}>{error}</p>}

      {times.length === 0 ? (
        <p className="empty">등록된 시간이 없습니다.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>시작 시간</th>
                <th style={{ textAlign: 'right' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {times.map((t) => (
                <tr key={t.id}>
                  <td className={styles.muted}>#{t.id}</td>
                  <td>{t.startAt.slice(0, 5)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
