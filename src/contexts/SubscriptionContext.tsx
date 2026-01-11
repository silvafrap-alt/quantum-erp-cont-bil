import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type Subscription = {
  plan: string;
  status: string;
} | null;

type SubscriptionContextType = {
  subscription: Subscription;
  loading: boolean;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // 🔹 MOCK temporário (depois ligamos ao Supabase)
    setSubscription({
      plan: "free",
      status: "active",
    });

    setLoading(false);
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
