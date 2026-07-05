import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { resolveMediaUrl } from '../../lib/mediaUrl'
import { statusBadgeClasses } from './adminBadge'
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

const TAB_LABELS: Record<TabKey, string> = {
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  contacts: 'Contact messages',
  users: 'Users',
  posts: 'Posts',
}

type AdminSidebarProps = {
  activeTab: TabKey
  canManageUsersAndPosts: boolean
  role: Role
  onTabSelect: (tab: TabKey) => void
  onLogout: () => void
}

export function AdminSidebar(props: AdminSidebarProps) {
  const { activeTab, canManageUsersAndPosts, role, onTabSelect, onLogout } = props
  const tabs: TabKey[] = ['dashboard', 'appointments', 'contacts', 'users', 'posts']

  return (
    <aside className="admin-card flex w-full flex-col border-white/10 p-4 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:w-60 lg:shrink-0">
      <div className="border-b border-white/8 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-header-gold/80">Get production</p>
        <p className="mt-1 font-serif text-lg font-semibold text-header-ivory">Control panel</p>
        <p className="mt-0.5 text-xs capitalize text-header-ivory/45">{role} access</p>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1" aria-label="Admin navigation">
        {tabs.map((tab) => {
          const isDisabled = !canManageUsersAndPosts && (tab === 'contacts' || tab === 'users' || tab === 'posts')
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              disabled={isDisabled}
              onClick={() => onTabSelect(tab)}
              className={`admin-sidebar-link ${isActive ? 'admin-sidebar-link--active' : ''} ${
                isDisabled ? 'cursor-not-allowed opacity-40' : ''
              }`}
            >
              <TabIcon tab={tab} />
              {TAB_LABELS[tab]}
            </button>
          )
        })}
      </nav>

      <div className="mt-4 space-y-2 border-t border-white/8 pt-4">
        <Link to="/" className="admin-sidebar-link text-header-ivory/55 hover:text-header-ivory">
          <span aria-hidden>↗</span>
          View website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="admin-sidebar-link w-full text-rose-300/80 hover:bg-rose-400/10 hover:text-rose-200"
        >
          <span aria-hidden>⎋</span>
          Log out
        </button>
      </div>
    </aside>
  )
}

function TabIcon({ tab }: { tab: TabKey }) {
  const className = 'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs'
  const icons: Record<TabKey, string> = {
    dashboard: '▦',
    appointments: '◷',
    contacts: '✉',
    users: '◎',
    posts: '✎',
  }
  return (
    <span className={className} aria-hidden>
      {icons[tab]}
    </span>
  )
}

type AdminTopBarProps = {
  activeTab: TabKey
  role: Role
}

export function AdminTopBar(props: AdminTopBarProps) {
  const { activeTab, role } = props
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-white/8 pb-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-header-gold/70">Overview</p>
        <h1 className="font-serif text-2xl font-semibold text-header-ivory sm:text-3xl">{TAB_LABELS[activeTab]}</h1>
      </div>
      <span className="rounded-full border border-header-gold/30 bg-header-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-header-gold">
        {role}
      </span>
    </header>
  )
}

type DashboardSectionProps = {
  totals: {
    totalAppointments: number
    pendingAppointments: number
    activeUsers: number
    publishedPosts: number
    contactMessages: number
  }
  showFullDashboard: boolean
}

const statMeta = [
  { key: 'totalAppointments' as const, label: 'Total appointments', hint: 'All booking requests' },
  { key: 'pendingAppointments' as const, label: 'Pending review', hint: 'Awaiting approval' },
  { key: 'contactMessages' as const, label: 'Contact messages', hint: 'Inquiries from the site' },
  { key: 'activeUsers' as const, label: 'Active users', hint: 'Staff & customers' },
  { key: 'publishedPosts' as const, label: 'Published posts', hint: 'Live content items' },
]

export function DashboardSection(props: DashboardSectionProps) {
  const { totals, showFullDashboard } = props
  const visibleStats = showFullDashboard
    ? statMeta
    : statMeta.filter((item) => item.key === 'totalAppointments' || item.key === 'pendingAppointments')

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {visibleStats.map((item) => (
        <article key={item.key} className="admin-stat-card p-5">
          <p className="text-xs font-medium text-header-ivory/50">{item.label}</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-header-ivory">{totals[item.key]}</p>
          <p className="mt-1 text-[11px] text-header-ivory/40">{item.hint}</p>
        </article>
      ))}
    </section>
  )
}

type AppointmentsSectionProps = {
  appointmentFilter: AppointmentStatus | 'all'
  onFilterChange: (value: AppointmentStatus | 'all') => void
  appointments: Appointment[]
  staffMembers: StaffMember[]
  onStatusChange: (id: string, status: AppointmentStatus) => Promise<void>
  onAssignStaff: (id: string, staffName: string) => Promise<Appointment>
}

export function AppointmentsSection(props: AppointmentsSectionProps) {
  const { appointmentFilter, onFilterChange, appointments, staffMembers, onStatusChange, onAssignStaff } = props
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [assignStaffName, setAssignStaffName] = useState('Unassigned')
  const [savingStaff, setSavingStaff] = useState(false)

  useEffect(() => {
    if (selectedAppointment) setAssignStaffName(selectedAppointment.staffName || 'Unassigned')
  }, [selectedAppointment])

  return (
    <>
      <section className="admin-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 sm:px-5">
          <p className="text-sm font-semibold text-header-ivory/80">
            {appointments.length} {appointments.length === 1 ? 'booking' : 'bookings'}
          </p>
          <select
            value={appointmentFilter}
            onChange={(event) => onFilterChange(event.target.value as AppointmentStatus | 'all')}
            className="admin-input w-auto min-w-[140px] py-2 text-sm"
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="divide-y divide-white/6">
          {appointments.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-header-ivory/45">No appointments match this filter.</p>
          ) : (
            appointments.map((item) => (
              <article key={item.id} className="px-4 py-4 sm:px-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-header-ivory">
                      {item.customerName}
                      <span className="font-normal text-header-ivory/45"> · </span>
                      {item.service}
                    </p>
                    <p className="mt-1 text-sm text-header-ivory/50">
                      {item.date} at {item.time} · {item.staffName}
                    </p>
                    {item.customerPhone || item.location ? (
                      <p className="mt-1 text-xs text-header-ivory/40">
                        {item.customerPhone ?? ''}
                        {item.customerPhone && item.location ? ' · ' : ''}
                        {item.location ?? ''}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${statusBadgeClasses(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionButton label="View details" onClick={() => setSelectedAppointment(item)} />
                  <ActionButton label="Approve" onClick={() => void onStatusChange(item.id, 'confirmed')} />
                  <ActionButton label="Complete" onClick={() => void onStatusChange(item.id, 'completed')} />
                  <ActionButton label="Cancel" variant="danger" onClick={() => void onStatusChange(item.id, 'cancelled')} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {selectedAppointment ? (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/70 p-3 sm:p-4" role="presentation">
          <button
            type="button"
            aria-label="Close appointment details"
            className="absolute inset-0"
            onClick={() => setSelectedAppointment(null)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Appointment details"
            className="admin-card relative z-10 flex max-h-[min(90dvh,720px)] w-full max-w-[500px] flex-col overflow-hidden border-white/12"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/8 px-4 py-3 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-header-gold/85">Appointment details</p>
                <h3 className="mt-1 truncate font-serif text-xl text-header-ivory">{selectedAppointment.customerName}</h3>
                <p className="mt-0.5 text-xs text-header-ivory/50">{selectedAppointment.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="shrink-0 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-header-ivory/80 transition hover:bg-white/10 hover:text-header-ivory"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-4 sm:px-5">
              <dl className="grid gap-2.5 sm:grid-cols-2">
                <DetailRow label="Service" value={selectedAppointment.service} />
                <DetailRow label="Status" value={selectedAppointment.status} />
                <DetailRow label="Date" value={selectedAppointment.date} />
                <DetailRow label="Time" value={selectedAppointment.time} />
                <DetailRow label="Client type" value={selectedAppointment.clientType ?? 'Not provided'} />
                <DetailRow label="Location" value={selectedAppointment.location ?? 'Not provided'} />
                <DetailRow label="Phone" value={selectedAppointment.customerPhone ?? 'Not provided'} />
                <DetailRow label="Customer address" value={selectedAppointment.customerAddress ?? 'Not provided'} />
              </dl>

              <div className="mt-3 rounded-xl border border-white/8 bg-black/25 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-header-gold/80">Notes</p>
                <p className="mt-1 text-sm leading-relaxed text-header-ivory/65">
                  {selectedAppointment.notes ? selectedAppointment.notes : 'No notes provided.'}
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-white/8 bg-black/25 p-3">
                <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-header-gold/80">
                  Assign staff
                  <select
                    value={assignStaffName}
                    onChange={(event) => setAssignStaffName(event.target.value)}
                    className="admin-input mt-2 w-full py-2 text-sm"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {staffMembers.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={savingStaff}
                  onClick={() => {
                    setSavingStaff(true)
                    void onAssignStaff(selectedAppointment.id, assignStaffName)
                      .then((updated) => setSelectedAppointment(updated))
                      .finally(() => setSavingStaff(false))
                  }}
                  className="mt-3 rounded-lg border border-header-gold/30 bg-header-gold/10 px-3 py-2 text-xs font-semibold text-header-gold transition hover:bg-header-gold/20"
                >
                  {savingStaff ? 'Saving…' : 'Save assignment'}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

export function ContactMessagesSection({ messages }: { messages: ContactMessage[] }) {
  return (
    <section className="admin-card divide-y divide-white/6">
      {messages.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-header-ivory/45">No contact messages yet.</p>
      ) : (
        messages.map((item) => (
          <article key={item.id} className="px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-header-ivory">{item.name}</p>
                <p className="mt-1 text-sm text-header-ivory/50">{item.phone}</p>
              </div>
              {item.createdAt ? (
                <p className="text-xs text-header-ivory/40">{new Date(item.createdAt).toLocaleString()}</p>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-header-ivory/65">{item.details}</p>
          </article>
        ))
      )}
    </section>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/2 px-2.5 py-2">
      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-header-ivory/45">{label}</dt>
      <dd className="mt-0.5 text-sm text-header-ivory/80">{value}</dd>
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  variant = 'default',
}: {
  label: string
  onClick: () => void
  variant?: 'default' | 'danger'
}) {
  const styles =
    variant === 'danger'
      ? 'border-rose-400/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/15'
      : 'border-white/12 bg-white/5 text-header-ivory/80 hover:bg-white/10 hover:text-header-ivory'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${styles}`}
    >
      {label}
    </button>
  )
}

function CreateButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-header-gold/30 bg-header-gold/10 px-4 py-2 text-sm font-semibold text-header-gold transition hover:bg-header-gold/20"
    >
      {label}
    </button>
  )
}

function AdminModal({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/70 p-4" role="presentation">
      <button type="button" aria-label="Close dialog" className="absolute inset-0" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="admin-card relative z-10 max-h-[90dvh] w-full max-w-[560px] overflow-y-auto border-white/12 p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/8 pb-4">
          <div>
            <h3 className="font-serif text-xl text-header-ivory">{title}</h3>
            {description ? <p className="mt-1 text-sm text-header-ivory/50">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-header-ivory/80 transition hover:bg-white/10 hover:text-header-ivory"
          >
            Close
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  )
}

type UsersSectionProps = {
  users: UserItem[]
  onCycleRole: (id: string) => Promise<void>
  onToggleStatus: (id: string) => Promise<void>
  onCreateUser: (input: {
    name: string
    email: string
    password: string
    role: 'staff' | 'customer'
  }) => Promise<void>
}

export function UsersSection(props: UsersSectionProps) {
  const { users, onCycleRole, onToggleStatus, onCreateUser } = props
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'staff' | 'customer'>('staff')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  function resetForm() {
    setName('')
    setEmail('')
    setPassword('')
    setRole('staff')
    setFormError('')
  }

  function closeModal() {
    setCreateOpen(false)
    resetForm()
  }

  return (
    <>
      <section className="admin-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 sm:px-5">
          <p className="text-sm font-semibold text-header-ivory/80">
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </p>
          <CreateButton label="+ Create user" onClick={() => setCreateOpen(true)} />
        </div>
        <div className="divide-y divide-white/6">
          {users.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-header-ivory/45">No users found.</p>
          ) : (
            users.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
                <div>
                  <p className="font-semibold text-header-ivory">{item.name}</p>
                  <p className="text-sm text-header-ivory/50">{item.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold capitalize text-header-ivory/70">
                    {item.role} · {item.status}
                  </span>
                  <ActionButton label="Change role" onClick={() => void onCycleRole(item.id)} />
                  <ActionButton
                    label={item.status === 'active' ? 'Block' : 'Activate'}
                    onClick={() => void onToggleStatus(item.id)}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <AdminModal open={createOpen} title="Create user" description="Add a staff or customer account." onClose={closeModal}>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            setFormError('')
            setCreating(true)
            void onCreateUser({ name, email, password, role })
              .then(() => closeModal())
              .catch(() => setFormError('Failed to create user.'))
              .finally(() => setCreating(false))
          }}
        >
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full name"
            className="admin-input py-2 text-sm"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="admin-input py-2 text-sm"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="admin-input py-2 text-sm"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as 'staff' | 'customer')}
            className="admin-input py-2 text-sm"
          >
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>
          {formError ? <p className="text-sm text-rose-200 sm:col-span-2">{formError}</p> : null}
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg border border-header-gold/30 bg-header-gold/10 px-4 py-2 text-sm font-semibold text-header-gold transition hover:bg-header-gold/20 sm:col-span-2"
          >
            {creating ? 'Creating…' : 'Create user'}
          </button>
        </form>
      </AdminModal>
    </>
  )
}

type PostsSectionProps = {
  posts: PostItem[]
  onTogglePublished: (id: string) => Promise<void>
  onUploadImage: (file: File) => Promise<string>
  onCreatePost: (input: {
    title: string
    category: string
    imageUrl: string
    published?: boolean
  }) => Promise<void>
}

export function PostsSection(props: PostsSectionProps) {
  const { posts, onTogglePublished, onUploadImage, onCreatePost } = props
  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [published, setPublished] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('')
      return
    }

    const previewUrl = URL.createObjectURL(imageFile)
    setImagePreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [imageFile])

  function resetForm() {
    setTitle('')
    setCategory('')
    setImageUrl('')
    setImageFile(null)
    setPublished(false)
    setFormError('')
  }

  function closeModal() {
    setCreateOpen(false)
    resetForm()
  }

  return (
    <>
      <section className="admin-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3 sm:px-5">
          <p className="text-sm font-semibold text-header-ivory/80">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
          <CreateButton label="+ Create post" onClick={() => setCreateOpen(true)} />
        </div>
        <div className="divide-y divide-white/6">
          {posts.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-header-ivory/45">No posts yet.</p>
          ) : (
            posts.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  {item.imageUrl ? (
                    <img
                      src={resolveMediaUrl(item.imageUrl)}
                      alt={item.title}
                      className="h-14 w-14 shrink-0 rounded-lg border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-header-ivory/40">
                      No image
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-header-ivory">{item.title}</p>
                    <p className="text-sm text-header-ivory/50">{item.category}</p>
                    {item.imageUrl ? (
                      <p className="mt-1 truncate text-xs text-header-ivory/35">{item.imageUrl}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.published
                        ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/25'
                        : 'bg-white/5 text-header-ivory/50 ring-1 ring-white/10'
                    }`}
                  >
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                  <ActionButton
                    label={item.published ? 'Unpublish' : 'Publish'}
                    onClick={() => void onTogglePublished(item.id)}
                  />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <AdminModal
        open={createOpen}
        title="Create portfolio post"
        description="Upload an image to the server or paste an external image URL. Published posts appear on the homepage portfolio."
        onClose={closeModal}
      >
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            setFormError('')
            setCreating(true)

            void (async () => {
              try {
                let finalImageUrl = imageUrl.trim()
                if (imageFile) {
                  finalImageUrl = await onUploadImage(imageFile)
                }

                if (!finalImageUrl) {
                  setFormError('Choose an image file or paste an image URL.')
                  return
                }

                await onCreatePost({ title, category, imageUrl: finalImageUrl, published })
                closeModal()
              } catch {
                setFormError('Failed to upload image or create post.')
              } finally {
                setCreating(false)
              }
            })()
          }}
        >
          <input
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Post title"
            className="admin-input py-2 text-sm"
          />
          <input
            type="text"
            required
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Category"
            className="admin-input py-2 text-sm"
          />
          <label className="block text-sm text-header-ivory/70 sm:col-span-2">
            Upload image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                setImageFile(file)
                if (file) setImageUrl('')
              }}
              className="admin-input mt-2 block w-full py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-header-gold/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-header-gold"
            />
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(event) => {
              setImageUrl(event.target.value)
              if (event.target.value.trim()) setImageFile(null)
            }}
            placeholder="Or paste image URL (https://...)"
            className="admin-input py-2 text-sm sm:col-span-2"
          />
          {imagePreview ? (
            <div className="sm:col-span-2">
              <img
                src={imagePreview}
                alt="Selected upload preview"
                className="h-32 w-32 rounded-xl border border-white/10 object-cover"
              />
            </div>
          ) : null}
          <label className="flex items-center gap-2 text-sm text-header-ivory/70 sm:col-span-2">
            <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
            Publish immediately
          </label>
          {formError ? <p className="text-sm text-rose-200 sm:col-span-2">{formError}</p> : null}
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg border border-header-gold/30 bg-header-gold/10 px-4 py-2 text-sm font-semibold text-header-gold transition hover:bg-header-gold/20 sm:col-span-2"
          >
            {creating ? 'Saving…' : 'Create post'}
          </button>
        </form>
      </AdminModal>
    </>
  )
}
