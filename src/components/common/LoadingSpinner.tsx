import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
      <div className="text-white font-risque text-xl">{message}</div>
    </div>
  );
}; 