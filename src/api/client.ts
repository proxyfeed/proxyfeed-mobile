import axios from 'axios'

const API_BASE = process.env.EXPO_PUBLIC_API
if (!API_BASE) {
  console.warn('[client] EXPO_PUBLIC_API is not set')
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
})

export async function loginRequest(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password })
  return res.data as { ok: boolean; redirect?: string; reason?: string }
}
