import React from 'react';
import { getLevelColor, getLevelIcon } from '../../utils/levelUtils';

export const WelcomeSection = ({ user }) => {
  console.log('Full user object:', user);
  console.log('User level:', user?.level);
  const LevelIcon = getLevelIcon(user?.level);

  return (
    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 🎉
          </h2>
          <p className="text-gray-300 text-lg">
            You're doing amazing work. Keep up the great momentum!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 bg-gradient-to-r ${getLevelColor(user?.level)} rounded-full flex items-center justify-center shadow-lg`}>
            <LevelIcon className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{user?.level}</p>
            <p className="text-gray-300 text-sm">Level</p>
          </div>
        </div>
      </div>
    </div>
  );
};
