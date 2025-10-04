import React from 'react';
import NextAppointmentCard from './NextAppointmentCard';
import ProgressGraph from './ProgressGraph';
import WellnessPlanCard from './WellnessPlanCard';
import AIChatCard from './AIChatCard';

interface HomeScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  onTriggerSos: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onTriggerSos }) => {
  return (
    <div className="p-4 space-y-4">
      {/* 1. AI Chat Card */}
      <AIChatCard onClick={() => onNavigate('ai-chat')} />

      {/* 2. Next Appointment */}
      <NextAppointmentCard />

      {/* 3. Work to Do */}
      <WellnessPlanCard onNavigate={onNavigate} />

      {/* 4. Progress Graph */}
      <ProgressGraph />
    </div>
  );
};

export default HomeScreen;