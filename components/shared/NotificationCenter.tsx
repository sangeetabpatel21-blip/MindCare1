

import React, { useState } from 'react';
// FIX: Corrected import path for local module.
import { ICONS } from '../../constants';
// FIX: Corrected import path for local module.
import { useAppContext } from '../../context/AppContext';

const NotificationCenter: React.FC = () => {
    const { notifications, markNotificationAsRead } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleToggle = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <button onClick={handleToggle} className="btn btn-ghost btn-circle">
                <div className="indicator">
                    {ICONS.bell}
                    {unreadCount > 0 && <span className="indicator-item badge badge-secondary badge-xs">{unreadCount}</span>}
                </div>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 border">
                    <div className="p-3 font-bold border-b">Notifications</div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(n => (
                            <div key={n.id} className={`p-3 border-b hover:bg-base-200 cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`} onClick={() => markNotificationAsRead(n.id)}>
                                <p className={`text-sm ${!n.read ? 'font-semibold text-neutral' : 'text-gray-600'}`}>{n.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                            </div>
                        )) : (
                            <p className="p-4 text-sm text-gray-500">No new notifications.</p>
                        )}
                    </div>
                     <div className="p-2 text-center">
                        <button className="text-sm text-primary font-semibold">View All</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;