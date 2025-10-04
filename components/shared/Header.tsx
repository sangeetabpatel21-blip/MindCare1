import React from 'react';

// FIX: Refactored Header to be a presentational component, accepting left and right actions as props.
// This resolves prop type errors in PatientApp and SpecialistApp by allowing parent components to define the header actions.
interface HeaderProps {
  title: React.ReactNode;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, leftAction, rightAction }) => {
  return (
    <div className="bg-white sticky top-0 z-20 shadow-md">
      <div className="navbar min-h-14">
        <div className="navbar-start w-1/4">
          {leftAction}
        </div>
        <div className="navbar-center flex-1 text-center">
          {typeof title === 'string' ? (
             <h1 className="text-lg font-bold text-neutral truncate">{title}</h1>
          ) : (
            title
          )}
        </div>
        <div className="navbar-end w-1/4">
          {rightAction}
        </div>
      </div>
    </div>
  );
};

export default Header;
