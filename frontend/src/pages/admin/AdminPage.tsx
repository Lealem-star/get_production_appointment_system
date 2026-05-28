import { useEffect, useMemo, useState } from 'react'
import {
  cycleUserRoleInStore,
  fetchAdminSeedData,
  loginAdmin,
  togglePostPublishedInStore,
  toggleUserStatusInStore,
  updateAppointmentStatusInStore,
} from './adminApi'
import AdminLanding from './AdminLanding'
import {
  AdminSidebar,
  AdminTopBar,
  AppointmentsSection,
  DashboardSection,
  PostsSection,
  UsersSection,
} from './AdminSections'
import type { AppointmentStatus, PostItem, Role, TabKey, UserItem, Appointment } from './types'

const adminTokenStorageKey = 'studio_admin_token'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [role, setRole] = useState<Role>('admin')
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [posts, setPosts] = useState<PostItem[]>([])
  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentStatus | 'all'>('all')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let isActive = true

    async function bootstrapFromToken() {
      const token = localStorage.getItem(adminTokenStorageKey)
      if (!token) {
        if (isActive) setBootstrapping(false)
        return
      }

      try {
        const seed = await fetchAdminSeedData('admin')
        if (!isActive) return
        setRole(seed.role)
        setAppointments(seed.appointments)
        setUsers(seed.users)
        setPosts(seed.posts)
        setIsLoggedIn(true)
        setAuthError('')
      } catch {
        localStorage.removeItem(adminTokenStorageKey)
      } finally {
        if (isActive) setBootstrapping(false)
      }
    }

    void bootstrapFromToken()
    return () => {
      isActive = false
    }
  }, [])

  const filteredAppointments = useMemo(() => {
    if (appointmentFilter === 'all') return appointments
    return appointments.filter((item) => item.status === appointmentFilter)
  }, [appointmentFilter, appointments])

  const totals = useMemo(() => {
    return {
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter((item) => item.status === 'pending').length,
      activeUsers: users.filter((item) => item.status === 'active').length,
      publishedPosts: posts.filter((item) => item.published).length,
    }
  }, [appointments, users, posts])

  async function onLogin() {
    try {
      const nextRole = await loginAdmin(credentials.email, credentials.password)
      if (!nextRole) {
        setAuthError('Invalid credentials.')
        return
      }

      const seed = await fetchAdminSeedData(nextRole)
      setRole(seed.role)
      setAppointments(seed.appointments)
      setUsers(seed.users)
      setPosts(seed.posts)
      setIsLoggedIn(true)
      setAuthError('')
      if (nextRole === 'staff') setActiveTab('appointments')
    } catch {
      setAuthError('Unable to reach the server. Check VITE_API_BASE_URL and backend status.')
    }
  }

  function handleLogout() {
    setIsLoggedIn(false)
    localStorage.removeItem(adminTokenStorageKey)
    setCredentials({ email: '', password: '' })
    setAuthError('')
    setActiveTab('dashboard')
  }

  function updateAppointmentStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) => updateAppointmentStatusInStore(prev, id, status))
  }

  function toggleUserStatus(id: string) {
    setUsers((prev) => toggleUserStatusInStore(prev, id))
  }

  function cycleUserRole(id: string) {
    setUsers((prev) => cycleUserRoleInStore(prev, id))
  }

  function togglePostPublished(id: string) {
    setPosts((prev) => togglePostPublishedInStore(prev, id))
  }

  const canManageUsersAndPosts = role === 'admin'

  if (bootstrapping) {
    return <div className="admin-shell flex min-h-dvh items-center justify-center text-header-ivory/70">Loading…</div>
  }

  if (!isLoggedIn) {
    return (
      <AdminLanding
        credentials={credentials}
        onCredentialsChange={setCredentials}
        authError={authError}
        onLogin={onLogin}
      />
    )
  }

  return (
    <div className="admin-shell min-h-dvh">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 p-4 sm:p-6 lg:flex-row">
        <AdminSidebar
          activeTab={activeTab}
          canManageUsersAndPosts={canManageUsersAndPosts}
          role={role}
          onTabSelect={setActiveTab}
          onLogout={handleLogout}
        />

        <div className="min-w-0 flex-1">
          <AdminTopBar activeTab={activeTab} role={role} />

          {activeTab === 'dashboard' ? <DashboardSection totals={totals} /> : null}
          {activeTab === 'appointments' ? (
            <AppointmentsSection
              appointmentFilter={appointmentFilter}
              onFilterChange={setAppointmentFilter}
              appointments={filteredAppointments}
              onStatusChange={updateAppointmentStatus}
            />
          ) : null}
          {activeTab === 'users' ? (
            <UsersSection users={users} onCycleRole={cycleUserRole} onToggleStatus={toggleUserStatus} />
          ) : null}
          {activeTab === 'posts' ? <PostsSection posts={posts} onTogglePublished={togglePostPublished} /> : null}
        </div>
      </div>
    </div>
  )
}
