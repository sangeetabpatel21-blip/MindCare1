import React from 'react';
import { Specialist } from '../../types';
import Card from '../shared/Card';
import { useAppContext } from '../../context/AppContext';
import { ICONS } from '../../constants';

interface YourSpecialistCardProps {
    specialist: Specialist;
    onNavigate: (screen: string, params?: any) => void;
    onBookNow: () => void;
}

const YourSpecialistCard: React.FC<YourSpecialistCardProps> = ({ specialist, onNavigate, onBookNow }) => {
    const { user, updateUserProfile, appointments, addToast } = useAppContext();

    const sessionCount = appointments.filter(a => a.specialist.name === specialist.name && a.status === 'Completed').length;

    const handleShareToggle = () => {
        const isSharing = !user?.isProgressShared;
        updateUserProfile({ isProgressShared: isSharing });
        addToast(isSharing ? `Progress sharing enabled with ${specialist.name}.` : 'Progress sharing disabled.', 'info', false);
    };

    return (
        <Card className="mb-4 bg-gradient-to-br from-indigo-50 to-purple-50">
            <h2 className="text-lg font-bold text-neutral mb-3">Your Specialist</h2>
            <div className="flex space-x-4 items-start">
                <img
  src={specialist.avatarUrl}alt={specialist.name}className="w-16 h-16 rounded-full flex-shrink-0"style={{ objectFit: 'cover' }}/>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-neutral truncate">{specialist.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{specialist.title}</p>
                    <p className="text-xs font-semibold text-indigo-600 mt-1">{sessionCount} sessions completed</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t space-y-3">
                 <div className="form-control">
                    <label className="label cursor-pointer p-0">
                        <span className="label-text font-semibold">Share Progress Graph</span> 
                        <input 
                            type="checkbox" 
                            className="toggle toggle-secondary" 
                            checked={user?.isProgressShared || false}
                            onChange={handleShareToggle}
                        />
                    </label>
                    <p className="text-xs text-gray-500">Allows {specialist.name.split(' ')[0]} to view your progress analytics.</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onNavigate('direct-chat', { specialist })} className="btn btn-secondary btn-sm flex-1">
                        {ICONS.messages}
                        <span className="ml-2">Message</span>
                    </button>
                    <button onClick={onBookNow} className="btn btn-primary btn-sm flex-1">
                        {ICONS.calendar}
                        <span className="ml-2">Book Again</span>
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default YourSpecialistCard;
