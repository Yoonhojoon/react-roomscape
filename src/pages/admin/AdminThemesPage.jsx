import { useEffect, useState } from 'react';
import { fetchThemes, createTheme, deleteTheme } from '../../api/index.js';
import styles from './admin.module.css';

const EMPTY = { name: '', description: '', thumbnailUrl: '' };

export default function AdminThemesPage() {
  const [themes, setThemes] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => fetchThemes().then(setThemes).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.thumbnailUrl.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createTheme({
        name: form.name.trim(),
        description: form.description.trim(),
        thumbnailUrl: form.thumbnailUrl.trim(),
      });
      setForm(EMPTY);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('테마를 삭제하시겠습니까?')) return;
    setError(null);
    try {
      await deleteTheme(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>테마 관리</h1>
      <p className={styles.desc}>방탈출 테마를 등록하고 삭제합니다.</p>

      <form onSubmit={handleCreate} className={styles.createForm}>
        <div className={`field ${styles.grow}`}>
          <label>이름</label>
          <input value={form.name} onChange={handleChange('name')} placeholder="테마 이름" />
        </div>
        <div className={`field ${styles.grow}`}>
          <label>설명</label>
          <input value={form.description} onChange={handleChange('description')} placeholder="테마 설명" />
        </div>
        <div className={`field ${styles.grow}`}>
          <label>썸네일 URL</label>
          <input value={form.thumbnailUrl} onChange={handleChange('thumbnailUrl')} placeholder="https://..." />
        </div>
        <button
          type="submit"
          className="btn btn-magenta"
          disabled={submitting || !form.name.trim() || !form.description.trim() || !form.thumbnailUrl.trim()}
        >
          {submitting ? '추가 중...' : '추가'}
        </button>
      </form>

      {error && <p className="alert" style={{ marginBottom: 20 }}>{error}</p>}

      {themes.length === 0 ? (
        <p className="empty">등록된 테마가 없습니다.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thumbCell}>썸네일</th>
                <th>이름</th>
                <th>설명</th>
                <th style={{ textAlign: 'right' }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {themes.map((t) => (
                <tr key={t.id}>
                  <td className={styles.thumbCell}>
                    <img className={styles.thumb} src={t.thumbnailUrl} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
                  </td>
                  <td>{t.name}</td>
                  <td className={styles.muted}>{t.description}</td>
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
