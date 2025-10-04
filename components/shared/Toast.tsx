


import React, { useEffect } from 'react';
// FIX: Corrected import path for local module.
import { useAppContext } from '../../context/AppContext';
// FIX: Corrected import path for local module.
import { IToast } from '../../context/AppContext';

const ToastContainer: React.FC = () => {
  const { toasts, user } = useAppContext();

  useEffect(() => {
    const soundToast = toasts.find(t => t.playSound);
    if (soundToast && user) {
        // In a real app, you would use an audio library to play a sound.
        // Here, we simulate it with a console log.
        console.log(`🎵 Playing notification sound: ${user.notificationSound}`);
    }
  }, [toasts, user]);


  if (toasts.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
        case 'success': return '✓';
        case 'error': return '✕';
        default: return 'i';
    }
  }
   const getBgColor = (type: string) => {
    switch (type) {
        case 'success': return 'alert-success';
        case 'error': return 'alert-error';
        default: return 'alert-info';
    }
  }

  return (
    <div className="toast toast-top toast-center z-[9999]">
      {toasts.map(toast => (
        <div key={toast.id} className={`alert ${getBgColor(toast.type)} text-white shadow-lg`}>
          <div className='flex items-center space-x-2'>
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;