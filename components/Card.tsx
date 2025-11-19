
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg w-full">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white mb-5">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
