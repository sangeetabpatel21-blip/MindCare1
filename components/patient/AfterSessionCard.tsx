import React, { useMemo } from 'react';
import Card from '../shared/Card';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../../constants';

interface AfterSessionCardProps {
    onNavigate: (screen: string, params?: any) => void;
}

const AfterSessionCard: React.FC<AfterSessionCardProps> = ({ onNavigate }) => {
    const { appointments, addToast } = useAppContext();

    const lastCompletedSession = useMemo(() => {
        const completed = appointments
            .filter(a => a.status === 'Completed')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return completed[0] || null;
    }, [appointments]);

    if (!lastCompletedSession || !lastCompletedSession.analysis) {
        return null; // Don't show the card if there's no recent session with analysis
    }
    
    // A simple way to check if the session was recent (e.g., within the last 3 days)
    const sessionDate = new Date(lastCompletedSession.date);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    if (sessionDate < threeDaysAgo) {
        return null;
    }

    return (
        <Card>
            <div className="flex items-center space-x-3 mb-3">
                <div className="text-secondary">{ICONS.brain}</div>
                <h3 className="font-bold text-neutral">Insights from your last session</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
                Based on your conversation with {lastCompletedSession.specialist.name}, here are a few themes that were discussed:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
                {lastCompletedSession.analysis.keyThemes.map(theme => (
                    <span key={theme} className="badge badge-ghost">{theme}</span>
                ))}
            </div>
            <div className="flex space-x-2">
                <button 
                    onClick={() => onNavigate('profile')}
                    className="btn btn-sm btn-outline btn-primary flex-1"
                >
                    View Wellness Plan
                </button>
                 <button 
                    onClick={() => addToast("We're glad you found it helpful!", 'info')}
                    className="btn btn-sm btn-ghost flex-1"
                >
                    This is helpful
                </button>
            </div>
        </Card>
    );
};

export default AfterSessionCard;
