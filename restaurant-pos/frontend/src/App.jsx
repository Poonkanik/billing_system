import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/common/Layout';
import LoginPage from './pages/LoginPage';
import BillingPage from './pages/BillingPage';
import MasterPage from './pages/MasterPage';
import ReportsPage from './pages/ReportsPage';
import OptionsPage from './pages/OptionsPage';
import UsersPage from './pages/UsersPage';
import { C } from './utils/theme';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: C.bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
        <div style={{ fontSize: 16, color: C.primary, fontWeight: 700 }}>Loading RestoPOS...</div>
      </div>
    </div>
  );
  return user ? children : <Navigate to='/login' replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path='/login' element={user ? <Navigate to='/billing' replace /> : <LoginPage />} />
      <Route path='/' element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to='/billing' replace />} />
        <Route path='billing' element={<BillingPage />} />
        <Route path='master' element={<MasterPage />} />
        <Route path='reports' element={<ReportsPage />} />
        <Route path='options' element={<OptionsPage />} />
        <Route path='users' element={<UsersPage />} />
      </Route>
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
