/** 종목-팀 선택 쌍 (회원가입, 프로필 보완 등에서 사용) */
export interface SportTeamPair {
  sportId: number;
  teamId: number;
}

/** 유저가 응원하는 팀 정보 (백엔드 UserTeamInfo 매칭) */
export interface UserTeam {
  teamId: number;
  teamName: string;
  sportId: number;
  sportName: string;
}
