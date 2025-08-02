import React from 'react';
import { Star, Zap, Loader2 } from 'lucide-react';

export const RewardsGrid = ({ user, onSimulateDonation, isSimulating }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Your Rewards</h3>
        <button
          onClick={onSimulateDonation}
          disabled={isSimulating}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Simulating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Simulate Donation
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user?.rewards?.map((reward, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all ${
              reward.unlocked
                ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/25'
                : 'bg-gray-700/20 border-gray-600/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-semibold ${reward.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
                {reward.title}
              </h4>
              {reward.unlocked && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
            </div>
            <p className={`text-sm ${reward.unlocked ? 'text-green-300' : 'text-gray-500'}`}>
              ₹{reward.threshold.toLocaleString()} threshold
            </p>
            {reward.unlocked && reward.unlockedAt && (
              <p className="text-xs text-green-400 mt-1">
                Unlocked {new Date(reward.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};