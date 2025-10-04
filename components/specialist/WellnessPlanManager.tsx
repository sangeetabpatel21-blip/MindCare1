

import React, { useState } from 'react';
// FIX: Corrected import path for local module.
import { HomeworkTask, Patient } from '../../types';
// FIX: Corrected import path for local module.
import { MOCK_HOMEWORK_TASKS } from '../../constants';
import Card from '../shared/Card';

interface WellnessPlanManagerProps {
    patient: Patient;
}

const WellnessPlanManager: React.FC<WellnessPlanManagerProps> = ({ patient }) => {
    const [tasks, setTasks] = useState<HomeworkTask[]>(MOCK_HOMEWORK_TASKS);
    const [newTask, setNewTask] = useState('');

    const handleAddTask = () => {
        if (newTask.trim() === '') return;
        const task: HomeworkTask = {
            id: `h${Date.now()}`,
            task: newTask.trim(),
            completed: false,
            source: 'specialist',
        };
        setTasks([...tasks, task]);
        setNewTask('');
    };

    const handleRemoveTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    }

    return (
        <div className="p-4 space-y-4">
            <Card>
                <h3 className="font-bold text-neutral mb-3">Manage Wellness Plan for {patient.name}</h3>
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    className="checkbox checkbox-primary"
                                    readOnly // Specialist can't complete, only patient
                                />
                                <p className={`ml-3 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-neutral'}`}>
                                    {task.task}
                                </p>
                            </div>
                            <button onClick={() => handleRemoveTask(task.id)} className="btn btn-ghost btn-xs btn-circle">✕</button>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                 <h3 className="font-bold text-neutral mb-2">Add New Task</h3>
                 <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="e.g., Journal for 10 minutes"
                        className="w-full input input-bordered"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    <button onClick={handleAddTask} className="btn btn-primary">Add</button>
                 </div>
            </Card>
        </div>
    );
};

export default WellnessPlanManager;