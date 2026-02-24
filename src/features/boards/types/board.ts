/** 게시판 */
export interface Board {
  id: number;
  name: string;
  description: string | null;
  postCount: number;
}
