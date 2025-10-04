import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import { ICONS } from '../../constants';

interface DailyFocusCardProps {
    onNavigate: (screen: string, params?: any) => void;
}

const DailyFocusCard: React.FC<DailyFocusCardProps> = ({ onNavigate }) => {
    const { user, appointments, homeworkTasks } = useAppContext();

    const focusPrompt = useMemo(() => {
        // 1. Check for appointment tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        const appointmentTomorrow = appointments.find(app => app.date === tomorrowStr && app.status === 'Upcoming');
        if (appointmentTomorrow) {
            return {
                icon: '🗓️',
                title: "Prepare for Tomorrow",
                description: `Your session with ${appointmentTomorrow.specialist.name} is tomorrow. Take a moment to journal your thoughts.`,
                actionText: "Go to Journal",
                action: () => onNavigate('engagement', { view: 'journal' })
            };
        }

        // 2. Check for an incomplete wellness task and link directly to it if possible
        const incompleteTask = homeworkTasks.find(task => !task.completed);
        if (incompleteTask) {
            // If the task has a direct link within the app, use it
            if (incompleteTask.appLink) {
                return {
                    icon: '🎯',
                    title: "One Small Step",
                    description: "Let's complete one wellness task today. How about this one?",
                    task: incompleteTask.task,
                    actionText: incompleteTask.appLink.actionText || "Get Started",
                    action: () => onNavigate(incompleteTask.appLink!.screen, incompleteTask.appLink!.params)
                };
            }
            // Fallback for tasks without a direct link
            return {
                icon: '🎯',
                title: "One Small Step",
                description: "Let's complete one wellness task today. How about this one?",
                task: incompleteTask.task,
                actionText: "View Wellness Plan",
                action: () => onNavigate('profile')
            };
        }

        // 3. Default: General mood check-in / journal prompt
        return {
            icon: '☀️',
            title: "Today's Focus",
            description: "How are you feeling today? A quick journal entry can help you reflect and set your intention for the day.",
            actionText: "Write in Journal",
            action: () => onNavigate('engagement', { view: 'journal' })
        };
    }, [appointments, homeworkTasks, onNavigate]);

    if (!user) return null;

    return (
        <Card className="bg-gradient-to-br from-primary to-teal-600 text-white">
            <div className="flex items-center space-x-4 mb-4">
                 <span className="text-4xl">{focusPrompt.icon}</span>
                 <div>
                    <h2 className="text-xl font-bold">Today's Focus, {user.name.split(' ')[0]}!</h2>
                    <p className="text-sm opacity-90">{focusPrompt.description}</p>
                 </div>
            </div>
            {focusPrompt.task && (
                 <div className="p-3 bg-white/20 rounded-lg mb-4 text-sm font-medium">
                    {focusPrompt.task}
                </div>
            )}
            <button
                onClick={focusPrompt.action}
                className="w-full btn bg-white text-primary border-none hover:bg-gray-200"
            >
                {focusPrompt.actionText}
            </button>
        </Card>
    );
};

export default DailyFocusCard;
