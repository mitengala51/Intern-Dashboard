import React from 'react';

export const ErrorMessage = ({ message, className = '' }) => {
  return (
    <div className={`bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm ${className}`}>
      {message}
    </div>
  );
};
