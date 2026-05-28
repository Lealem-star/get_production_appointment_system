import type { AppointmentStatus } from './types'

export function statusBadgeClasses(status: AppointmentStatus) {
  if (status === 'pending') return 'bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/25'
  if (status === 'confirmed') return 'bg-sky-400/15 text-sky-200 ring-1 ring-sky-400/25'
  if (status === 'completed') return 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/25'
  return 'bg-rose-400/15 text-rose-200 ring-1 ring-rose-400/25'
}
