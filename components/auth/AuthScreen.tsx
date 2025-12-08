import React, { useState } from 'react';
import { UserRole } from '../../types';
import RoleSelectionScreen from './RoleSelectionScreen';
import OnboardingScreen from '../shared/OnboardingScreen';
import Logo from '../shared/Logo';

interface AuthScreenProps {
  onLogin: (role: UserRole, user: any, token: string) => void;
}

type AuthStep = 'role_selection' | 'auth_choice' | 'onboarding';

const AuthChoiceScreen: React.FC<{ onSignIn: () => void; onCreateAccount: () => void }> = ({
  onSignIn,
  onCreateAccount
}) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-base-100 p-8 text-center">
      <div className="flex-grow flex flex-col items-center justify-center space-y-4">
        <Logo className="mb-4" />
        <h2 className="text-2xl font-bold text-neutral">Welcome</h2>
        <p className="text-gray-500">Sign in or create a new account to continue.</p>
      </div>
      <div className="w-full flex-shrink-0 space-y-4">
        <button onClick={onCreateAccount} className="w-full btn btn-primary">
          Create Account
        </button>
        <button onClick={onSignIn} className="w-full btn btn-secondary btn-outline">
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
  const [email, setEmail] = useState<string>('test@example.com'); // TEMP default
  const [password, setPassword] = useState<string>('secret123');  // TEMP default
  const [displayName, setDisplayName] = useState<string>('MindCare User');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('auth_choice');
  };

  const callBackend = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(
        'https://mindcare-backend-8r24.onrender.com/auth/email',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            displayName
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        setIsSubmitting(false);
        return;
      }

      if (!role) {
        setError('Please select a role first');
        setIsSubmitting(false);
        return;
      }

      onLogin(role, data.user, data.token);
    } catch (e) {
      console.error(e);
      setError('Network error, please try again');
      setIsSubmitting(false);
    }
  };

  const handleOnboardingComplete = () => {
    // After onboarding, create account via backend
    void callBackend();
  };

  const handleSignIn = () => {
    // For now, use the same backend call for sign in / sign up
    void callBackend();
  };

  const handleCreateAccount = () => {
    setStep('onboarding');
  };

  if (step === 'role_selection') {
    return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
  }

  if (step === 'auth_choice') {
    return (
      <>
        <AuthChoiceScreen onSignIn={handleSignIn} onCreateAccount={handleCreateAccount} />
        {/* Simple temporary inputs for email/password, can be redesigned later */}
        <div className="fixed bottom-4 left-4 right-4 bg-base-100 p-4 rounded shadow">
          <div className="mb-2">
            <input
              className="input input-bordered w-full"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <input
              className="input input-bordered w-full"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <input
              className="input input-bordered w-full"
              placeholder="Name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {isSubmitting && <p className="text-xs text-gray-500 mt-1">Contacting MindCare server…</p>}
        </div>
      </>
    );
  }

  if (step === 'onboarding') {
    if (!role) {
      return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
    }
    return <OnboardingScreen role={role} onComplete={handleOnboardingComplete} />;
  }

  return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
};

export default AuthScreen;
