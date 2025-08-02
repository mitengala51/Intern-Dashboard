import React from 'react';

export const UserStatsSection = ({ leaderboardData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Your Position</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">#{leaderboardData?.currentUser?.rank}</p>
          <p className="text-gray-300 text-sm">Your Rank</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">₹{leaderboardData?.currentUser?.donations?.toLocaleString()}</p>
          <p className="text-gray-300 text-sm">Your Donations</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{leaderboardData?.currentUser?.level}</p>
          <p className="text-gray-300 text-sm">Your Level</p>
        </div>
      </div>
    </div>
  );
};