import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Patient, Appointment, Notification, HomeworkTask, AppointmentRequest, Specialist, SessionAnalysis, SessionNote, ChatMessage } from '../types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_HOMEWORK_TASKS, MOCK_LAST_SESSION_SUMMARY, MOCK_SESSION_NOTES, MOCK_CHAT_MESSAGES, MOCK_SPECIALISTS } from '../constants';

export interface IToast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  playSound?: boolean;
}

interface AppContextType {
  user: Patient | null;
  specialist: Specialist | null;
  appointments: Appointment[];
  notifications: Notification[];
  toasts: IToast[];
  homeworkTasks: HomeworkTask[];
  lastSessionSummary: { date: string, summary: string[] };
  appointmentRequests: AppointmentRequest[];
  sessionNotes: SessionNote[];
  chatMessages: { [patientId: string]: ChatMessage[] };
  addToast: (message: string, type?: IToast['type'], playSound?: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addHomeworkTask: (taskText: string) => void;
  setTaskReminder: (id: string, time: string) => void;
  setTaskAddedToCalendar: (id: string) => void;
  setNotificationSound: (sound: Patient['notificationSound']) => void;
  updateUserProfile: (updatedProfile: Partial<Patient>) => void;
  updateSpecialistProfile: (updatedProfile: Partial<Specialist>) => void;
  sendAppointmentRequest: (details: any) => void;
  confirmAppointmentByPayment: (appointmentId: string) => void;
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  addSessionAnalysis: (appointmentId: string, analysis: SessionAnalysis) => void;
  addOrUpdateSessionNote: (note: SessionNote) => void;
  sendSpecialistMessage: (patientId: string, text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Patient | null>(MOCK_PATIENTS[0]);
  const [specialist, setSpecialist] = useState<Specialist | null>(MOCK_SPECIALISTS[0]);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', text: 'Your request for a session with Dr. Sharma has been sent.', time: '2 hours ago', read: false },
    { id: 'n2', text: 'Reminder: You have an upcoming session tomorrow.', time: '1 day ago', read: true },
  ]);
  const [toasts, setToasts] = useState<IToast[]>([]);
  const [homeworkTasks, setHomeworkTasks] = useState<HomeworkTask[]>(MOCK_HOMEWORK_TASKS);
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);
  const [sessionNotes, setSessionNotes] = useState<SessionNote[]>(MOCK_SESSION_NOTES);
  const [chatMessages, setChatMessages] = useState<{ [patientId: string]: ChatMessage[] }>(MOCK_CHAT_MESSAGES);

  const addToast = useCallback((message: string, type: IToast['type'] = 'info', playSound: boolean = true) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, playSound }]);
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const toggleTaskCompletion = (id: string) => {
    setHomeworkTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addHomeworkTask = (taskText: string) => {
    const newTask: HomeworkTask = {
        id: `h-user-${Date.now()}`,
        task: taskText,
        completed: false,
        source: 'user'
    };
    setHomeworkTasks(prev => [...prev, newTask]);
    addToast('Task added!', 'success');
  };

  const setTaskReminder = (id: string, time: string) => {
    setHomeworkTasks(prev => prev.map(t => t.id === id ? { ...t, reminderTime: time } : t));
    addToast('Reminder set successfully!', 'success');
  };
  
  const setTaskAddedToCalendar = (id: string) => {
    setHomeworkTasks(prev => prev.map(t => t.id === id ? { ...t, addedToCalendar: true } : t));
  };
  
  const setNotificationSound = (sound: Patient['notificationSound']) => {
    if (user) {
        setUser({ ...user, notificationSound: sound });
    }
  };

  const updateUserProfile = (updatedProfile: Partial<Patient>) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const newUser = { ...prevUser, ...updatedProfile };
        // In a real app, you'd save this to a backend/localStorage
        console.log("Updated user profile:", newUser);
        return newUser;
    });
    addToast('Profile updated successfully!', 'success');
  };
  
  const updateSpecialistProfile = (updatedProfile: Partial<Specialist>) => {
    setSpecialist(prev => prev ? { ...prev, ...updatedProfile } : null);
    addToast('Profile updated successfully!', 'success');
  };

  const sendAppointmentRequest = (details: { specialist: Specialist, type: AppointmentRequest['type'] }) => {
    const newRequest: AppointmentRequest = {
        id: `req-${Date.now()}`,
        patient: user!,
        specialist: details.specialist,
        status: 'pending',
        ...details
    };
    setAppointmentRequests(prev => [newRequest, ...prev]);
    addToast(`Request sent to ${details.specialist.name}`, 'success');
    setNotifications(prev => [{ id: `n-${Date.now()}`, text: `Your request to ${details.specialist.name} has been sent.`, time: 'Just now', read: false }, ...prev]);
  };
  
  const confirmAppointmentByPayment = (appointmentId: string) => {
      setAppointments(prev => prev.map(app => app.id === appointmentId ? {...app, status: 'Upcoming'} : app));
      addToast('Appointment confirmed!', 'success');
  }

  const acceptRequest = (requestId: string) => {
      const request = appointmentRequests.find(r => r.id === requestId);
      if (!request) return;

      // 1. Mark the request as accepted
      setAppointmentRequests(prev => prev.map(r => r.id === requestId ? {...r, status: 'accepted'} : r));
      
      // 2. Create a new appointment for the client with "Pending Payment" status
      const newAppointment: Appointment = {
          id: `app-${Date.now()}`,
          patientId: request.patient.id,
          patientName: request.patient.name,
          specialist: {
              name: request.specialist.name,
              avatarUrl: request.specialist.avatarUrl,
          },
          date: request.requestedDate || new Date().toISOString().split('T')[0],
          time: request.requestedTime || 'N/A',
          mode: request.requestedMode || 'Online',
          status: 'Pending Payment',
          // FIX: The 'type' property was missing. An appointment can be 'Full' or 'Introductory'.
          // This is derived from the original AppointmentRequest type.
          type: request.type === 'introductory' ? 'Introductory' : 'Full',
      };
      setAppointments(prev => [newAppointment, ...prev]);

      addToast(`Request from ${request.patient.name} accepted. Awaiting payment.`, 'success');
  }
  
  const declineRequest = (requestId: string) => {
      setAppointmentRequests(prev => prev.map(r => r.id === requestId ? {...r, status: 'declined'} : r));
      addToast('Request declined.', 'info');
  }
  
  const addSessionAnalysis = (appointmentId: string, analysis: SessionAnalysis) => {
      setAppointments(prev => prev.map(app => app.id === appointmentId ? {...app, analysis} : app));
  };
  
  const addOrUpdateSessionNote = (note: SessionNote) => {
      setSessionNotes(prev => {
          const existingNoteIndex = prev.findIndex(n => n.id === note.id);
          if (existingNoteIndex > -1) {
              const updatedNotes = [...prev];
              updatedNotes[existingNoteIndex] = note;
              return updatedNotes;
          }
          return [note, ...prev];
      });
  };

  const sendSpecialistMessage = (patientId: string, text: string) => {
      const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: 'specialist',
          text,
          timestamp: new Date().toISOString()
      };
      setChatMessages(prev => {
          const patientMessages = prev[patientId] || [];
          return { ...prev, [patientId]: [...patientMessages, newMessage] };
      });
  };

  return (
    <AppContext.Provider value={{ 
        user, specialist, appointments, notifications, toasts, homeworkTasks, lastSessionSummary: MOCK_LAST_SESSION_SUMMARY, appointmentRequests, sessionNotes, chatMessages,
        addToast, markNotificationAsRead, toggleTaskCompletion, addHomeworkTask, setTaskReminder, setTaskAddedToCalendar, setNotificationSound, updateUserProfile, updateSpecialistProfile, sendAppointmentRequest, confirmAppointmentByPayment, acceptRequest, declineRequest, addSessionAnalysis, addOrUpdateSessionNote, sendSpecialistMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};