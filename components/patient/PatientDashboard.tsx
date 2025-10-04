import React from 'react';
import DailyFocusCard from './DailyFocusCard';
import NextAppointmentCard from './NextAppointmentCard';
import DailyCheckInCard from './MoodLogger';
import ProgressGraph from './ProgressGraph';
import AfterSessionCard from './AfterSessionCard';

interface PatientDashboardProps {
  onNavigate: (screen: string, params?: any) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="p-4 space-y-4">
      <DailyFocusCard onNavigate={onNavigate} />
      <NextAppointmentCard />
      <AfterSessionCard onNavigate={onNavigate} />
      <DailyCheckInCard onNavigate={onNavigate} />
      <ProgressGraph />
    </div>
  );
};

export default PatientDashboard;