import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserRole } from './types';
import { AppProvider } from './context/AppContext';
import ToastContainer from './components/shared/Toast';
import WelcomeScreen from './components/shared/WelcomeScreen';
import AuthScreen from './components/auth/AuthScreen';
import PatientApp from './components/patient/PatientApp';
import SpecialistApp from './components/specialist/SpecialistApp';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [isPreviewing, setIsPreviewing] = useState(false);

    const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasFinishedLoading = useRef(false);

    const handleFinishLoading = useCallback(() => {
        if (hasFinishedLoading.current) return;
        hasFinishedLoading.current = true;

        if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
        }

        try {
            const storedUser = localStorage.getItem('mindcare_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.role && user.loggedIn) {
                    setUserRole(user.role as UserRole);
                    setIsAuthenticated(true);
                }
            }
        } catch (error) {
            console.error("Could not access or parse localStorage:", error);
            localStorage.removeItem('mindcare_user');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Automatically transition after a delay, but can be skipped by user action
        loadingTimerRef.current = setTimeout(handleFinishLoading, 1500);
        
        return () => {
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
        };
    }, [handleFinishLoading]);

    const handleLogin = (role: UserRole) => {
        try {
            // Set loggedIn to true upon any successful auth action
            localStorage.setItem('mindcare_user', JSON.stringify({ role: role, loggedIn: true }));
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
        setUserRole(role);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('mindcare_user');
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
        setUserRole(null);
        setIsAuthenticated(false);
        setIsPreviewing(false);
    };

    const handleStartPreview = () => {
        setIsPreviewing(true);
    };

    const handleEndPreview = () => {
        setIsPreviewing(false);
    };
    
    const renderAppContent = () => {
        if (!isAuthenticated || !userRole) {
            return <AuthScreen onLogin={handleLogin} />;
        }

        if (isPreviewing) {
            return <PatientApp onLogout={handleLogout} onEndPreview={handleEndPreview} />;
        }

        switch (userRole) {
            case UserRole.Seeker:
                return <PatientApp onLogout={handleLogout} />;
            case UserRole.Specialist:
                return <SpecialistApp onLogout={handleLogout} onStartPreview={handleStartPreview} />;
            default:
                return <AuthScreen onLogin={handleLogin} />;
        }
    };
    
    if (isLoading) {
        return <WelcomeScreen onFinish={handleFinishLoading} />;
    }

    return (
        <AppProvider>
            <div className="min-h-screen font-sans antialiased flex flex-col">
                {renderAppContent()}
                <ToastContainer />
            </div>
        </AppProvider>
    );
};

export default App;
