import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import AboutPage from './pages/AboutPage';
import AccessibilityPage from './pages/AccessibilityPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CreateSlotsPage from './pages/CreateSlotsPage';
import ReschedulePage from './pages/ReschedualePage';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/create-slots" element={
            <ProtectedAdminRoute>
              <CreateSlotsPage />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          } />
          <Route path="*" element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/book/:serviceId" element={
                    <ProtectedRoute><BookingPage /></ProtectedRoute>
                  } />
                  <Route path="/my-appointments" element={
                    <ProtectedRoute><MyAppointmentsPage /></ProtectedRoute>
                  } />
                  <Route path="/reschedule/:appointmentId" element={
                    <ProtectedRoute><ReschedulePage /></ProtectedRoute>
                  } />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/accessibility" element={<AccessibilityPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;