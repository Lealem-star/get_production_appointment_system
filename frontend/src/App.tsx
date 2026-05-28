
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/home.tsx'
import AdminPage from './pages/admin/AdminPage.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
