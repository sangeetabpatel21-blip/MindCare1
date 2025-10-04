import React from 'react';
import { UserRole } from '../types';
import Logo from './shared/Logo';

interface IntroductionScreenProps {
  role: UserRole;
  onContinue: () => void;
}

const SeekerIntro: React.FC = () => (
  <>
    <h2 className="text-3xl font-bold text-neutral mb-3">Your Wellness Journey Starts Here</h2>
    <p className="text-gray-600 max-w-sm">
      MindCare provides you with tools and support to navigate your path to mental well-being.
    </p>
    <ul className="text-left space-y-3 mt-8 bg-base-200 p-4 rounded-lg">
      <li className="flex items-start space-x-3">
        <span className="text-primary font-bold mt-1">&#10003;</span>
        <span><b>Connect with Specialists:</b> Find and book sessions with professionals who understand you.</span>
      </li>
      <li className="flex items-start space-x-3">
        <span className="text-primary font-bold mt-1">&#10003;</span>
        <span><b>AI-Powered Chat:</b> Get information and support from our friendly AI, available 24/7.</span>
      </li>
      <li className="flex items-start space-x-3">
        <span className="text-primary font-bold mt-1">&#10003;</span>
        <span><b>Track Your Progress:</b> Use the journal and wellness tools to monitor your journey.</span>
      </li>
    </ul>
  </>
);

const SpecialistIntro: React.FC = () => (
  <>
    <h2 className="text-3xl font-bold text-neutral mb-3">Empower Your Practice</h2>
    <p className="text-gray-600 max-w-sm">
      MindCare offers a suite of tools to help you manage your clients and streamline your workflow.
    </p>
    <ul className="text-left space-y-3 mt-8 bg-base-200 p-4 rounded-lg">
      <li className="flex items-start space-x-3">
        <span className="text-secondary font-bold mt-1">&#10003;</span>
        <span><b>AI-Powered Notes:</b> Generate session notes and summaries from transcripts in seconds.</span>
      </li>
      <li className="flex items-start space-x-3">
        <span className="text-secondary font-bold mt-1">&#10003;</span>
        <span><b>Client Management:</b> Track progress, manage wellness plans, and communicate securely.</span>
      </li>
      <li className="flex items-start space-x-3">
        <span className="text-secondary font-bold mt-1">&#10003;</span>
        <span><b>Seamless Scheduling:</b> Manage your calendar and appointment requests all in one place.</span>
      </li>
    </ul>
  </>
);

const IntroductionScreen: React.FC<IntroductionScreenProps> = ({ role, onContinue }) => {
  return (
    <div className="flex flex-col h-full bg-base-100 p-8 text-center justify-between">
      <div className="flex-grow flex flex-col items-center justify-center">
        <Logo className="w-20 h-20 mb-6" iconOnly />
        {role === UserRole.Seeker ? <SeekerIntro /> : <SpecialistIntro />}
      </div>
      <div className="flex-shrink-0">
        <button onClick={onContinue} className="w-full btn btn-primary">
          Let's Get Started
        </button>
      </div>
    </div>
  );
};

export default IntroductionScreen;