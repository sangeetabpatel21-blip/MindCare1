import React, { useState } from 'react';
import { UserRole } from '../../types';
import RoleSelectionScreen from './RoleSelectionScreen';
import OnboardingScreen from '../shared/OnboardingScreen';
import Logo from '../shared/Logo';

interface AuthScreenProps {
  onLogin: (role: UserRole) => void;
}

type AuthStep = 'role_selection' | 'auth_choice' | 'onboarding';

const AuthChoiceScreen: React.FC<{ onSignIn: () => void, onCreateAccount: () => void }> = ({ onSignIn, onCreateAccount }) => {
    return (
        <div className="flex flex-col items-center justify-between h-full bg-base-100 p-8 text-center">
            <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <Logo className="mb-4" />
                <h2 className="text-2xl font-bold text-neutral">Welcome</h2>
                <p className="text-gray-500">Sign in or create a new account to continue.</p>
            </div>
            <div className="w-full flex-shrink-0 space-y-4">
                <button
                    onClick={onCreateAccount}
                    className="w-full btn btn-primary"
                >
                    Create Account
                </button>
                <button
                    onClick={onSignIn}
                    className="w-full btn btn-secondary btn-outline"
                >
                    Sign In
                </button>
            </div>
             <div className="flex-shrink-0 pt-8 pb-4">
                <p className="text-gray-500 text-xs mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [step, setStep] = useState<AuthStep>('role_selection');
    const [role, setRole] = useState<UserRole | null>(null);

    const handleRoleSelect = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setStep('auth_choice');
    };

    const handleOnboardingComplete = () => {
        if (role) {
            onLogin(role);
        }
    };
    
    // For now, "Sign In" skips onboarding and goes straight to the app
    const handleSignIn = () => {
        if (role) {
            // In a real app, this would check credentials. 
            // Here, we just log in.
            onLogin(role);
        }
    }
    
    // "Create Account" goes to onboarding
    const handleCreateAccount = () => {
        setStep('onboarding');
    }

    switch (step) {
        case 'role_selection':
            return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
        case 'auth_choice':
            return <AuthChoiceScreen onSignIn={handleSignIn} onCreateAccount={handleCreateAccount} />;
        case 'onboarding':
            if (!role) return <RoleSelectionScreen onSelectRole={handleRoleSelect} />; // Fallback
            return <OnboardingScreen role={role} onComplete={handleOnboardingComplete} />;
        default:
            return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
    }
};

export default AuthScreen;