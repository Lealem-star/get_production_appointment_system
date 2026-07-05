export type Role = 'admin' | 'staff'

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export type Appointment = {
  id: string
  customerName: string
  customerPhone?: string
  customerAddress?: string
  service: string
  date: string
  time: string
  staffName: string
  clientType?: string
  location?: 'Indoor' | 'Outdoor' | string
  notes?: string
  status: AppointmentStatus
}

export type UserItem = {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'customer'
  status: 'active' | 'blocked'
}

export type PostItem = {
  id: string
  title: string
  category: string
  imageUrl?: string
  published: boolean
}

export type ContactMessage = {
  id: string
  name: string
  phone: string
  details: string
  createdAt?: string
}

export type StaffMember = {
  id: string
  name: string
}

export type TabKey = 'dashboard' | 'appointments' | 'contacts' | 'users' | 'posts'
