const ADMIN_KEY = "forja_admin_token"
const SISTEMA_KEY = "forja_sistema_token"

const ADMIN_PASSWORD = "admin123"
const SISTEMA_PASSWORD = "demo2024"

export function loginAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, "1")
    return true
  }
  return false
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY)
}

export function checkAdminAuth(): boolean {
  return localStorage.getItem(ADMIN_KEY) === "1"
}

export function loginSistema(password: string): boolean {
  if (password === SISTEMA_PASSWORD) {
    localStorage.setItem(SISTEMA_KEY, "1")
    return true
  }
  return false
}

export function logoutSistema() {
  localStorage.removeItem(SISTEMA_KEY)
}

export function checkSistemaAuth(): boolean {
  return localStorage.getItem(SISTEMA_KEY) === "1"
}
