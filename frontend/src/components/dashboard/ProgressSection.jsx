import React from 'react';

export const ProgressSection = ({ user }) => {
  if (!user?.stats?.nextReward) return null;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Next Reward Progress</h3>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-300">{user.stats.nextReward.title}</span>
        <span className="text-white font-semibold">₹{user.stats.nextReward.threshold.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
        <div 
          className="bg-gradient-to-r from-blue-400 to-purple-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${user.stats.progressToNext}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm">
        {user.stats.progressToNext}% complete • ₹{(user.stats.nextReward.threshold - user.donations).toLocaleString()} remaining
      </p>
    </div>
  );
};