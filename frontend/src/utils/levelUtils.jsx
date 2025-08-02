import { Crown, Medal, Award, Star, Gem, Trophy, Zap, Target, Shield } from 'lucide-react';

export const getLevelColor = (level) => {
  switch (level) {
    case 'Platinum': return 'from-cyan-300 to-cyan-500';
    case 'Gold': return 'from-yellow-400 to-yellow-600';
    case 'Silver': return 'from-gray-300 to-gray-500';
    case 'Bronze': return 'from-orange-400 to-orange-600';
    default: return 'from-blue-400 to-blue-600';
  }
};

export const getLevelIcon = (level) => {
  switch (level) {
    case 'Platinum': return Gem;
    case 'Gold': return Crown;
    case 'Silver': return Medal;
    case 'Bronze': return Award;
    default: return Star;
  }
};

export const getRankIcon = (rank) => {
  switch (rank) {
    case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
    case 2: return <Crown className="w-6 h-6 text-gray-300" />;
    case 3: return <Medal className="w-6 h-6 text-orange-400" />;
    case 4: return <Award className="w-6 h-6 text-blue-400" />;
    case 5: return <Shield className="w-6 h-6 text-purple-400" />;
    case 6: return <Zap className="w-6 h-6 text-green-400" />;
    case 7: return <Target className="w-6 h-6 text-red-400" />;
    case 8: return <Star className="w-6 h-6 text-pink-400" />;
    default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  }
};