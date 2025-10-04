import React, { useState } from 'react';
import Card from '../shared/Card';
import { ICONS } from '../../constants';
import { useAppContext } from '../../context/AppContext';
import PrototypeFeedbackCard from '../shared/PrototypeFeedbackCard';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-base-200 p-3 rounded-lg text-center">
        <div className="text-secondary mx-auto w-6 h-6 mb-1">{icon}</div>
        <p className="text-xs text-gray-500 font-semibold">{label}</p>
        <p className="text-lg font-bold text-neutral truncate">{value}</p>
    </div>
);

interface SpecialistProfileScreenProps {
    onStartPreview: () => void;
    onNavigate: (screen: string) => void;
}

const SpecialistProfileScreen: React.FC<SpecialistProfileScreenProps> = ({ onStartPreview, onNavigate }) => {
    const { specialist, addToast, updateSpecialistProfile } = useAppContext();
    const [isCalendarSynced, setIsCalendarSynced] = useState(false);

    if (!specialist) return null;

    const handleAvailabilityChange = () => {
        const newAvailability = specialist.availability === 'available' ? 'unavailable' : 'available';
        updateSpecialistProfile({ availability: newAvailability });
    };
    
    const handleCalendarSyncToggle = () => {
        const newSyncState = !isCalendarSynced;
        setIsCalendarSynced(newSyncState);
        addToast(newSyncState ? 'Calendar sync enabled!' : 'Calendar sync disabled.', 'success');
    };
    
    const DetailSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
        <details className="collapse collapse-arrow bg-white shadow-sm" open>
            <summary className="collapse-title text-lg font-bold text-neutral">{title}</summary>
            <div className="collapse-content text-sm text-gray-700">
                {children}
            </div>
        </details>
    );

    return (
        <div className="p-4 space-y-4">
            <div className="relative flex flex-col items-center space-y-2">
                 <button onClick={() => onNavigate('edit-specialist-profile')} className="absolute top-0 right-0 btn btn-primary btn-sm">
                    {ICONS.edit} Edit Profile
                </button>
                <div className="avatar">
                    <div className="w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                        <img src={specialist.avatarUrl} alt={specialist.name} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral">{specialist.name}</h2>
                <p className="text-sm text-gray-500">{specialist.title}</p>
                 <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${specialist.availability === 'available' ? 'text-green-600' : 'text-gray-500'}`}>
                        {specialist.availability === 'available' ? 'Available for new clients' : 'Not accepting new clients'}
                    </span>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-secondary toggle-sm" 
                        checked={specialist.availability === 'available'}
                        onChange={handleAvailabilityChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={ICONS.star} label="Avg. Rating" value={specialist.avgRating} />
                <StatCard icon={ICONS.briefcase} label="Experience" value={`${specialist.experience} yrs`} />
                <StatCard icon={ICONS.tag} label="Session Fee" value={`$${specialist.sessionFee}`} />
                <StatCard icon={ICONS.users} label="Total Sessions" value="247" /> 
            </div>
            
            <DetailSection title="About Me">
                <p className="font-semibold text-base mb-2">My Professional Statement</p>
                <p className="whitespace-pre-wrap mb-4">{specialist.professionalStatement}</p>
                <div className="divider"></div>
                <p className="font-semibold text-base mb-2">My Therapeutic Approach</p>
                <p className="whitespace-pre-wrap">{specialist.approach}</p>
                {specialist.modes.includes('In-person') && specialist.location && (
                     <>
                        <div className="divider"></div>
                        <p className="font-semibold text-base mb-2">Practice Location</p>
                        <div className="flex items-start space-x-3">
                            <div className="text-secondary mt-1">{ICONS.mapPin}</div>
                            <p>{specialist.location}</p>
                        </div>
                    </>
                )}
            </DetailSection>

            <DetailSection title="Professional Background">
                <p className="font-semibold text-base mb-2">Education</p>
                <ul className="space-y-2 mb-4">
                    {specialist.education.map((edu, i) => (
                        <li key={i} className="flex items-start space-x-3">
                            <div className="text-secondary mt-1">{ICONS.education}</div>
                            <div>
                                <p className="font-bold">{edu.degree}</p>
                                <p>{edu.institution} {edu.year && `(${edu.year})`}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="divider"></div>
                <p className="font-semibold text-base mb-2">Certifications & Licenses</p>
                <ul className="list-disc list-inside space-y-1">
                    {specialist.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                </ul>
            </DetailSection>

            <Card>
                <h3 className="font-bold text-neutral text-lg mb-3">Settings & Tools</h3>
                 <div className="space-y-1">
                     <div className="flex justify-between items-center p-2 rounded-lg">
                        <div className="flex items-center space-x-2">{ICONS.calendar}<span>Sync with Device Calendar</span></div>
                        <input type="checkbox" className="toggle toggle-primary" checked={isCalendarSynced} onChange={handleCalendarSyncToggle}/>
                    </div>
                    <button onClick={onStartPreview} className="w-full btn btn-outline btn-secondary mt-4">
                        View as Seeker
                    </button>
                </div>
            </Card>

            <PrototypeFeedbackCard />
        </div>
    );
};

export default SpecialistProfileScreen;