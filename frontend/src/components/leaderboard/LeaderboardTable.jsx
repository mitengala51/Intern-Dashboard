import React from 'react';
import { getRankIcon } from '../../utils/levelUtils';

export const LeaderboardTable = ({ leaderboardData }) => {
  console.log(leaderboardData)
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/20">
        <h3 className="text-lg font-semibold text-white">Top Performers</h3>
      </div>
      
      <div className="divide-y divide-white/10">
        {leaderboardData?.leaderboard?.map((user) => (
          <div
            key={user._id}
            className={`px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-all ${
              user.isCurrentUser ? 'bg-blue-500/20 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10">
                {getRankIcon(user.rank)}
              </div>
              <div>
                <h4 className={`font-semibold ${user.isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                  {user.name} {user.isCurrentUser && '(You)'}
                </h4>
                <p className="text-gray-400 text-sm">{user.level} Level</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-white">₹{user.donations.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {leaderboardData?.totalUsers && (
        <div className="px-6 py-4 bg-white/5 text-center">
          <p className="text-gray-300 text-sm">
            Showing top 10 of {leaderboardData.totalUsers} total interns
          </p>
        </div>
      )}
    </div>
  );
};