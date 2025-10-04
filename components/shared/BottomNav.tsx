
import React from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, activeItem, onItemClick }) => {
  return (
    <div className="bg-white sticky bottom-0 z-10 border-t border-base-300 shadow-t-lg">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-300 w-full h-full ${
              activeItem === item.id ? 'text-primary' : 'text-gray-400 hover:text-primary'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
