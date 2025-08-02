import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { Dashboard } from './components/Dashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const AuthContent = ({ showRegister, setShowRegister }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return showRegister ? (
    <Register onToggle={() => setShowRegister(false)} />
  ) : (
    <Login onToggle={() => setShowRegister(true)} />
  );
};

const App = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <AuthContent showRegister={showRegister} setShowRegister={setShowRegister} />
    </AuthProvider>
  );
};

export default App;