import React from 'react';
import { Heart, Users, Zap, Gift } from 'lucide-react';
import { WelcomeSection } from './WelcomeSection';
import { StatsCard } from './StatsCard';
import { ProgressSection } from './ProgressSection';
import { RewardsGrid } from './RewardsGrid';

export const DashboardView = ({ user, simulateDonation, isSimulating }) => {
  return (
    <div className="space-y-8">
      <WelcomeSection user={user} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Heart}
          title="Total Donations"
          value={`₹${user?.donations?.toLocaleString()}`}
          color="green"
          progress={(user?.donations || 0) / 10000 * 100}
          goal="₹10,000"
        />

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white font-mono">{user?.referralCode}</p>
              <p className="text-gray-300 text-sm">Referral Code</p>
            </div>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(user?.referralCode)}
            className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg text-sm transition-all"
          >
            Copy Code
          </button>
        </div>

        <StatsCard
          icon={Zap}
          title="Days Active"
          value={user?.stats?.daysActive}
          color="purple"
          subtitle="Keep the streak going! 🔥"
        />

        <StatsCard
          icon={Gift}
          title="Rewards Unlocked"
          value={user?.stats?.rewardsUnlocked}
          color="yellow"
          subtitle="Amazing progress! 🏆"
        />
      </div>

      <ProgressSection user={user} />
      <RewardsGrid 
        user={user} 
        onSimulateDonation={simulateDonation} 
        isSimulating={isSimulating} 
      />
    </div>
  );
};