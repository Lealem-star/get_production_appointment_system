import type { Appointment, AppointmentStatus, PostItem, Role, UserItem } from './types'

export type AdminSeedData = {
  role: Role
  appointments: Appointment[]
  users: UserItem[]
  posts: PostItem[]
}

type LoginApiResponse = {
  token?: string
  role?: Role
}

type BootstrapApiResponse = {
  role: Role
  appointments: Appointment[]
  users: UserItem[]
  posts: PostItem[]
}

const appointmentsSeed: Appointment[] = [
  { id: 'APT-1001', customerName: 'Joyce M.', service: 'Portrait Session', date: '2026-04-19', time: '10:00 AM', staffName: 'Abin', status: 'pending' },
  { id: 'APT-1002', customerName: 'Luis B.', service: 'Event Coverage', date: '2026-04-19', time: '02:00 PM', staffName: 'Maria', status: 'confirmed' },
  { id: 'APT-1003', customerName: 'Tina K.', service: 'Commercial Shoot', date: '2026-04-20', time: '11:30 AM', staffName: 'Abin', status: 'completed' },
  { id: 'APT-1004', customerName: 'Noah D.', service: 'Family Photoshoot', date: '2026-04-20', time: '04:30 PM', staffName: 'Erik', status: 'cancelled' },
]

const usersSeed: UserItem[] = [
  { id: 'USR-1', name: 'Leale Admin', email: 'admin@studio.local', role: 'admin', status: 'active' },
  { id: 'USR-2', name: 'Abin James', email: 'abin@studio.local', role: 'staff', status: 'active' },
  { id: 'USR-3', name: 'Maria Santos', email: 'maria@studio.local', role: 'staff', status: 'active' },
  { id: 'USR-4', name: 'Karen Doe', email: 'karen@email.com', role: 'customer', status: 'blocked' },
]

const postsSeed: PostItem[] = [
  { id: 'PST-1', title: 'Summer Portrait Promo', category: 'Offers', published: true },
  { id: 'PST-2', title: 'How To Prepare For A Studio Shoot', category: 'Blog', published: false },
  { id: 'PST-3', title: 'New Lighting Setup Available', category: 'Updates', published: true },
]

const adminTokenStorageKey = 'studio_admin_token'

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim() ?? ''
}

function hasApiBaseUrl() {
  return getApiBaseUrl().length > 0
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

function cloneData() {
  return {
    appointments: appointmentsSeed.map((item) => ({ ...item })),
    users: usersSeed.map((item) => ({ ...item })),
    posts: postsSeed.map((item) => ({ ...item })),
  }
}

export async function loginAdmin(email: string, password: string): Promise<Role | null> {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedPassword = password.trim()

  if (hasApiBaseUrl()) {
    const payload = await requestJson<LoginApiResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
    })

    if (!payload.role) return null
    if (payload.token) localStorage.setItem(adminTokenStorageKey, payload.token)
    return payload.role
  }

  if (normalizedEmail === 'admin@studio.local' && normalizedPassword === 'admin123') return 'admin'
  if (normalizedEmail === 'staff@studio.local' && normalizedPassword === 'staff123') return 'staff'
  return null
}

export async function fetchAdminSeedData(role: Role): Promise<AdminSeedData> {
  if (hasApiBaseUrl()) {
    const token = localStorage.getItem(adminTokenStorageKey)
    const payload = await requestJson<BootstrapApiResponse>('/admin/bootstrap', {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return payload
  }

  const data = cloneData()
  return { role, ...data }
}

export function updateAppointmentStatusInStore(items: Appointment[], id: string, status: AppointmentStatus): Appointment[] {
  return items.map((item) => (item.id === id ? { ...item, status } : item))
}

export function toggleUserStatusInStore(items: UserItem[], id: string): UserItem[] {
  return items.map((item) => {
    if (item.id !== id) return item
    return { ...item, status: item.status === 'active' ? 'blocked' : 'active' }
  })
}

export function cycleUserRoleInStore(items: UserItem[], id: string): UserItem[] {
  return items.map((item) => {
    if (item.id !== id) return item
    if (item.role === 'customer') return { ...item, role: 'staff' }
    if (item.role === 'staff') return { ...item, role: 'admin' }
    return { ...item, role: 'customer' }
  })
}

export function togglePostPublishedInStore(items: PostItem[], id: string): PostItem[] {
  return items.map((item) => (item.id === id ? { ...item, published: !item.published } : item))
}

