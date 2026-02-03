import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { authService } from './services/AuthService';

import Profile from './pages/Profile';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import DocumentDetail from './pages/DocumentDetail';
import Admin from './pages/Admin';
import Flashcards from './pages/Flashcards';


// Protected Route Wrapper
const ProtectedRoute = ({ children, role }) => {
  const user = authService.getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check auth on mount and route change
  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, [location]);

  const hideNavbarRoutes = ['/login', '/signup', '/admin'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar user={user} />}

      <main className="flex-grow flex flex-col relative w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/documents" element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          } />

          <Route path="/document/:id" element={
            <ProtectedRoute>
              <DocumentDetail />
            </ProtectedRoute>
          } />

          {/* Placeholder routes for now */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/flashcards" element={
            <ProtectedRoute>
              <Flashcards />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          } />

          <Route path="*" element={<div className="p-10 text-center text-xl">404 - Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
