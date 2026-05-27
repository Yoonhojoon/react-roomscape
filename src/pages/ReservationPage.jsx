import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchThemes, fetchAvailableTimes, createReservation } from '../api/index.js';
import styles from './ReservationPage.module.css';

const today = new Date().toISOString().split('T')[0];

export default function ReservationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetTheme = searchParams.get('themeId') ?? '';

  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(presetTheme);
  const [date, setDate] = useState(today);
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const selectedSlot = times.find((t) => String(t.id) === selectedTime);
  const isWaiting = selectedSlot ? !selectedSlot.isAvailable : false;
  const hasReservedSlot = times.some((t) => !t.isAvailable);

  useEffect(() => {
    fetchThemes().then(setThemes).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selectedTheme || !date) {
      setTimes([]);
      setSelectedTime('');
      return;
    }
    setLoadingTimes(true);
    setSelectedTime('');
    fetchAvailableTimes(date, selectedTheme)
      .then(setTimes)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingTimes(false));
  }, [selectedTheme, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTheme || !date || !selectedTime || !name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await createReservation({
        name: name.trim(),
        themeSlotId: Number(selectedTime),
      });
      navigate('/reservation/complete', { state: { reservation: result } });
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>← 돌아가기</button>
      <h1 className={`${styles.title} display`}>예약하기</h1>

      {error && <p className="alert" style={{ marginBottom: 20 }}>{error}</p>}

      <form onSubmit={handleSubmit} className={`${styles.form} panel`}>
        <div className="field">
          <label>테마</label>
          <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)} required>
            <option value="">테마를 선택하세요</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>날짜</label>
          <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} required />
        </div>

        {selectedTheme && date && (
          <div className="field">
            <label>시간</label>
            {loadingTimes ? (
              <p className={styles.hint}>불러오는 중...</p>
            ) : times.length === 0 ? (
              <p className={styles.hint}>예약 가능한 시간이 없습니다.</p>
            ) : (
              <>
                <div className={styles.timeGrid}>
                  {times.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`${styles.timeBtn} ${!t.isAvailable ? styles.waiting : ''} ${selectedTime === String(t.id) ? styles.selected : ''}`}
                      onClick={() => setSelectedTime(String(t.id))}
                    >
                      {t.startAt.slice(0, 5)}
                      {!t.isAvailable && <span className={styles.tag}>대기</span>}
                    </button>
                  ))}
                </div>
                {hasReservedSlot && (
                  <p className={styles.hint}>이미 예약된 시간(노란색)은 대기 신청이 가능합니다.</p>
                )}
              </>
            )}
          </div>
        )}

        {selectedTime && (
          <div className="field">
            <label>예약자 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className={`btn btn-block ${isWaiting ? 'btn-magenta' : 'btn-primary'}`}
          disabled={!selectedTheme || !date || !selectedTime || !name.trim() || submitting}
        >
          {submitting ? '처리 중...' : isWaiting ? '대기 신청' : '예약 확정'}
        </button>
      </form>
    </div>
  );
}
