import React, { useState } from 'react';
import Card from '../shared/Card';
import { MOODS, ICONS } from '../../constants';
import { useAppContext } from '../../context/AppContext';

interface DailyCheckInCardProps {
    onNavigate: (screen: string, params?: any) => void;
}

const DailyCheckInCard: React.FC<DailyCheckInCardProps> = ({ onNavigate }) => {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const { addToast } = useAppContext();

    const handleSelectMood = (moodIcon: string) => {
        setSelectedMood(moodIcon);
        addToast('Mood logged for today!', 'success');
    };

    return (
        <Card className="relative">
            <button 
                onClick={() => onNavigate('engagement', { view: 'journal' })}
                className="absolute top-4 right-4 btn btn-ghost btn-sm text-primary flex items-center"
                aria-label="Write in Journal"
            >
                {ICONS.journal}
                <span className="ml-1 hidden sm:inline">Journal</span>
            </button>

            <div className="text-center pt-2">
                <h3 className="font-bold text-neutral mb-3">How are you feeling right now?</h3>
                <div className="flex justify-around items-center mt-4">
                    {MOODS.map(mood => (
                        <button
                            key={mood.name}
                            onClick={() => handleSelectMood(mood.icon)}
                            className={`text-4xl p-2 rounded-full transition-all duration-200 transform hover:scale-125 ${selectedMood === mood.icon ? 'bg-primary bg-opacity-20 scale-110' : ''}`}
                            aria-label={mood.name}
                        >
                            {mood.icon}
                        </button>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default DailyCheckInCard;