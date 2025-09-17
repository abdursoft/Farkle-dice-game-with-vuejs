import install from '@/install'

// import host
const { host } = install

// base route
export const ROOT_URL = `${host}api/v1/`

// auth routes
export const AUTH = {
  REGISTER: `${ROOT_URL}auth/register`,
  LOGIN: `${ROOT_URL}auth/login`,
  REFRESH_TOKEN: `${ROOT_URL}auth/refresh-token`,
  CHECK: `${ROOT_URL}auth/check`,
  DASHBOARD: `${ROOT_URL}auth/dashboard`
}


export const FRIENDS = {
  LIST: `${ROOT_URL}friends`,
  SEARCH: `${ROOT_URL}friends/search`,
  CHALLENGE: `${ROOT_URL}friends/challenge`,
  ACCEPT: `${ROOT_URL}friends/accept`,
  DECLINE: `${ROOT_URL}friends/decline`,
  REMOVE: `${ROOT_URL}friends/cancel`,
  DETAILS: (token) => `${ROOT_URL}friends/details/${token}`,
}

export const SCORE = {
  NEW: `${ROOT_URL}score`,
  HISTORY: (roundId) => `${ROOT_URL}score/${roundId}`,
  LEADERBOARD: `${ROOT_URL}score/leaderboard`,
  DELETE: (roundId) => `${ROOT_URL}score/delete/${roundId}`,
}

export const GAME = {
  NEW_GAME: `${ROOT_URL}game/round`,
  JOIN_GAME: `${ROOT_URL}game/join`,
  LIST_GAMES: `${ROOT_URL}game/list`,
  START_GAME: `${ROOT_URL}game/start`,
  PLAY_TURN: `${ROOT_URL}game/play-turn`,
  END_GAME: `${ROOT_URL}game/end`
}