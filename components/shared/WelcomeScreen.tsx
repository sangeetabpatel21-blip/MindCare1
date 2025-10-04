
import React from 'react';
import Logo from './Logo';

interface WelcomeScreenProps {
  onFinish: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
    return (
        <div 
            className="flex flex-col items-center justify-center h-full bg-base-100 cursor-pointer"
            onClick={onFinish}
            aria-label="Welcome to MindCare, tap to continue"
            role="button"
        >
            <div className="flex flex-col items-center">
                <Logo className="w-24 h-24 animate-logo-fade-in-scale" iconOnly />
                <h1 className="text-4xl font-bold text-neutral tracking-wider mt-4 animate-text-fade-in-up">
                    MindCare
                </h1>
            </div>
        </div>
    );
};

export default WelcomeScreen;
