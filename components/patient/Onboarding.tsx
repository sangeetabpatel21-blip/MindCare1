import React, { useState } from 'react';
import Logo from '../shared/Logo';

interface OnboardingProps {
    onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome to MindCare",
            description: "Your personal guide to mental wellness. Let's get you set up.",
            icon: <Logo className="w-20 h-20" iconOnly />
        },
        {
            title: "Connect with Specialists",
            description: "Find and book appointments with qualified mental health professionals that fit your needs.",
            icon: <span className="text-5xl">🤝</span>
        },
        {
            title: "Track Your Journey",
            description: "Use your journal, track your mood, and complete wellness tasks to see your progress over time.",
            icon: <span className="text-5xl">📈</span>
        },
        {
            title: "AI-Powered Support",
            description: "Chat with MindCare AI for information and support, anytime you need it. Ready to start?",
            icon: <span className="text-5xl">🤖</span>
        },
    ];

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
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="mb-8">{currentStep.icon}</div>
                <h2 className="text-3xl font-bold text-neutral mb-3">{currentStep.title}</h2>
                <p className="text-gray-600 max-w-sm">{currentStep.description}</p>
            </div>
            
            <div className="flex-shrink-0 space-y-4">
                <div className="flex justify-center space-x-2">
                    {steps.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full ${index === step ? 'bg-primary' : 'bg-base-300'}`}></div>
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
            </div>
        </div>
    );
};

export default OnboardingScreen;