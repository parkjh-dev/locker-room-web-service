/**
 * 날짜 포매팅 공용 유틸 — 게시글/댓글/알림 등 목록형 UI에서
 * "방금 / N분 전 / N시간 전 / MM-DD" 형태를 일관되게 표기한다.
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}
