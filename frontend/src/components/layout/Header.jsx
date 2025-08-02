import React from 'react';
import { Trophy, Target, TrendingUp, LogOut } from 'lucide-react';

export const Header = ({ currentView, setCurrentView, user, onLogout }) => {
  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Intern Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'leaderboard'
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Leaderboard
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-300 text-sm">{user?.level} Level</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};