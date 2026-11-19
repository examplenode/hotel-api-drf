import { reactive } from 'vue'

// Состояние авторизации, берём из localStorage, чтобы вход сохранялся после перезагрузки
export const auth = reactive({
  token: localStorage.getItem('access'),
  username: localStorage.getItem('username'),
})

// Всплывающее уведомление
export const toast = reactive({ text: '', error: false })
let timer
export function notify(text, error = false) {
  toast.text = text
  toast.error = error
  clearTimeout(timer)
  timer = setTimeout(() => (toast.text = ''), 3000)
}

// Общая функция для запросов к API
export async function api(url, method = 'GET', body = null, retry = true) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth.token) headers.Authorization = 'Bearer ' + auth.token

  const res = await fetch('/api/' + url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })

  // access-токен истёк: получаем новый по refresh-токену и повторяем запрос
  if (res.status === 401 && auth.token && retry) {
    if (await refreshToken()) return api(url, method, body, false)
    logout()
    location.href = '/login'
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) throw data || { detail: 'Ошибка сервера: ' + res.status }
  return data
}

// Загружает все страницы списка (API отдаёт по 10 записей)
export async function getAll(name) {
  let items = []
  for (let page = 1; ; page++) {
    const data = await api(`${name}/?page=${page}`)
    items = items.concat(data.results)
    if (!data.next) return items
  }
}

export async function login(username, password) {
  const data = await api('token/', 'POST', { username, password })
  localStorage.setItem('access', data.access)
  localStorage.setItem('refresh', data.refresh)
  localStorage.setItem('username', username)
  auth.token = data.access
  auth.username = username
}

async function refreshToken() {
  const res = await fetch('/api/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: localStorage.getItem('refresh') }),
  })
  if (!res.ok) return false
  auth.token = (await res.json()).access
  localStorage.setItem('access', auth.token)
  return true
}

export function logout() {
  localStorage.clear()
  auth.token = null
  auth.username = null
}

// Превращает ответ с ошибкой от DRF в текст
// Пример ответа: { "detail": "..." } или { "email": ["Это поле обязательно."] }
export function errorText(err) {
  if (err instanceof Error) return 'Не удалось связаться с сервером'
  return Object.entries(err)
    .map(([field, msg]) => (field === 'detail' ? msg : `${field}: ${[].concat(msg).join(' ')}`))
    .join('\n')
}
