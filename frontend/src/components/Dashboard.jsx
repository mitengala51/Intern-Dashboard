import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from './layout/Header';
import { DashboardView } from './dashboard/DashboardView';
import { LeaderboardView } from './leaderboard/LeaderboardView';

export const Dashboard = () => {
  const { user, logout, refreshProfile, api } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateDonation = async () => {
    setIsSimulating(true);
    try {
      const randomAmount = Math.floor(Math.random() * 500) + 100;
      await api.updateDonations(randomAmount);
      await refreshProfile();
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={logout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? (
          <DashboardView 
            user={user} 
            simulateDonation={simulateDonation} 
            isSimulating={isSimulating} 
          />
        ) : (
          <LeaderboardView />
        )}
      </main>
    </div>
  );
};