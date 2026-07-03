import { useState } from 'react'
import { Link } from 'react-router-dom'
import { statusBadgeClasses } from './adminBadge'
import type { Appointment, AppointmentStatus, PostItem, Role, TabKey, UserItem } from './types'

const TAB_LABELS: Record<TabKey, string> = {
  dashboard: 'Dashboard',
  appointments: 'Appointments',
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
  const tabs: TabKey[] = ['dashboard', 'appointments', 'users', 'posts']

  return (
    <aside className="admin-card flex w-full flex-col border-white/10 p-4 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:w-60 lg:shrink-0">
      <div className="border-b border-white/8 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-header-gold/80">Get production</p>
        <p className="mt-1 font-serif text-lg font-semibold text-header-ivory">Control panel</p>
        <p className="mt-0.5 text-xs capitalize text-header-ivory/45">{role} access</p>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1" aria-label="Admin navigation">
        {tabs.map((tab) => {
          const isDisabled = !canManageUsersAndPosts && (tab === 'users' || tab === 'posts')
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
        <Link
          to="/"
          className="admin-sidebar-link text-header-ivory/55 hover:text-header-ivory"
        >
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
    users: '◎',
    posts: '✎',
  }
  return <span className={className} aria-hidden>{icons[tab]}</span>
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
  }
}

const statMeta = [
  { key: 'totalAppointments' as const, label: 'Total appointments', hint: 'All booking requests' },
  { key: 'pendingAppointments' as const, label: 'Pending review', hint: 'Awaiting approval' },
  { key: 'activeUsers' as const, label: 'Active users', hint: 'Staff & customers' },
  { key: 'publishedPosts' as const, label: 'Published posts', hint: 'Live portfolio items' },
]

export function DashboardSection(props: DashboardSectionProps) {
  const { totals } = props
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statMeta.map((item) => (
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
  onStatusChange: (id: string, status: AppointmentStatus) => void
}

export function AppointmentsSection(props: AppointmentsSectionProps) {
  const { appointmentFilter, onFilterChange, appointments, onStatusChange } = props
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
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
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${statusBadgeClasses(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionButton label="View details" onClick={() => setSelectedAppointment(item)} />
                  <ActionButton label="Approve" onClick={() => onStatusChange(item.id, 'confirmed')} />
                  <ActionButton label="Complete" onClick={() => onStatusChange(item.id, 'completed')} />
                  <ActionButton label="Cancel" variant="danger" onClick={() => onStatusChange(item.id, 'cancelled')} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {selectedAppointment ? (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/70 p-4" role="presentation">
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
            className="admin-card relative z-10 w-full max-w-[560px] border-white/12 p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/8 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-header-gold/85">Appointment details</p>
                <h3 className="mt-1 font-serif text-2xl text-header-ivory">{selectedAppointment.customerName}</h3>
                <p className="mt-1 text-sm text-header-ivory/50">{selectedAppointment.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-header-ivory/80 transition hover:bg-white/10 hover:text-header-ivory"
              >
                Close
              </button>
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <DetailRow label="Service" value={selectedAppointment.service} />
              <DetailRow label="Status" value={selectedAppointment.status} />
              <DetailRow label="Date" value={selectedAppointment.date} />
              <DetailRow label="Time" value={selectedAppointment.time} />
              <DetailRow label="Assigned staff" value={selectedAppointment.staffName} />
              <DetailRow label="Client type" value={selectedAppointment.clientType ?? 'Not provided'} />
              <DetailRow label="Location" value={selectedAppointment.location ?? 'Not provided'} />
              <DetailRow label="Phone" value={selectedAppointment.customerPhone ?? 'Not provided'} />
              <DetailRow label="Customer address" value={selectedAppointment.customerAddress ?? 'Not provided'} />
            </dl>

            <div className="mt-4 rounded-xl border border-white/8 bg-black/25 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-header-gold/80">Notes</p>
              <p className="mt-1 text-sm text-header-ivory/65">
                {selectedAppointment.notes ? selectedAppointment.notes : 'No notes provided.'}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/2 px-3 py-2.5">
      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-header-ivory/45">{label}</dt>
      <dd className="mt-1 text-sm text-header-ivory/80">{value}</dd>
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

type UsersSectionProps = {
  users: UserItem[]
  onCycleRole: (id: string) => void
  onToggleStatus: (id: string) => void
}

export function UsersSection(props: UsersSectionProps) {
  const { users, onCycleRole, onToggleStatus } = props
  return (
    <section className="admin-card divide-y divide-white/6">
      {users.map((item) => (
        <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div>
            <p className="font-semibold text-header-ivory">{item.name}</p>
            <p className="text-sm text-header-ivory/50">{item.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold capitalize text-header-ivory/70">
              {item.role} · {item.status}
            </span>
            <ActionButton label="Change role" onClick={() => onCycleRole(item.id)} />
            <ActionButton
              label={item.status === 'active' ? 'Block' : 'Activate'}
              onClick={() => onToggleStatus(item.id)}
            />
          </div>
        </article>
      ))}
    </section>
  )
}

type PostsSectionProps = {
  posts: PostItem[]
  onTogglePublished: (id: string) => void
}

export function PostsSection(props: PostsSectionProps) {
  const { posts, onTogglePublished } = props
  return (
    <section className="admin-card divide-y divide-white/6">
      {posts.map((item) => (
        <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div>
            <p className="font-semibold text-header-ivory">{item.title}</p>
            <p className="text-sm text-header-ivory/50">{item.category}</p>
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
              onClick={() => onTogglePublished(item.id)}
            />
          </div>
        </article>
      ))}
    </section>
  )
}
