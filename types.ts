import { FunctionCall } from '@google/genai';

export enum UserRole {
  Seeker = 'seeker',
  Specialist = 'specialist',
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  functionCall?: FunctionCall;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'patient' | 'specialist';
  timestamp: string;
}

export interface Education {
    degree: string;
    institution: string;
    year?: number;
}

export interface Specialist {
  id:string;
  name: string;
  title: string;
  type: string;
  avatarUrl: string;
  specialties: string[];
  sessionFee: number;
  avgRating: number;
  reviews: Review[];
  availability: 'available' | 'unavailable';
  modes: ('Online' | 'In-person')[];
  location?: string; // For in-person sessions
  about: string; // Short bio for cards
  professionalStatement: string; // Detailed version for profile page
  approach: string; // Therapeutic approach
  education: Education[];
  certifications: string[];
  experience: number;
  languages: string[];
  avgSessions: string;
}

export interface Review {
    id: string;
    patientName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface SpecialistFilters {
  specialties: string[];
  modes: string[];
  type: string;
  availability: 'available' | 'unavailable';
}

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    specialist: {
        name: string;
        avatarUrl: string;
    };
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    mode: 'Online' | 'In-person';
    location?: string;
    status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Pending Payment' | 'Request Sent' | 'Request Declined';
    type: 'Full' | 'Introductory';
    analysis?: SessionAnalysis;
    transcript?: string;
    noteId?: string;
    audioUrl?: string;
}

export interface Patient {
    id: string;
    name: string;
    avatarUrl: string;
    lastSession: string;
    nextAppointment?: string;
    unreadMessages?: number;
    tags?: string[];
    notificationSound: 'default' | 'melody' | 'urgent';
    // New optional fields for user profile customization
    location?: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
    education?: string;
    profession?: string;
    occupationExperience?: string;
    hobbies?: string;
    about?: string;
    isAnonymous?: boolean;
    isProgressShared?: boolean;
    hasNegativeMoodTrend?: boolean;
    isWidgetEnabled?: boolean;
    autoSyncCalendar?: boolean;
}

export interface JournalEntry {
    id: string;
    date: string;
    content: string;
    mood?: string;
    color?: string;
    pattern?: string;
}

export interface HomeworkTask {
    id: string;
    task: string;
    completed: boolean;
    source?: 'specialist' | 'user';
    reminderTime?: string; // HH:MM
    addedToCalendar?: boolean;
    appLink?: {
        screen: string;
        params?: any;
        actionText?: string;
    };
}

export interface SessionAnalysis {
    sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Mixed';
    keyThemes: string[];
    suggestedTasks: string[];
}

export interface SOAPNote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export interface BIRPNote {
    behavior: string;
    intervention: string;
    response: string;
    plan: string;
}

export interface SessionNote {
    id: string;
    appointmentId: string;
    patientId: string;
    date: string;
    status: 'draft' | 'finalized';
    
    // The full transcript and audio for reference
    transcript: string;
    audioUrl?: string;

    // The structured, editable notes
    progressNoteFormat: 'SOAP' | 'BIRP';
    progressNote: Partial<SOAPNote & BIRPNote>;
    processNote: string;

    // Post-session actions taken by the specialist
    assignedTasks?: HomeworkTask[];
    messageSent?: string;
    followUpSuggestion?: string;
}


export interface Notification {
    id: string;
    text: string;
    time: string;
    read: boolean;
}

export interface AppointmentRequest {
    id: string;
    patient: Patient;
    specialist: Specialist;
    status: 'pending' | 'accepted' | 'declined';
    type: 'immediate' | 'specific_time' | 'next_available' | 'introductory';
    requestedDate?: string;
    requestedTime?: string;
    requestedMode?: 'Online' | 'In-person';
    location?: string;
}