"use client";

import type { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

// Mock user for a non-authenticated experience
const mockUser: User = {
  uid: 'mock-user',
  email: 'user@example.com',
  displayName: 'Friend',
  photoURL: null,
  emailVerified: true,
  isAnonymous: true,
  metadata: {},
  providerData: [],
  providerId: 'mock',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
};


type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ user, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
