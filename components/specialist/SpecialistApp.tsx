import React, { useState } from 'react';
import Header from '../shared/Header';
import BottomNav from '../shared/BottomNav';
import { ICONS } from '../../constants';
import Logo from '../shared/Logo';
import SpecialistDashboard from './SpecialistDashboard';
import PatientListScreen from './PatientListScreen';
import RequestsScreen from './RequestsScreen';
import SpecialistProfileScreen from './SpecialistProfileScreen';
import { Appointment } from '../../types';
import VideoCallScreen from './VideoCallScreen';
import PostSessionWorkspace from './PostSessionWorkspace';
import NotificationCenter from '../shared/NotificationCenter';
import FinancialsScreen from './FinancialsScreen';
import EditSpecialistProfileScreen from './EditSpecialistProfileScreen';

type SpecialistScreen = 'dashboard' | 'patients' | 'analytics' | 'profile' | 'edit-specialist-profile' | 'requests';
type AppState = 'main' | 'video_call' | 'post_session';

interface SpecialistAppProps {
  onLogout: () => void;
  onStartPreview: () => void;
}

const SpecialistApp: React.FC<SpecialistAppProps> = ({ onLogout, onStartPreview }) => {
  const [activeScreen, setActiveScreen] = useState<SpecialistScreen>('dashboard');
  const [navParams, setNavParams] = useState<any>({});
  const [appState, setAppState] = useState<AppState>('main');
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [sessionTranscript, setSessionTranscript] = useState<string>('');
  const [patientConsent, setPatientConsent] = useState(true); // Defaulting to true for simulation

  const handleNavigate = (screen: string, params: any = {}) => {
    setActiveScreen(screen as SpecialistScreen);
    setNavParams(params);
  };

  const handleStartSession = (appointment: Appointment, consent: boolean) => {
    setCurrentAppointment(appointment);
    setPatientConsent(consent);
    setAppState('video_call');
  };

  const handleEndCall = (transcript: string, audioUrl?: string) => {
    setSessionTranscript(transcript);
    if (currentAppointment && audioUrl) {
      setCurrentAppointment(prev => prev ? {...prev, audioUrl} : null);
    }
    setAppState('post_session');
  };

  const handleFinishSession = () => {
    setAppState('main');
    setCurrentAppointment(null);
    setSessionTranscript('');
  };

  if (appState === 'video_call' && currentAppointment) {
    return <VideoCallScreen appointment={currentAppointment} onEndCall={handleEndCall} patientConsent={patientConsent} />;
  }
  
  if (appState === 'post_session' && currentAppointment) {
    return <PostSessionWorkspace appointment={currentAppointment} transcript={sessionTranscript} onFinish={handleFinishSession} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: ICONS.home },
    { id: 'patients', label: 'Patients', icon: ICONS.users },
    { id: 'analytics', label: 'Analytics', icon: ICONS.analytics },
    { id: 'profile', label: 'Profile', icon: ICONS.profile },
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <SpecialistDashboard onNavigate={handleNavigate} onStartSession={handleStartSession} />;
      case 'patients':
        return <PatientListScreen initialPatientId={navParams.patientId} initialTab={navParams.initialTab} />;
      case 'analytics':
        return <FinancialsScreen />;
      case 'requests':
        return <RequestsScreen onBack={() => handleNavigate('dashboard')} />;
      case 'profile':
        return <SpecialistProfileScreen onStartPreview={onStartPreview} onNavigate={handleNavigate} />;
      case 'edit-specialist-profile':
        return <EditSpecialistProfileScreen onBack={() => handleNavigate('profile')} />;
      default:
        return <SpecialistDashboard onNavigate={handleNavigate} onStartSession={handleStartSession} />;
    }
  };

  const getScreenTitle = () => {
    if (activeScreen === 'edit-specialist-profile') return 'Edit Profile';
    if (activeScreen === 'requests') return 'All Requests';
    return navItems.find(item => item.id === activeScreen)?.label || 'MindCare';
  };
  
  const screenTitle = getScreenTitle();

  return (
    <div className="flex flex-col h-full bg-base-100">
      <Header
        leftAction={
          <div className="flex items-center space-x-2">
            <Logo className="h-8" iconOnly />
            <div className="flex items-baseline space-x-2">
                <h1 className="text-lg font-bold text-neutral">MindCare</h1>
                <span className="mx-1 text-gray-300 font-light">|</span>
                <h2 className="text-base font-medium text-gray-500 truncate">{screenTitle}</h2>
            </div>
          </div>
        }
        title={null}
        rightAction={
          <div className="flex items-center space-x-2">
            <NotificationCenter />
            <button onClick={onLogout} className="btn btn-ghost btn-sm btn-circle">
              {ICONS.logout}
            </button>
          </div>
        }
      />
      <main className="flex-grow overflow-y-auto">
        {renderScreen()}
      </main>
      <BottomNav
          items={navItems}
          activeItem={activeScreen}
          onItemClick={(id) => handleNavigate(id)}
      />
    </div>
  );
};

export default SpecialistApp;
