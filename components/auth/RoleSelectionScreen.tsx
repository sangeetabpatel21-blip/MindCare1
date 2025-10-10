import React from 'react';
import { UserRole } from '../../types';
import Logo from '../shared/Logo';

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  
  const SeekerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );

  const SpecialistIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-base-100 p-8 text-center">
      <div className="flex-grow flex flex-col items-center justify-center space-y-4">
        <Logo className="mb-4" />
        <h2 className="text-2xl font-bold text-neutral">Create Your Account</h2>
        <p className="text-gray-500">First, let us know who you are.</p>
      </div>
      
      <div className="w-full flex-shrink-0 space-y-4">
        <button
          onClick={() => onSelectRole(UserRole.Seeker)}
          className="w-full text-left p-6 bg-base-200 rounded-xl border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:shadow-lg flex items-center space-x-4"
        >
          <SeekerIcon />
          <div>
            <h3 className="font-bold text-lg text-neutral">I'm Seeking Support</h3>
            <p className="text-sm text-gray-600">Find guidance on your wellness journey.</p>
          </div>
        </button>
        <button
          onClick={() => onSelectRole(UserRole.Specialist)}
          className="w-full text-left p-6 bg-base-200 rounded-xl border-2 border-transparent hover:border-secondary transition-all duration-300 transform hover:shadow-lg flex items-center space-x-4"
        >
          <SpecialistIcon />
          <div>
            <h3 className="font-bold text-lg text-neutral">I'm Providing Care</h3>
            <p className="text-sm text-gray-600">Join as a mental health professional.</p>
          </div>
        </button>
      </div>
      
      <div className="flex-shrink-0 pt-8 pb-4">
        {/* Legal text moved to the next screen */}
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
