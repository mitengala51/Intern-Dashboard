import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { LeaderboardTable } from './LeaderboardTable';
import { UserStatsSection } from './UserStatsSection';

export const LeaderboardView = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { api } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await api.getLeaderboard({ limit: 10 });
        setLeaderboardData(response.data);
        console.log(response.data)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [api]);

  if (loading) {
    return <LoadingSpinner text="Loading leaderboard..." />;
  }

  if (error) {
    return <ErrorMessage message={`Error loading leaderboard: ${error}`} />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h2>
        <p className="text-gray-300">See how you stack up against other interns</p>
      </div>

      <UserStatsSection leaderboardData={leaderboardData} />
      <LeaderboardTable leaderboardData={leaderboardData} />
    </div>
  );
};
