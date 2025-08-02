import React from 'react';

export const StatsCard = ({ icon: Icon, title, value, subtitle, color, progress, goal }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-gray-300 text-sm">{title}</p>
        </div>
      </div>
      {progress !== undefined && (
        <>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r from-${color}-400 to-${color}-600 h-2 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          {goal && <p className="text-gray-400 text-xs mt-2">Goal: {goal}</p>}
        </>
      )}
      {subtitle && <p className={`text-${color}-400 text-sm`}>{subtitle}</p>}
    </div>
  );
};