/** 게시판 유형 */
export type BoardType = 'COMMON' | 'TEAM' | 'QNA' | 'NOTICE' | 'NEWS';

/** 게시판 (백엔드 BoardResponse 매칭) */
export interface Board {
  id: number;
  name: string;
  type: BoardType;
  teamId: number | null;
  teamName: string | null;
}
