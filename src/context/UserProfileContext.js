import React, { createContext, useContext, useState } from 'react';

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
    const [userProfile, setUserProfile] = useState({
        name: '',
        age: '',
        sex: '',
        height: '',
        weight: '',
        medicalHistory: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
            email: ''
        }
    });

    const updateProfile = (newData) => {
        setUserProfile(prev => ({
            ...prev,
            ...newData
        }));
    };

    return (
        <UserProfileContext.Provider value={{ userProfile, updateProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    return useContext(UserProfileContext);
} 