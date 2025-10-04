import { Specialist, Appointment, Patient, HomeworkTask, ChatMessage, SessionNote } from './types';

export const ICONS = {
    home: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-1.5" /></svg>,
    chat: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    journal: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    profile: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    send: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    mic: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
    star: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
    filter: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L12 14.414V19a1 1 0 01-1.447.894L7 18.25V14.414L3.293 6.707A1 1 0 013 6V4z" /></svg>,
    bell: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    messages: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    brain: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9a4.5 4.5 0 00-4.5 4.5v.5a4.5 4.5 0 109 0v-.5A4.5 4.5 0 0012 9zm0 0a4.5 4.5 0 014.5 4.5v.5a4.5 4.5 0 11-9 0v-.5A4.5 4.5 0 0112 9zm0 0V6m0 12v-3m-6.364-6.364L7.05 7.05m9.9 9.9l-1.414-1.414M4.929 16.071l1.414-1.414m9.9-9.9l1.414 1.414M19.071 4.929L17.657 6.343" /></svg>,
    upload: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>,
    plus: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>,
    video: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    mapPin: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    share: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    alert: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    briefcase: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    tag: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l4 4a2 2 0 010 2.82l-5 5A2 2 0 0110 16H5a2 2 0 01-2-2V5c0-1.1.9-2 2-2zm0 0l6 6" /></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    headphone: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 10a6 6 0 11-12 0v8h12v-8zM9 14v1a3 3 0 003 3h0a3 3 0 003-3v-1" /></svg>,
    bookOpen: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    edit: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>,
    anonymousUser: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>,
    videoCall: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    voiceCall: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    attach: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>,
    education: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>,
    certificate: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.611-1.377A12.02 12.02 0 0012 21.056a12.02 12.02 0 003.389-.395L21 20.417A12.02 12.02 0 0017.618 5.984z" /></svg>,
    analytics: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>,
};

export const MOCK_SPECIALISTS: Specialist[] = [
    {
        id: 's1', name: 'Dr. Anjali Sharma', title: 'Clinical Psychologist, PhD', type: 'Psychologist', avatarUrl: 'https://i.pravatar.cc/150?u=s1',
        specialties: ['Anxiety', 'Depression', 'Trauma'], sessionFee: 150, avgRating: 4.9,
        availability: 'available', modes: ['Online', 'In-person'], experience: 12, languages: ['English', 'Hindi'], avgSessions: '8-12 sessions',
        location: '123 Wellness Ave, Suite 101, Mumbai, MH',
        about: "With over a decade of experience, I specialize in cognitive-behavioral therapy (CBT) to help individuals navigate anxiety, depression, and trauma.",
        professionalStatement: "My approach is collaborative and evidence-based, tailored to your unique needs. I believe in creating a safe and non-judgmental space where we can explore challenges and build resilience together. My goal is to empower you with practical skills to manage your mental health and lead a more fulfilling life.",
        approach: "My primary therapeutic approach is Cognitive Behavioral Therapy (CBT), integrated with mindfulness-based techniques. I focus on identifying and challenging negative thought patterns and behaviors, while also incorporating practices that promote present-moment awareness and self-compassion.",
        education: [
            { degree: "PhD in Clinical Psychology", institution: "National Institute of Mental Health and Neurosciences (NIMHANS)", year: 2012 },
            { degree: "MA in Psychology", institution: "University of Delhi", year: 2008 },
        ],
        certifications: [
            "Certified Cognitive Behavioral Therapist",
            "Trauma-Focused CBT Certified",
        ],
        reviews: [{ id: 'r1', patientName: 'Arjun S.', rating: 5, comment: 'Dr. Sharma is incredibly insightful and compassionate. She has helped me develop practical coping skills.', date: '2024-07-15' }]
    },
    {
        id: 's2', name: 'Mr. Vikram Singh', title: 'Licensed Counselor, MA', type: 'Counselor', avatarUrl: 'https://i.pravatar.cc/150?u=s2',
        specialties: ['Relationships', 'Stress Management'], sessionFee: 120, avgRating: 4.8,
        availability: 'available', modes: ['Online'], experience: 8, languages: ['English'], avgSessions: '6-10 sessions',
        about: "I focus on helping clients improve their relationships and manage life's stressors. Using a person-centered approach, I provide a supportive space for growth and self-discovery.",
        professionalStatement: "I believe that everyone has the capacity for growth and change. My role as a counselor is to facilitate that process by offering empathy, unconditional positive regard, and genuine support. We will work together to explore your feelings, identify your strengths, and develop strategies for overcoming obstacles.",
        approach: "I primarily use a Person-Centered and Humanistic approach, which means our sessions will be guided by your needs and goals. I also integrate techniques from Solution-Focused Brief Therapy (SFBT) to help you identify and build upon your existing strengths and resources.",
        education: [
            { degree: "MA in Counseling Psychology", institution: "Tata Institute of Social Sciences (TISS)", year: 2016 },
        ],
        certifications: [
            "Licensed Professional Counselor (LPC)",
            "Certified in Gottman Method Couples Therapy - Level 1",
        ],
        reviews: [{ id: 'r2', patientName: 'Priya K.', rating: 5, comment: 'Vikram has been a great help in navigating my relationship issues. Highly recommend.', date: '2024-06-20' }]
    },
    {
        id: 's3', name: 'Dr. Meera Desai', title: 'Psychiatrist, MD', type: 'Psychiatrist', avatarUrl: 'https://i.pravatar.cc/150?u=s3',
        specialties: ['ADHD', 'Mood Disorders', 'Medication Management'], sessionFee: 200, avgRating: 4.9,
        availability: 'unavailable', modes: ['In-person'], experience: 15, languages: ['English', 'Gujarati'], avgSessions: 'Ongoing',
        location: '456 Health St, Ahmedabad, GJ',
        about: "As a psychiatrist, I provide comprehensive evaluations and medication management for a range of mental health conditions. I work closely with my patients to create effective and sustainable treatment plans.",
        professionalStatement: "My practice is founded on a holistic approach to mental health. While medication can be a crucial tool, I also emphasize the importance of therapy, lifestyle adjustments, and a strong support system. I work collaboratively with patients and their therapists to ensure a comprehensive treatment plan that addresses all aspects of their well-being.",
        approach: "My approach is primarily psychopharmacological, meaning I specialize in the use of medication to treat mental health conditions. This is always combined with supportive therapy and psychoeducation to ensure you are an active and informed participant in your treatment.",
        education: [
            { degree: "MD in Psychiatry", institution: "All India Institute of Medical Sciences (AIIMS)", year: 2009 },
            { degree: "MBBS", institution: "B. J. Medical College", year: 2005 },
        ],
        certifications: [
            "Board Certified in Psychiatry",
            "Fellow of the Indian Psychiatric Society",
        ],
        reviews: []
    },
    {
        id: 's4', name: 'Dr. Priya Rao', title: 'Child & Adolescent Therapist, LCSW', type: 'Therapist', avatarUrl: 'https://i.pravatar.cc/150?u=s4',
        specialties: ['Child Psychology', 'Adolescent Issues', 'Family Therapy', 'ADHD'], sessionFee: 130, avgRating: 4.8,
        availability: 'available', modes: ['Online', 'In-person'], experience: 9, languages: ['English'], avgSessions: '10-15 sessions',
        location: '789 Harmony Rd, Bengaluru, KA',
        about: "I am dedicated to supporting children, adolescents, and their families through life's challenges using play therapy and evidence-based techniques.",
        professionalStatement: "My passion is creating a safe, engaging, and supportive therapeutic environment for young people. I believe in a family-systems approach, working collaboratively with parents and children to foster better communication, understanding, and emotional regulation. Together, we can build a foundation for lifelong mental wellness.",
        approach: "I utilize a blend of Play Therapy, Cognitive Behavioral Therapy (CBT), and family therapy techniques. For younger children, play is the primary language of expression. For adolescents, I adapt CBT to be relatable and focus on practical skill-building for issues like anxiety, depression, and social challenges.",
        education: [
            { degree: "MSW, Clinical Concentration", institution: "Christ University, Bengaluru", year: 2015 },
        ],
        certifications: [
            "Licensed Clinical Social Worker (LCSW)",
            "Registered Play Therapist (RPT)",
        ],
        reviews: [{ id: 'r4', patientName: 'S. Iyer (Parent)', rating: 5, comment: 'Dr. Rao has been wonderful with our son. She is patient, creative, and has given us great tools to use at home.', date: '2024-05-10' }]
    },
    {
        id: 's5', name: 'Mr. David Chen', title: 'Geriatric Psychiatric Nurse, PMHNP', type: 'Mental Healthcare Nurse', avatarUrl: 'https://i.pravatar.cc/150?u=s5',
        specialties: ['Geriatric Psychiatry', 'Dementia Care', 'Medication Management', 'Grief Counseling'], sessionFee: 110, avgRating: 4.7,
        availability: 'available', modes: ['In-person'], experience: 20, languages: ['English', 'Mandarin'], avgSessions: 'Ongoing',
        location: '101 Golden Years Plaza, Kolkata, WB',
        about: "With 20 years of experience, I provide compassionate mental healthcare for older adults, focusing on quality of life and holistic well-being.",
        professionalStatement: "Caring for the mental health of our elders is a privilege. I specialize in diagnosing and managing psychiatric conditions in older adults, paying close attention to the interplay between physical and mental health. My approach is patient, respectful, and always centered on the individual's dignity and unique life story.",
        approach: "As a Psychiatric-Mental Health Nurse Practitioner (PMHNP), I provide both medication management and supportive psychotherapy. I have extensive experience in managing psychotropic medications in the elderly, always with a 'start low, go slow' philosophy. I also incorporate reminiscence therapy and behavioral interventions to support patients and their caregivers.",
        education: [
            { degree: "MSN, Psychiatric-Mental Health Nurse Practitioner", institution: "Johns Hopkins University", year: 2004 },
        ],
        certifications: [
            "Board Certified Psychiatric-Mental Health Nurse Practitioner (PMHNP-BC)",
        ],
        reviews: []
    },
    {
        id: 's6', name: 'Ms. Aisha Khan', title: 'Clinical Social Worker, LICSW', type: 'Mental Healthcare Social Worker', avatarUrl: 'https://i.pravatar.cc/150?u=s6',
        specialties: ['Trauma', 'Emergency Mental Health', 'Grief Counseling'], sessionFee: 95, avgRating: 4.9,
        availability: 'available', modes: ['Online'], experience: 7, languages: ['English', 'Urdu'], avgSessions: 'Varies',
        about: "I specialize in providing support for individuals who have experienced trauma and loss, offering a safe space for healing and recovery.",
        professionalStatement: "My practice is grounded in the belief that resilience is inherent in all of us. I work with clients to navigate the difficult aftermath of traumatic events and periods of intense grief. Using a trauma-informed lens, I help individuals process their experiences, reclaim their narrative, and build a path forward.",
        approach: "I am trained in Eye Movement Desensitization and Reprocessing (EMDR) and Trauma-Focused Cognitive Behavioral Therapy (TF-CBT). I also integrate mindfulness and somatic techniques to help clients reconnect with their bodies and regulate their nervous systems. My work is strength-based and client-centered.",
        education: [
            { degree: "Master of Social Work (MSW)", institution: "Aligarh Muslim University", year: 2017 },
        ],
        certifications: [
            "Licensed Independent Clinical Social Worker (LICSW)",
            "Certified in EMDR",
        ],
        reviews: [{ id: 'r6', patientName: 'Anonymous', rating: 5, comment: 'Aisha is a deeply empathetic and skilled therapist. I felt safe and understood for the first time.', date: '2024-07-01' }]
    },
     {
        id: 's7', name: 'Dr. Ben Carter', title: 'General Practitioner, MD', type: 'Physician', avatarUrl: 'https://i.pravatar.cc/150?u=s7',
        specialties: ['Mental Wellness', 'Initial Assessment', 'Holistic Health'], sessionFee: 100, avgRating: 4.6,
        availability: 'unavailable', modes: ['In-person'], experience: 18, languages: ['English'], avgSessions: '1-3 sessions',
        location: '22 HealthFirst Clinic, Pune, MH',
        about: "As a GP with a special interest in mental health, I provide initial assessments and focus on the connection between mind and body for overall wellness.",
        professionalStatement: "I believe primary care is the frontline of mental health. Many individuals first present with physical symptoms that are linked to underlying stress, anxiety, or depression. My goal is to provide a comprehensive initial assessment, rule out physical causes, and create a holistic health plan. I often serve as a bridge, helping patients get comfortable with the idea of mental healthcare and referring them to specialized therapists or psychiatrists when needed.",
        approach: "My approach is integrative and psychoeducational. I focus on lifestyle medicine—nutrition, exercise, sleep hygiene—as a foundation for mental well-being. I conduct thorough initial assessments to understand the complete picture of a patient's health and provide education on how physical and mental health are interconnected.",
        education: [
            { degree: "MD, Family Medicine", institution: "Armed Forces Medical College (AFMC)", year: 2006 },
        ],
        certifications: [
            "Board Certified in Family Medicine",
            "Certificate in Primary Care Behavioral Health",
        ],
        reviews: [{ id: 'r7', patientName: 'Amit V.', rating: 5, comment: 'Dr. Carter was the first doctor to really listen to my stress. He helped me see the bigger picture of my health.', date: '2024-04-22' }]
    },
    {
        id: 's8', name: 'Dr. Emily Gonzalez', title: 'Neuropsychologist, PhD', type: 'Psychologist', avatarUrl: 'https://i.pravatar.cc/150?u=s8',
        specialties: ['Neuropsychological Testing', 'Brain Injury', 'Cognitive Disorders', 'Neuro'],
        sessionFee: 250, avgRating: 5.0,
        availability: 'available', modes: ['In-person'], experience: 11, languages: ['English', 'Spanish'], avgSessions: 'Assessment-based',
        location: '300 Cortex Center, New Delhi, DL',
        about: "I specialize in assessing cognitive functions to understand how brain health impacts behavior and emotion. My work is focused on diagnostics and treatment planning.",
        professionalStatement: "As a neuropsychologist, I bridge the gap between neurology and psychology. I conduct comprehensive assessments to evaluate memory, attention, executive function, and other cognitive abilities. These evaluations are crucial for diagnosing conditions like ADHD, dementia, and the cognitive effects of traumatic brain injury (TBI). The results provide a clear roadmap for targeted therapeutic interventions and support.",
        approach: "My work is highly diagnostic and data-driven. I administer a battery of standardized tests to create a detailed cognitive profile. Following the assessment, I provide a comprehensive report and a feedback session to explain the findings and collaborate with the patient, their family, and their treatment team on the best path forward.",
        education: [
            { degree: "PhD in Clinical Psychology (Neuropsychology Track)", institution: "University of California, Los Angeles", year: 2013 },
        ],
        certifications: [
            "Board Certified in Clinical Neuropsychology (ABCN)",
        ],
        reviews: [{ id: 'r8', patientName: 'Family of J. Doe', rating: 5, comment: 'Dr. Gonzalez\'s assessment was incredibly thorough and finally gave us the answers we were looking for. Her explanation was clear and compassionate.', date: '2024-06-30' }]
    }
];

export const MOCK_TRANSCRIPT_A3 = `Specialist: Hi Arjun, welcome. How have things been since our last session?
Patient: Hi Dr. Sharma. It's been a mixed week. The project at work is still really stressful. I had that big presentation, and I felt my anxiety spike a lot beforehand. I used that 4-7-8 breathing technique you showed me, which helped a bit.
Specialist: That's great to hear you applied the technique. Can you tell me more about the anxiety? What did it feel like?
Patient: It's like a tightness in my chest, and my thoughts start racing. I worry I'm going to mess up, that everyone's judging me. I even had trouble sleeping the night before.
Specialist: That sounds very challenging. It seems like the work stress is a significant theme. We've talked about negative self-talk before. Did you notice any of that happening?
Patient: Oh, definitely. I was thinking, "I'm not prepared enough," "I'm going to fail." It's a familiar pattern.
Specialist: Acknowledging that pattern is a huge step. For our next step, let's focus on challenging those thoughts. I'd like you to try writing down one positive thing that happened at work each day. It can be small. It's a way to start shifting that focus.
Patient: Okay, I can try that. Just one positive thing... that seems manageable.`;


export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'a1', patientId: 'p1', patientName: 'Arjun Sharma', specialist: { name: 'Dr. Anjali Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=s1' },
        date: new Date().toISOString().split('T')[0], time: '10:00 AM', mode: 'Online', status: 'Upcoming', type: 'Full'
    },
    {
        id: 'a2', patientId: 'p2', patientName: 'Priya Kumar', specialist: { name: 'Dr. Anjali Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=s1' },
        date: new Date().toISOString().split('T')[0], time: '11:30 AM', mode: 'In-person', location: '123 Wellness Ave, Suite 101', status: 'Upcoming', type: 'Full'
    },
    {
        id: 'a3', patientId: 'p1', patientName: 'Arjun Sharma', specialist: { name: 'Dr. Anjali Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=s1' },
        date: '2024-07-15', time: '10:00 AM', mode: 'Online', status: 'Completed', type: 'Full',
        analysis: { sentiment: 'Mixed', keyThemes: ['Work Stress', 'Anxiety about future'], suggestedTasks: ['Practice 5-minute mindfulness daily', 'Journal about one positive thing each day'] },
        transcript: MOCK_TRANSCRIPT_A3,
        noteId: 'sn1',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Mock URL
    },
     {
        id: 'a4', patientId: 'p3', patientName: 'Aarav Mehta', specialist: { name: 'Mr. Vikram Singh', avatarUrl: 'https://i.pravatar.cc/150?u=s2' },
        date: '2024-07-28', time: '02:00 PM', mode: 'Online', status: 'Pending Payment', type: 'Full'
    },
     {
        id: 'a5', patientId: 'p5', patientName: 'Leo Dias', specialist: { name: 'Dr. Anjali Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=s1' },
        date: '2024-07-10', time: '03:00 PM', mode: 'Online', status: 'Completed', type: 'Full'
    },
];

export const MOCK_PATIENTS: Patient[] = [
    { id: 'p1', name: 'Arjun Sharma', avatarUrl: 'https://i.pravatar.cc/150?u=p1', lastSession: '2024-07-15', nextAppointment: '2024-07-29', unreadMessages: 2, tags: ['Anxiety', 'New Patient'], notificationSound: 'default', isAnonymous: false, age: 28, location: 'Mumbai, IN', isProgressShared: true, isWidgetEnabled: false, autoSyncCalendar: false },
    { id: 'p2', name: 'Priya Kumar', avatarUrl: 'https://i.pravatar.cc/150?u=p2', lastSession: '2024-07-18', nextAppointment: '2024-08-01', tags: ['Depression'], notificationSound: 'melody', hasNegativeMoodTrend: true, isWidgetEnabled: false, autoSyncCalendar: false },
    { id: 'p3', name: 'Aarav Mehta', avatarUrl: 'https://i.pravatar.cc/150?u=p3', lastSession: '2024-07-12', unreadMessages: 0, tags: ['Maintenance'], notificationSound: 'default', isWidgetEnabled: false, autoSyncCalendar: false },
    { id: 'p4', name: 'Sana Khan', avatarUrl: 'https://i.pravatar.cc/150?u=p4', lastSession: '2024-07-20', tags: ['Anxiety'], notificationSound: 'default', isWidgetEnabled: false, autoSyncCalendar: false },
    { id: 'p5', name: 'Leo Dias', avatarUrl: 'https://i.pravatar.cc/150?u=p5', lastSession: '2024-07-10', tags: ['Stress'], notificationSound: 'default', isWidgetEnabled: false, autoSyncCalendar: false },
];

export const MOCK_LAST_SESSION_SUMMARY = {
    date: '2024-07-15',
    summary: [
        'Discussed increasing feelings of anxiety related to workload and project deadlines.',
        'Explored the connection between work stress and difficulty sleeping.',
        'Identified a pattern of negative self-talk when feeling overwhelmed.',
        'Action Plan: Practice a 5-minute breathing exercise before starting the workday.'
    ]
};

export const MOCK_HOMEWORK_TASKS: HomeworkTask[] = [
    { id: 'h1', task: 'Practice the 4-7-8 breathing exercise twice a day.', completed: false, source: 'specialist', appLink: { screen: 'engagement', params: { view: 'toolkit', toolId: 'breathing' }, actionText: 'Start Exercise' } },
    { id: 'h2', task: 'Write one journal entry about your feelings this week.', completed: false, source: 'specialist', appLink: { screen: 'engagement', params: { view: 'journal' }, actionText: 'Open Journal' } },
    { id: 'h3', task: 'Go for a 15-minute walk without your phone.', completed: false, source: 'specialist' },
];

export const MOCK_CHAT_MESSAGES: { [patientId: string]: ChatMessage[] } = {
    'p1': [
        { id: 'c1', sender: 'specialist', text: 'Hi Arjun, just checking in to see how you felt after our last session.', timestamp: '2024-07-16T10:00:00Z' },
        { id: 'c2', sender: 'patient', text: 'Much better, thank you! The breathing exercise really helped before my presentation.', timestamp: '2024-07-16T14:30:00Z' },
    ],
    'p2': []
};

// FIX: Added missing constants for Journal, Mood Logger, Community, and Session Notes.
// This resolves import errors in multiple components.

// For Journal and Mood Logger
export const MOODS = [
    { name: 'Ecstatic', icon: '😁' },
    { name: 'Happy', icon: '😊' },
    { name: 'Neutral', icon: '😐' },
    { name: 'Sad', icon: '😔' },
    { name: 'Anxious', icon: '😟' },
];

// For Journal Screen customization
export const JOURNAL_COLORS = ['#FFFFFF', '#F0FDFA', '#FEFCE8', '#F1F5F9', '#FFF7ED', '#FAF5FF'];
export const JOURNAL_PATTERNS = [
    { name: 'None', class: '' },
    { name: 'Dots', class: 'pattern-dots' },
    { name: 'Lines', class: 'pattern-lines' },
    { name: 'Zigzag', class: 'pattern-zigzag' },
];

// For App Context and Session Notes
export const MOCK_TASK_SUGGESTIONS: { id: string; task: string; icon: string; }[] = [
    { id: 'sugg1', task: 'Meditate for 5 minutes', icon: '🧘' },
    { id: 'sugg2', task: 'Write in my journal', icon: '📓' },
    { id: 'sugg3', task: 'Go for a 15-minute walk', icon: '🚶' },
    { id: 'sugg4', task: 'Practice deep breathing', icon: '🌬️' },
    { id: 'sugg5', task: 'Reach out to a friend', icon: '💬' },
    { id: 'sugg6', task: 'List 3 things I am grateful for', icon: '🙏' }
];

export const MOCK_SESSION_NOTES: SessionNote[] = [
    {
        id: 'sn1',
        appointmentId: 'a3',
        patientId: 'p1',
        date: '2024-07-15',
        status: 'draft',
        transcript: MOCK_TRANSCRIPT_A3,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        progressNoteFormat: 'SOAP',
        progressNote: {
            subjective: 'Patient reports a "mixed week" with significant stress from a work project and anxiety before a big presentation. Describes a tightness in the chest, racing thoughts, and worry about being judged. Also reported difficulty sleeping the night before the presentation.',
            objective: 'Patient applied the 4-7-8 breathing technique which provided some relief. Acknowledged a familiar pattern of negative self-talk (e.g., "I\'m not prepared enough," "I\'m going to fail.").'
        },
        processNote: 'Patient seems receptive to CBT techniques and is becoming more aware of cognitive distortions. The connection between work stress and anxiety symptoms is clear. Building on self-monitoring skills will be key. Good rapport established.',
        assignedTasks: [
            { id: 'h4', task: 'Write down one positive thing that happened at work each day.', completed: false, source: 'specialist' }
        ],
        messageSent: 'Hi Arjun, just checking in. Hope you\'re finding the daily positive reflection helpful. Let me know if anything comes up.',
        followUpSuggestion: 'in 2 weeks'
    }
];