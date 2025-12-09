import React, { useState } from 'react';
import { UserRole } from '../../types';
import RoleSelectionScreen from './RoleSelectionScreen';
import OnboardingScreen from '../shared/OnboardingScreen';
import Logo from '../shared/Logo';

interface AuthScreenProps {
  onLogin: (role: UserRole, user: any, token: string) => void;
}

type AuthStep = 'role_selection' | 'auth_choice' | 'onboarding';

interface AuthChoiceScreenProps {
  role: UserRole | null;
  onCreateAccount: () => void;
  onGoogleClick: () => void;
  isSubmitting: boolean;
  error: string | null;
}

const AuthChoiceScreen: React.FC<AuthChoiceScreenProps> = ({
  role,
  onCreateAccount,
  onGoogleClick,
  isSubmitting,
  error
}) => {
  const roleLabel =
    role === UserRole.Specialist ? 'Mental Health Specialist' : 'Seeker';

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-base-100 px-6 py-8 text-center">
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 w-full max-w-md">
        <Logo className="mb-2" />
        <h2 className="text-2xl font-bold text-neutral">
          Welcome {role ? `, ${roleLabel}` : ''}
        </h2>
        <p className="text-gray-500 text-sm">
          Choose how you would like to continue. You can use Google or email. If
          you are a seeker, you can also use a nickname while we keep your
          details private.
        </p>

        {/* Continue with Google */}
        <button
          onClick={onGoogleClick}
          className="w-full btn btn-outline btn-primary mt-4"
          disabled={isSubmitting}
        >
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center w-full my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-2 text-xs text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
      </div>

      <div className="flex-shrink-0 pt-4 pb-2 w-full max-w-md">
        {error && (
          <p className="text-red-500 text-xs mb-2 text-left">{error}</p>
        )}
        {isSubmitting && (
          <p className="text-xs text-gray-500 mb-2 text-left">
            Contacting MindCare server…
          </p>
        )}
        <p className="text-gray-500 text-[10px] mt-2">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
        <button
          onClick={onCreateAccount}
          className="mt-3 text-xs text-primary underline"
        >
          Continue to quick onboarding
        </button>
      </div>
    </div>
  );
};

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('role_selection');
  const [role, setRole] = useState<UserRole | null>(null);

  // shared form state
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [anonPhone, setAnonPhone] = useState<string>('');
  const [anonNickname, setAnonNickname] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('auth_choice');
  };

  const callEmailBackend = async () => {
    if (!role) {
      setError('Please select a role first');
      return;
    }

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
            name: displayName,
            phone,
            role: role === UserRole.Specialist ? 'mhs' : 'seeker'
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
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

  const callAnonymousBackend = async () => {
    if (!role) {
      setError('Please select a role first');
      return;
    }

    // Anonymous is only allowed for Seekers
    if (role === UserRole.Specialist) {
      setError('Anonymous mode is only available for seekers.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(
        'https://mindcare-backend-8r24.onrender.com/auth/anonymous',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: anonPhone,
            nickname: anonNickname
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Anonymous sign‑in failed');
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
    // After onboarding, use email backend by default
    void callEmailBackend();
  };

  const handleCreateAccount = () => {
    setStep('onboarding');
  };

  const handleGoogleClick = () => {
    setError('Google sign‑in will be available soon.');
  };

  if (step === 'role_selection') {
    return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
  }

  if (step === 'auth_choice') {
    return (
      <>
        <AuthChoiceScreen
          role={role}
          onCreateAccount={handleCreateAccount}
          onGoogleClick={handleGoogleClick}
          isSubmitting={isSubmitting}
          error={error}
        />

        {/* Bottom sheet with email (+ optional anonymous for seekers) */}
        <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-gray-200 p-4 space-y-4">
          {/* Continue with email */}
          <div>
            <h3 className="text-sm font-semibold text-left mb-2">
              {role === UserRole.Specialist
                ? 'Specialist sign in / sign up'
                : 'Continue with email'}
            </h3>
            <div className="mb-2">
              <input
                className="input input-bordered w-full"
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                className="input input-bordered w-full"
                placeholder="Phone number (India)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                className="input input-bordered w-full"
                placeholder={
                  role === UserRole.Specialist ? 'Full name' : 'Name or nickname'
                }
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
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
            <button
              onClick={callEmailBackend}
              className="w-full btn btn-primary mt-1"
              disabled={isSubmitting}
            >
              {role === UserRole.Specialist
                ? 'Continue as specialist'
                : 'Continue with email'}
            </button>
          </div>

          {/* Divider */}
          {role === UserRole.Seeker && (
            <>
              <div className="flex items-center w-full">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="px-2 text-xs text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Anonymous but contactable – seekers only */}
              <div>
                <h3 className="text-sm font-semibold text-left mb-2">
                  Continue with nickname (anonymous)
                </h3>
                <div className="mb-2">
                  <input
                    className="input input-bordered w-full"
                    placeholder="Phone number (India)"
                    value={anonPhone}
                    onChange={e => setAnonPhone(e.target.value)}
                  />
                </div>
                <div className="mb-1">
                  <input
                    className="input input-bordered w-full"
                    placeholder="Nickname"
                    value={anonNickname}
                    onChange={e => setAnonNickname(e.target.value)}
                  />
                </div>
                <p className="text-[10px] text-left text-gray-500 mb-2">
                  Your phone number stays private. It is only used for safety
                  alerts and important messages, never shown to others.
                </p>
                <button
                  onClick={callAnonymousBackend}
                  className="w-full btn btn-secondary btn-outline"
                  disabled={isSubmitting}
                >
                  Continue with nickname
                </button>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  if (step === 'onboarding') {
    if (!role) {
      return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
    }
    return (
      <OnboardingScreen role={role} onComplete={handleOnboardingComplete} />
    );
  }

  return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
};

export default AuthScreen;
