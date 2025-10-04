import React, { useState } from 'react';
import Card from '../shared/Card';
import { ICONS, MOCK_TASK_SUGGESTIONS } from '../../constants';
import { useAppContext } from '../../context/AppContext';
import { HomeworkTask } from '../../types';
import TimePickerModal from '../shared/TimePickerModal';

interface WellnessPlanCardProps {
    onNavigate: (screen: string, params?: any) => void;
}

interface AddTaskInputProps {
    newTask: string;
    setNewTask: (task: string) => void;
    handleAddTask: () => void;
    setShowInput: (show: boolean) => void;
}

const AddTaskInput: React.FC<AddTaskInputProps> = ({ newTask, setNewTask, handleAddTask, setShowInput }) => {
    const handleSuggestionClick = (text: string) => {
        setNewTask(text);
    };
    
    const filteredSuggestions = MOCK_TASK_SUGGESTIONS.filter(suggestion => 
        newTask.length > 0 && suggestion.task.toLowerCase().includes(newTask.toLowerCase()) && suggestion.task.toLowerCase() !== newTask.toLowerCase()
    );

    return (
        <div className="mt-3 pt-3 border-t">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="e.g., Meditate for 5 minutes"
                    className="w-full input input-bordered input-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    autoFocus
                />
                <button onClick={handleAddTask} className="btn btn-primary btn-sm">Add</button>
            </div>
            {filteredSuggestions.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                        {filteredSuggestions.map((suggestion) => (
                            <button
                                key={suggestion.id}
                                onClick={() => handleSuggestionClick(suggestion.task)}
                                className="btn btn-xs btn-ghost text-left"
                            >
                                {suggestion.icon} {suggestion.task}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <button onClick={() => setShowInput(false)} className="btn btn-ghost btn-xs mt-2">Cancel</button>
        </div>
    );
};


const WellnessPlanCard: React.FC<WellnessPlanCardProps> = ({ onNavigate }) => {
    const { homeworkTasks, toggleTaskCompletion, addHomeworkTask, setTaskReminder, setTaskAddedToCalendar, addToast } = useAppContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [newTask, setNewTask] = useState('');
    
    // State for calendar integration
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<HomeworkTask | null>(null);

    const handleAddTask = () => {
        if (newTask.trim()) {
            addHomeworkTask(newTask.trim());
            setNewTask('');
            setShowInput(false);
        }
    };
    
    const formatTime = (timeStr: string | undefined): string => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const m = parseInt(minutes, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHours = h % 12 || 12;
        const formattedMinutes = m.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
    
    const isTaskLocked = (task: HomeworkTask): boolean => {
        if (!task.reminderTime) return false;
        const now = new Date();
        const [hours, minutes] = task.reminderTime.split(':').map(Number);
        const taskTime = new Date();
        taskTime.setHours(hours, minutes, 0, 0);
        return now < taskTime;
    };

    const generateCalendarLink = (task: HomeworkTask) => {
        if (!task.reminderTime) return;

        const today = new Date();
        const [hours, minutes] = task.reminderTime.split(':').map(Number);
        const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
        const endTime = new Date(startTime.getTime() + 15 * 60000); // 15 minute duration

        const toGoogleISO = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const title = encodeURIComponent(`MindCare: ${task.task}`);
        const details = task.appLink 
            ? encodeURIComponent(`Complete your MindCare wellness task.\n\nOpen in app: https://mindcare.app/open?screen=${task.appLink.screen}&params=${JSON.stringify(task.appLink.params)}`)
            : encodeURIComponent('Complete your MindCare wellness task.');
        
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${toGoogleISO(startTime)}/${toGoogleISO(endTime)}&details=${details}`;
        
        window.open(url, '_blank');
        setTaskAddedToCalendar(task.id);
        addToast('Follow the new tab to add to your calendar.', 'info');
    };

    const handleCalendarClick = (task: HomeworkTask) => {
        setSelectedTask(task);
        if (task.reminderTime) {
            generateCalendarLink(task);
        } else {
            setIsTimePickerOpen(true);
        }
    };

    const handleSetReminder = (time: string) => {
        if (!selectedTask) return;
        setTaskReminder(selectedTask.id, time);
        setIsTimePickerOpen(false);
        setSelectedTask(null);
        addToast('Reminder time set! Click the calendar icon again to add it to your calendar.', 'info');
    };

    // Case 1: No tasks.
    if (homeworkTasks.length === 0) {
        return (
            <Card>
                {isTimePickerOpen && selectedTask && <TimePickerModal onClose={() => setIsTimePickerOpen(false)} onSet={handleSetReminder} initialTime={selectedTask.reminderTime} />}
                <h3 className="font-bold text-neutral">Work To Do</h3>
                 <p className="text-sm text-gray-500 my-3">
                    This is where your tasks will appear. Specialists can assign them, or you can add your own to stay organized.
                </p>
                {!showInput ? (
                     <button onClick={() => setShowInput(true)} className="btn btn-primary btn-sm w-full">
                        {ICONS.plus} Add a task
                    </button>
                ) : <AddTaskInput 
                        newTask={newTask} 
                        setNewTask={setNewTask} 
                        handleAddTask={handleAddTask} 
                        setShowInput={setShowInput} 
                    />}
            </Card>
        );
    }
    
    const incompleteTasks = homeworkTasks.filter(task => !task.completed);

    // Case 2: All tasks are complete.
    if (incompleteTasks.length === 0) {
        return (
            <Card>
                {isTimePickerOpen && selectedTask && <TimePickerModal onClose={() => setIsTimePickerOpen(false)} onSet={handleSetReminder} initialTime={selectedTask.reminderTime} />}
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-neutral">Work To Do</h3>
                     {!showInput && (
                        <button onClick={() => setShowInput(true)} className="btn btn-ghost btn-sm">
                            {ICONS.plus} Add Task
                        </button>
                    )}
                </div>
                 <div className="flex items-center space-x-2 text-green-700 bg-green-100 p-3 rounded-lg mt-2">
                    <span>🎉</span>
                    <p className="text-sm font-semibold">You've completed all your tasks. Great job!</p>
                </div>
                {showInput && <AddTaskInput 
                                newTask={newTask} 
                                setNewTask={setNewTask} 
                                handleAddTask={handleAddTask} 
                                setShowInput={setShowInput} 
                             />}
            </Card>
        );
    }
    
    // Case 3: There are incomplete tasks.
    const tasksToShow = isExpanded ? incompleteTasks : incompleteTasks.slice(0, 3);
    const showToggleButton = incompleteTasks.length > 3;
    
    return (
        <Card>
            {isTimePickerOpen && selectedTask && <TimePickerModal onClose={() => setIsTimePickerOpen(false)} onSet={handleSetReminder} initialTime={selectedTask.reminderTime} />}
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-neutral">Work To Do</h3>
                {showToggleButton && !showInput && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)} 
                        className="btn btn-ghost btn-sm"
                    >
                        {isExpanded ? 'Show Less' : `Show All (${incompleteTasks.length})`}
                    </button>
                )}
            </div>
            <div className="space-y-3">
                {tasksToShow.map(task => {
                    const locked = isTaskLocked(task);
                    return (
                        <div key={task.id} className="p-2 bg-base-200 rounded-lg flex items-start justify-between">
                            <div className="flex items-start">
                                <div className="tooltip" data-tip={locked ? `Available at ${formatTime(task.reminderTime)}` : 'Mark as complete'}>
                                    <input 
                                        type="checkbox" 
                                        checked={task.completed} 
                                        onChange={() => toggleTaskCompletion(task.id)}
                                        className="checkbox checkbox-primary mt-1"
                                        disabled={locked}
                                    />
                                </div>
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 flex-shrink-0" title={task.source === 'specialist' ? 'Assigned by Specialist' : 'Added by You'}>
                                            {task.source === 'specialist' ? ICONS.briefcase : ICONS.profile}
                                        </div>
                                        <p className={`text-sm ${locked ? 'text-gray-400' : 'text-neutral'}`}>{task.task}</p>
                                    </div>
                                    {task.appLink && (
                                        <button 
                                            onClick={() => onNavigate(task.appLink.screen, task.appLink.params)}
                                            className="text-xs text-secondary font-semibold hover:underline ml-6"
                                        >
                                            {task.appLink.actionText || 'Start Exercise'} &rarr;
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                               {task.reminderTime && <span className="text-xs font-semibold text-primary">{formatTime(task.reminderTime)}</span>}
                               <button onClick={() => handleCalendarClick(task)} className={`btn btn-ghost btn-xs btn-circle ${task.addedToCalendar ? 'text-success' : ''}`} title="Add to Calendar">
                                   🗓️
                               </button>
                            </div>
                        </div>
                    );
                })}
            </div>
             {!showInput ? (
                <button onClick={() => setShowInput(true)} className="btn btn-ghost btn-sm w-full mt-3">
                    {ICONS.plus} Add your own task
                </button>
            ) : <AddTaskInput 
                    newTask={newTask} 
                    setNewTask={setNewTask} 
                    handleAddTask={handleAddTask} 
                    setShowInput={setShowInput} 
                />}
        </Card>
    );
};

export default WellnessPlanCard;