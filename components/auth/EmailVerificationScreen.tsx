import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import Logo from '../shared/Logo';
import { useAppContext } from '../../context/AppContext';

interface EmailVerificationScreenProps {
  onVerified: () => void;
  onBack: () => void;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ onVerified, onBack }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { addToast } = useAppContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length > 1) return; // Only allow single digit

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to the next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to the previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendCode = () => {
    addToast('A new verification code has been sent.', 'success');
  };

  const isCodeComplete = code.every(digit => digit !== '');

  const handleVerify = () => {
    // For this prototype, any complete 6-digit code is considered valid.
    if (isCodeComplete) {
      onVerified();
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-100 p-8 text-center justify-between">
      <div className="flex-grow flex flex-col items-center justify-center">
        <Logo className="w-16 h-16 mb-6" iconOnly />
        <h2 className="text-2xl font-bold text-neutral">Verify Your Email</h2>
        <p className="text-gray-500 mt-2 max-w-sm">
          We've sent a 6-digit code to your email. Please enter it below to secure your account.
        </p>

        <div className="flex space-x-2 my-8" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl font-bold bg-base-200 border-2 border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 space-y-4">
        <button
          onClick={handleVerify}
          disabled={!isCodeComplete}
          className="w-full btn btn-primary"
        >
          Verify & Continue
        </button>
        <div className="text-sm">
            <span className="text-gray-500">Didn't receive a code? </span>
            <button onClick={handleResendCode} className="btn btn-link btn-sm p-0 normal-case">
                Resend Code
            </button>
        </div>
         <button onClick={onBack} className="w-full btn btn-ghost mt-4">
            Back
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;