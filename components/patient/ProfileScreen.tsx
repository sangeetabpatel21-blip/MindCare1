import React, { useState } from 'react';
import Card from '../shared/Card';
// FIX: Corrected import path for local module.
import { ICONS } from '../../constants';
// FIX: Corrected import path for local module.
import { HomeworkTask, Patient } from '../../types';
// FIX: Corrected import path for local module.
import { useAppContext } from '../../context/AppContext';
import TimePickerModal from '../shared/TimePickerModal';
import PrototypeFeedbackCard from '../shared/PrototypeFeedbackCard';


interface ProfileScreenProps {
    onNavigate: (screen: string, params?: any) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
    const { user, homeworkTasks, toggleTaskCompletion, setTaskReminder, lastSessionSummary, setNotificationSound, updateUserProfile, addToast } = useAppContext();
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<HomeworkTask | null>(null);

    const handleOpenTimePicker = (task: HomeworkTask) => {
        setSelectedTask(task);
        setIsTimePickerOpen(true);
    };

    const handleSetReminder = (time: string) => {
        if (!selectedTask) return;
        setTaskReminder(selectedTask.id, time);
        setIsTimePickerOpen(false);
        setSelectedTask(null);
    };
    
    const handleWidgetToggle = () => {
        const isEnabling = !user?.isWidgetEnabled;
        updateUserProfile({ isWidgetEnabled: isEnabling });
        addToast(isEnabling ? "Home screen widget enabled." : "Home screen widget disabled.", 'info', false);
    };

    const handleCalendarSyncToggle = () => {
        const isEnabling = !user?.autoSyncCalendar;
        updateUserProfile({ autoSyncCalendar: isEnabling });
        addToast(isEnabling ? "Automatic calendar sync enabled." : "Automatic calendar sync disabled.", 'info', false);
    };

    if (!user) return null;

    const hasProfileDetails = user.about || user.location || user.age;

    return (
        <div className="p-4 space-y-4">
             {isTimePickerOpen && selectedTask && <TimePickerModal onClose={() => setIsTimePickerOpen(false)} onSet={handleSetReminder} initialTime={selectedTask.reminderTime}/>}
            <div className="relative flex flex-col items-center space-y-2">
                <button onClick={() => onNavigate('edit-profile')} className="absolute top-0 right-0 btn btn-ghost btn-sm btn-circle" aria-label="Edit Profile">
                    {ICONS.edit}
                </button>
                <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        {user.isAnonymous ? (
                            <div className="bg-base-300 text-base-content p-4">{ICONS.anonymousUser}</div>
                        ) : (
                            <img src={user.avatarUrl} alt={user.name} />
                        )}
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral">{user.name}</h2>
            </div>
            
            {hasProfileDetails && (
                <Card>
                    <h3 className="font-bold text-neutral mb-2">About Me</h3>
                    <div className="text-sm space-y-2">
                        {user.location && <p><strong>Location:</strong> {user.location}</p>}
                        {user.age && <p><strong>Age:</strong> {user.age}</p>}
                        {user.about && <p className="text-gray-700 mt-1 whitespace-pre-wrap">{user.about}</p>}
                    </div>
                </Card>
            )}

            <Card>
                <h3 className="font-bold text-neutral mb-3">Integrations</h3>
                <div className="space-y-3">
                    <div className="form-control">
                        <label className="label cursor-pointer p-0">
                            <span className="label-text font-semibold">Add 'Work To Do' as a Home Widget</span>
                             <input 
                                type="checkbox" 
                                className="toggle toggle-primary"
                                checked={user.isWidgetEnabled}
                                onChange={handleWidgetToggle}
                            />
                        </label>
                         <p className="text-xs text-gray-500">See and complete your wellness tasks directly from your phone's home screen.</p>
                    </div>
                     <div className="form-control">
                        <label className="label cursor-pointer p-0">
                            <span className="label-text font-semibold">Automatically Sync All Tasks to Calendar</span>
                            <input 
                                type="checkbox" 
                                className="toggle toggle-primary"
                                checked={user.autoSyncCalendar}
                                onChange={handleCalendarSyncToggle}
                            />
                        </label>
                        <p className="text-xs text-gray-500">All tasks from your wellness plan will be automatically added to your default calendar app.</p>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="font-bold text-neutral mb-3">Settings</h3>
                <div className="space-y-2">
                    <div className="p-2 rounded-lg">
                         <label className="label-text font-semibold">Notification Sound</label>
                         <select 
                            className="select select-bordered select-sm w-full mt-1"
                            value={user.notificationSound}
                            onChange={(e) => setNotificationSound(e.target.value as Patient['notificationSound'])}
                        >
                            <option value="default">Default Chime</option>
                            <option value="melody">Melody</option>
                            <option value="urgent">Urgent Alert</option>
                        </select>
                    </div>
                     <div onClick={() => onNavigate('appointments')} className="flex justify-between items-center p-2 rounded-lg hover:bg-base-200 cursor-pointer">
                        <span>Appointment History</span>
                        <span className="text-gray-400">&gt;</span>
                    </div>
                    <div onClick={() => onNavigate('security')} className="flex justify-between items-center p-2 rounded-lg hover:bg-base-200 cursor-pointer">
                        <span>Security & Privacy</span>
                        <span className="text-gray-400">&gt;</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-base-200 cursor-pointer">
                        <span>Account Information</span>
                        <span className="text-gray-400">&gt;</span>
                    </div>
                </div>
            </Card>

            <PrototypeFeedbackCard />
        </div>
    );
};

export default ProfileScreen;