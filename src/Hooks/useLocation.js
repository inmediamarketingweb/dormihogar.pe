// src/Hooks/useLocation.js
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
    departamento: 'departamento',
    provincia: 'provincia',
    distrito: 'distrito',
    agencia: 'agencia',
    sede: 'sede',
    nombres: 'nombres'
};

export function useLocation() {
    const [location, setLocation] = useState(() => ({
        departamento: localStorage.getItem(STORAGE_KEYS.departamento) || '',
        provincia: localStorage.getItem(STORAGE_KEYS.provincia) || '',
        distrito: localStorage.getItem(STORAGE_KEYS.distrito) || '',
        agencia: localStorage.getItem(STORAGE_KEYS.agencia) || '',
        sede: localStorage.getItem(STORAGE_KEYS.sede) || '',
        nombres: localStorage.getItem(STORAGE_KEYS.nombres) || ''
    }));

    const updateLocation = useCallback((key, value) => {
        setLocation(prev => {
            const newLocation = { ...prev, [key]: value };
            if (value) {
                localStorage.setItem(key, value);
            } else {
                localStorage.removeItem(key);
            }
            // Disparar evento para otros componentes
            window.dispatchEvent(new CustomEvent('locationUpdated', { 
                detail: { key, value, location: newLocation }
            }));
            return newLocation;
        });
    }, []);

    const updateMultiple = useCallback((updates) => {
        setLocation(prev => {
            const newLocation = { ...prev, ...updates };
            Object.entries(updates).forEach(([key, value]) => {
                if (value) {
                    localStorage.setItem(key, value);
                } else {
                    localStorage.removeItem(key);
                }
            });
            window.dispatchEvent(new CustomEvent('locationUpdated', { 
                detail: { updates, location: newLocation }
            }));
            return newLocation;
        });
    }, []);

    const clearLocation = useCallback(() => {
        const keys = Object.values(STORAGE_KEYS);
        keys.forEach(key => localStorage.removeItem(key));
        const emptyLocation = {
            departamento: '',
            provincia: '',
            distrito: '',
            agencia: '',
            sede: '',
            nombres: ''
        };
        setLocation(emptyLocation);
        window.dispatchEvent(new CustomEvent('locationUpdated', { 
            detail: { location: emptyLocation, clear: true }
        }));
    }, []);

    // Escuchar cambios desde otros componentes
    useEffect(() => {
        const handleStorageChange = (e) => {
            const key = e.key;
            if (Object.values(STORAGE_KEYS).includes(key)) {
                setLocation(prev => ({
                    ...prev,
                    [key]: e.newValue || ''
                }));
            }
        };

        const handleLocationUpdated = (e) => {
            if (e.detail.location) {
                setLocation(e.detail.location);
            } else if (e.detail.key !== undefined) {
                setLocation(prev => ({
                    ...prev,
                    [e.detail.key]: e.detail.value || ''
                }));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('locationUpdated', handleLocationUpdated);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('locationUpdated', handleLocationUpdated);
        };
    }, []);

    return {
        location,
        updateLocation,
        updateMultiple,
        clearLocation,
        departamento: location.departamento,
        provincia: location.provincia,
        distrito: location.distrito,
        agencia: location.agencia,
        sede: location.sede,
        nombres: location.nombres
    };
}
