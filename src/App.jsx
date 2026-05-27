import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import ReservationPage from './pages/ReservationPage.jsx';
import ConfirmPage from './pages/ConfirmPage.jsx';
import MyReservationsPage from './pages/MyReservationsPage.jsx';
import AdminThemesPage from './pages/admin/AdminThemesPage.jsx';
import AdminTimesPage from './pages/admin/AdminTimesPage.jsx';
import AdminReservationsPage from './pages/admin/AdminReservationsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/reservation/complete" element={<ConfirmPage />} />
          <Route path="/my" element={<MyReservationsPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="themes" replace />} />
          <Route path="themes" element={<AdminThemesPage />} />
          <Route path="times" element={<AdminTimesPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
