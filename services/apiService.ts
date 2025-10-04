import { Specialist, Patient } from '../types';
import { MOCK_SPECIALISTS, MOCK_PATIENTS } from '../constants';

const API_LATENCY = 500; // 500ms delay to simulate network

/**
 * Simulates fetching a list of specialists from a backend server.
 */
export const getSpecialists = (): Promise<Specialist[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_SPECIALISTS);
        }, API_LATENCY);
    });
};

/**
 * Simulates fetching a list of patients for a specialist.
 */
export const getPatients = (): Promise<Patient[]> => {
     return new Promise(resolve => {
        setTimeout(() => {
            resolve(MOCK_PATIENTS);
        }, API_LATENCY);
    });
}
