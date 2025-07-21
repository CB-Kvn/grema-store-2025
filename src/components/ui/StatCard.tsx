import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-primary-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-primary-900">{value}</p>
        </div>
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
