import { useEffect, useMemo, useState } from 'react'
import {
  createPostOnServer,
  createUserOnServer,
  fetchAdminSeedData,
  loginAdmin,
  nextUserRole,
  updateAppointmentOnServer,
  updatePostOnServer,
  updateUserOnServer,
  uploadPostImageOnServer,
} from './adminApi'
import AdminLanding from './AdminLanding'
import {
  AdminSidebar,
  AdminTopBar,
  AppointmentsSection,
  ContactMessagesSection,
  DashboardSection,
  PostsSection,
  UsersSection,
} from './AdminSections'
import type {
  Appointment,
  AppointmentStatus,
  ContactMessage,
  PostItem,
  Role,
  StaffMember,
  TabKey,
  UserItem,
} from './types'

const adminTokenStorageKey = 'studio_admin_token'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [role, setRole] = useState<Role>('admin')
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [posts, setPosts] = useState<PostItem[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentStatus | 'all'>('all')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [actionError, setActionError] = useState('')

  function applySeed(seed: {
    role: Role
    appointments: Appointment[]
    users: UserItem[]
    posts: PostItem[]
    contactMessages: ContactMessage[]
    staffMembers: StaffMember[]
  }) {
    setRole(seed.role)
    setAppointments(seed.appointments)
    setUsers(seed.users)
    setPosts(seed.posts)
    setContactMessages(seed.contactMessages)
    setStaffMembers(seed.staffMembers)
  }

  useEffect(() => {
    let isActive = true

    async function bootstrapFromToken() {
      const token = localStorage.getItem(adminTokenStorageKey)
      if (!token) {
        if (isActive) setBootstrapping(false)
        return
      }

      try {
        const seed = await fetchAdminSeedData()
        if (!isActive) return
        applySeed(seed)
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
      contactMessages: contactMessages.length,
    }
  }, [appointments, users, posts, contactMessages])

  async function onLogin() {
    try {
      const nextRole = await loginAdmin(credentials.email, credentials.password)
      if (!nextRole) {
        setAuthError('Invalid credentials.')
        return
      }

      const seed = await fetchAdminSeedData()
      applySeed(seed)
      setIsLoggedIn(true)
      setAuthError('')
      setActionError('')
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
    setActionError('')
    setActiveTab('dashboard')
  }

  async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
    try {
      setActionError('')
      const updated = await updateAppointmentOnServer(id, { status })
      setAppointments((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch {
      setActionError('Failed to update appointment status.')
    }
  }

  async function assignStaffToAppointment(id: string, staffName: string): Promise<Appointment> {
    try {
      setActionError('')
      const updated = await updateAppointmentOnServer(id, { staffName })
      setAppointments((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    } catch {
      setActionError('Failed to assign staff.')
      throw new Error('Failed to assign staff')
    }
  }

  async function toggleUserStatus(id: string) {
    const user = users.find((item) => item.id === id)
    if (!user) return

    try {
      setActionError('')
      const nextStatus = user.status === 'active' ? 'blocked' : 'active'
      const updated = await updateUserOnServer(id, { status: nextStatus })
      setUsers((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch {
      setActionError('Failed to update user status.')
    }
  }

  async function cycleUserRole(id: string) {
    const user = users.find((item) => item.id === id)
    if (!user) return

    try {
      setActionError('')
      const updated = await updateUserOnServer(id, { role: nextUserRole(user.role) })
      setUsers((prev) => prev.map((item) => (item.id === id ? updated : item)))
      const seed = await fetchAdminSeedData()
      setStaffMembers(seed.staffMembers)
    } catch {
      setActionError('Failed to update user role.')
    }
  }

  async function createUser(input: {
    name: string
    email: string
    password: string
    role: 'staff' | 'customer'
  }) {
    try {
      setActionError('')
      const created = await createUserOnServer(input)
      setUsers((prev) => [created, ...prev])
      const seed = await fetchAdminSeedData()
      setStaffMembers(seed.staffMembers)
    } catch {
      setActionError('Failed to create user.')
      throw new Error('Failed to create user.')
    }
  }

  async function togglePostPublished(id: string) {
    const post = posts.find((item) => item.id === id)
    if (!post) return

    try {
      setActionError('')
      const updated = await updatePostOnServer(id, { published: !post.published })
      setPosts((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch {
      setActionError('Failed to update post.')
    }
  }

  async function createPost(input: {
    title: string
    category: string
    imageUrl: string
    published?: boolean
  }) {
    try {
      setActionError('')
      const created = await createPostOnServer(input)
      setPosts((prev) => [created, ...prev])
    } catch {
      setActionError('Failed to create post.')
      throw new Error('Failed to create post.')
    }
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

          {actionError ? (
            <p className="mb-4 rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {actionError}
            </p>
          ) : null}

          {activeTab === 'dashboard' ? (
            <DashboardSection totals={totals} showFullDashboard={canManageUsersAndPosts} />
          ) : null}
          {activeTab === 'appointments' ? (
            <AppointmentsSection
              appointmentFilter={appointmentFilter}
              onFilterChange={setAppointmentFilter}
              appointments={filteredAppointments}
              staffMembers={staffMembers}
              onStatusChange={updateAppointmentStatus}
              onAssignStaff={assignStaffToAppointment}
            />
          ) : null}
          {activeTab === 'contacts' ? <ContactMessagesSection messages={contactMessages} /> : null}
          {activeTab === 'users' ? (
            <UsersSection
              users={users}
              onCycleRole={cycleUserRole}
              onToggleStatus={toggleUserStatus}
              onCreateUser={createUser}
            />
          ) : null}
          {activeTab === 'posts' ? (
            <PostsSection
              posts={posts}
              onTogglePublished={togglePostPublished}
              onCreatePost={createPost}
              onUploadImage={uploadPostImageOnServer}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
