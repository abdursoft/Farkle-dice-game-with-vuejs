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
