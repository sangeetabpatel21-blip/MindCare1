
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  // FIX: Add style prop to allow inline styles. This resolves type errors in components that use Card with a style attribute.
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => {
  const cardClasses = `bg-white rounded-xl shadow-md overflow-hidden ${className} ${
    onClick ? 'cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105' : ''
  }`;

  return (
    <div className={cardClasses} onClick={onClick} style={style}>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
};

export default Card;
