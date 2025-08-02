import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-white mx-auto mb-4`} />
        <p className="text-white text-lg">{text}</p>
      </div>
    </div>
  );
};