import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { supabase } from '../supabase';
import { User, SubscriptionPlan } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    token: string | null;
    logout: () => void;
    refetchUser: (newPlan?: SubscriptionPlan) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);

    const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
        const { data, error } = await supabase
            .from('users')
            .select('*, companies(*, licenses(*))')
            .eq('id', firebaseUser.uid)
            .single();

        if (error) {
            console.error("Error fetching user profile:", error);
            await auth.signOut();
            return null;
        }
        return data as User;
    }, []);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const jwt = await firebaseUser.getIdToken();
                setToken(jwt);
                // Define o token JWT para o cliente Supabase, que o usará para todas as requisições futuras.
                // Isto funciona como um "middleware" do lado do cliente.
                await supabase.auth.setSession({ access_token: jwt, refresh_token: 'dummy' });

                const userProfile = await fetchUserProfile(firebaseUser);
                setUser(userProfile);

            } else {
                // Usuário deslogado
                setUser(null);
                setToken(null);
                await supabase.auth.signOut();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [fetchUserProfile]);

    const logout = async () => {
        await auth.signOut();
    };

    const refetchUser = useCallback(async (newPlan?: SubscriptionPlan) => {
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
            console.log(`Refetching user data for ${firebaseUser.email}. New plan: ${newPlan}`);
            const userProfile = await fetchUserProfile(firebaseUser);
            setUser(userProfile);
        }
    }, [fetchUserProfile]);

    const value = { user, loading, token, logout, refetchUser };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Hook dedicado para obter apenas o token JWT, conforme solicitado.
export const useAuthToken = (): string | null => {
    const { token } = useAuth();
    return token;
};
