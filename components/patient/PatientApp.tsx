import React, { useState, useEffect } from 'react';
import Header from '../shared/Header';
import BottomNav from '../shared/BottomNav';
import { ICONS } from '../../constants';
import SpecialistsScreen from './SpecialistsScreen';
import AppointmentsScreen from './AppointmentsScreen';
import ProfileScreen from './ProfileScreen';
import Logo from '../shared/Logo';
import { SOSButton } from './SOSButton';
import AIChatScreen from './AIChatScreen';
import EditProfileScreen from './EditProfileScreen';
import HomeScreen from './HomeScreen';
import PatientChatScreen from './PatientChatScreen';
import EngagementScreen from './engagement/EngagementScreen';
import SecurityPrivacyScreen from './SecurityPrivacyScreen';

type PatientScreen = 'home' | 'specialists' | 'profile' | 'appointments' | 'edit-profile' | 'ai-chat' | 'direct-chat' | 'engage' | 'security';

interface PatientAppProps {
  onLogout: () => void;
  onEndPreview?: () => void;
}

const PatientApp: React.FC<PatientAppProps> = ({ onLogout, onEndPreview }) => {
  const [activeScreen, setActiveScreen] = useState<PatientScreen>('home');
  const [navParams, setNavParams] = useState<any>({});
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  
  const handleNavigate = (screen: string, params: any = {}) => {
    setActiveScreen(screen as PatientScreen);
    setNavParams(params);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: ICONS.home },
    { id: 'specialists', label: 'Specialists', icon: ICONS.users },
    { id: 'engage', label: 'Engage', icon: ICONS.brain },
    { id: 'profile', label: 'Profile', icon: ICONS.profile },
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} onTriggerSos={() => setIsSosModalOpen(true)} />;
      case 'ai-chat':
        return <AIChatScreen onNavigate={handleNavigate} onTriggerSos={() => setIsSosModalOpen(true)} />;
      case 'specialists':
        return <SpecialistsScreen initialFilters={navParams.filters} onNavigate={handleNavigate} />;
      case 'engage':
        return <EngagementScreen initialView={navParams.view} toolId={navParams.toolId} />;
      case 'profile':
        return <ProfileScreen onNavigate={handleNavigate} />;
      case 'edit-profile':
        return <EditProfileScreen onNavigate={handleNavigate} />;
      case 'security':
        return <SecurityPrivacyScreen onNavigate={handleNavigate} />;
      case 'appointments':
          return <AppointmentsScreen />;
      case 'direct-chat':
        if (navParams.specialist) {
          return <PatientChatScreen specialist={navParams.specialist} onBack={() => handleNavigate('specialists')} />;
        }
        return <SpecialistsScreen onNavigate={handleNavigate} />; // Fallback
      default:
        return <HomeScreen onNavigate={handleNavigate} onTriggerSos={() => setIsSosModalOpen(true)} />;
    }
  };

  const getScreenTitle = () => {
    if (activeScreen === 'edit-profile') return 'Edit Profile';
    if (activeScreen === 'security') return 'Security & Privacy';
    if (activeScreen === 'ai-chat') return 'AI Chat';
    if (activeScreen === 'direct-chat') return navParams.specialist?.name || 'Chat';
    const navItem = navItems.find(item => item.id === activeScreen);
    return navItem ? navItem.label : 'MindCare';
  };

  const screenTitle = getScreenTitle();

  return (
    <div className="flex flex-col h-full bg-base-100">
        {onEndPreview && (
          <div className="bg-secondary text-white text-center p-2 text-sm font-bold flex justify-between items-center sticky top-0 z-30">
            <span>Previewing Seeker View</span>
            <button onClick={onEndPreview} className="btn btn-xs btn-outline text-white border-white">
              Return to Specialist View
            </button>
          </div>
        )}
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
                <SOSButton isModalOpen={isSosModalOpen} setIsModalOpen={setIsSosModalOpen} />
                <button onClick={onLogout} className="btn btn-ghost btn-sm btn-circle" disabled={!!onEndPreview}>
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

export default PatientApp;