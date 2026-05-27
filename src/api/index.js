const ERROR_MESSAGES = {
  400: '입력값을 확인해주세요.',
  403: '권한이 없습니다.',
  404: '대상을 찾을 수 없습니다.',
  409: '이미 예약 또는 대기 중인 슬롯입니다.',
  422: '처리할 수 없는 요청입니다.',
};

const parseError = async (res) => {
  try {
    const data = await res.clone().json();
    if (data?.message) return data.message;
  } catch {
    // 본문이 없거나 JSON이 아니면 상태 코드 기반 메시지로 대체
  }
  return ERROR_MESSAGES[res.status] || `요청에 실패했습니다. (${res.status})`;
};

const request = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await parseError(res));
  if (res.status === 204) return null;
  return res.json();
};

export const fetchThemes = () => request('/themes');

export const fetchPopularThemes = (topCount = 10, during = 10) =>
  request(`/themes?topCount=${topCount}&during=${during}`);

export const fetchAvailableTimes = (date, themeId) =>
  request(`/times?themeId=${themeId}&date=${date}`);

export const createReservation = (body) =>
  request('/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const fetchMyReservations = (name) =>
  request(`/reservations?name=${encodeURIComponent(name)}`);

export const cancelReservation = (reservationId) =>
  request(`/reservations/${reservationId}/cancel`, { method: 'PATCH' });
