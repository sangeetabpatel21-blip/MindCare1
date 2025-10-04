
import React, { useState } from 'react';
import Logo from './Logo';
import { UserRole } from '../../types';

interface OnboardingScreenProps {
    role: UserRole;
    onComplete: () => void;
}

const seekerSteps = [
    {
        title: "Welcome to MindCare",
        description: "Your personal guide to mental wellness. Let's get you set up.",
        icon: <Logo className="w-20 h-20" iconOnly />
    },
    {
        title: "Connect with Specialists",
        description: "Find and book sessions with qualified mental health professionals who fit your needs.",
        icon: <span className="text-5xl">🤝</span>
    },
    {
        title: "AI-Powered Support",
        description: "Chat with MindCare AI for information and support, anytime you need it.",
        icon: <span className="text-5xl">🤖</span>
    },
    {
        title: "Track Your Journey",
        description: "Use your journal, track your mood, and complete wellness tasks to see your progress over time. Ready to start?",
        icon: <span className="text-5xl">📈</span>
    },
];

const specialistSteps = [
     {
        title: "Welcome to MindCare",
        description: "The platform to empower your practice. Let's get you set up.",
        icon: <Logo className="w-20 h-20" iconOnly />
    },
    {
        title: "AI-Powered Notes",
        description: "Generate session notes and summaries from transcripts in seconds, saving you valuable time.",
        icon: <span className="text-5xl">📝</span>
    },
    {
        title: "Client Management",
        description: "Track progress, manage wellness plans, and communicate securely with your clients.",
        icon: <span className="text-5xl">👥</span>
    },
    {
        title: "Seamless Scheduling",
        description: "Manage your calendar and appointment requests all in one place. Ready to begin?",
        icon: <span className="text-5xl">🗓️</span>
    },
];


const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ role, onComplete }) => {
    const [step, setStep] = useState(0);
    
    const steps = role === UserRole.Seeker ? seekerSteps : specialistSteps;
    const currentStep = steps[step];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-base-100 p-8 text-center justify-between">
            <div className="flex-grow flex flex-col items-center justify-center animate-text-fade-in-up">
                <div className="mb-8">{currentStep.icon}</div>
                <h2 className="text-3xl font-bold text-neutral mb-3">{currentStep.title}</h2>
                <p className="text-gray-600 max-w-sm">{currentStep.description}</p>
            </div>
            
            <div className="flex-shrink-0 space-y-4">
                <div className="flex justify-center space-x-2">
                    {steps.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === step ? 'bg-primary' : 'bg-base-300'}`}></div>
                    ))}
                </div>
                 <button onClick={handleNext} className="w-full btn btn-primary">
                    {step === steps.length - 1 ? "Let's Go!" : "Continue"}
                </button>
                 {step < steps.length - 1 && (
                     <button onClick={onComplete} className="w-full btn btn-ghost">
                        Skip
                    </button>
                )}
                 <p className="text-gray-400 text-xs mt-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default OnboardingScreen;
