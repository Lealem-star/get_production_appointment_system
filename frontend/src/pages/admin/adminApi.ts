import type {
  Appointment,
  AppointmentStatus,
  ContactMessage,
  PostItem,
  Role,
  StaffMember,
  UserItem,
} from './types'

export type AdminSeedData = {
  role: Role
  appointments: Appointment[]
  users: UserItem[]
  posts: PostItem[]
  contactMessages: ContactMessage[]
  staffMembers: StaffMember[]
}

type LoginApiResponse = {
  token?: string
  role?: Role
}

type BootstrapApiResponse = AdminSeedData

const adminTokenStorageKey = 'studio_admin_token'

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim() ?? ''
}

function hasApiBaseUrl() {
  return getApiBaseUrl().length > 0
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(adminTokenStorageKey)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export async function loginAdmin(email: string, password: string): Promise<Role | null> {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedPassword = password.trim()

  if (!hasApiBaseUrl()) return null

  const payload = await requestJson<LoginApiResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
  })

  if (!payload.role) return null
  if (payload.token) localStorage.setItem(adminTokenStorageKey, payload.token)
  return payload.role
}

export async function fetchAdminSeedData(): Promise<AdminSeedData> {
  if (!hasApiBaseUrl()) {
    return {
      role: 'admin',
      appointments: [],
      users: [],
      posts: [],
      contactMessages: [],
      staffMembers: [],
    }
  }

  return requestJson<BootstrapApiResponse>('/admin/bootstrap', { method: 'GET' })
}

export async function updateAppointmentOnServer(
  id: string,
  patch: { status?: AppointmentStatus; staffName?: string },
): Promise<Appointment> {
  const payload = await requestJson<{ appointment: Appointment }>(`/admin/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
  return payload.appointment
}

export async function updateUserOnServer(
  id: string,
  patch: { role?: UserItem['role']; status?: UserItem['status'] },
): Promise<UserItem> {
  const payload = await requestJson<{ user: UserItem }>(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
  return payload.user
}

export async function createUserOnServer(input: {
  name: string
  email: string
  password: string
  role: 'staff' | 'customer'
}): Promise<UserItem> {
  const payload = await requestJson<{ user: UserItem }>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return payload.user
}

export async function createPostOnServer(input: {
  title: string
  category: string
  imageUrl: string
  published?: boolean
}): Promise<PostItem> {
  const payload = await requestJson<{ post: PostItem }>('/admin/posts', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return payload.post
}

export async function updatePostOnServer(
  id: string,
  patch: { title?: string; category?: string; imageUrl?: string; published?: boolean },
): Promise<PostItem> {
  const payload = await requestJson<{ post: PostItem }>(`/admin/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
  return payload.post
}

export function nextUserRole(role: UserItem['role']): UserItem['role'] {
  if (role === 'customer') return 'staff'
  if (role === 'staff') return 'admin'
  return 'customer'
}

export async function uploadPostImageOnServer(file: File): Promise<string> {
  const baseUrl = getApiBaseUrl()
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${baseUrl}/admin/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`)
  }

  const payload = (await response.json()) as { url: string }
  return payload.url
}
