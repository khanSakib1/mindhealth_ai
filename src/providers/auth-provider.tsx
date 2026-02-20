"use client";

import type { User } from "firebase/auth";
import React, { createContext, useContext } from "react";

// Since we have no auth, we'll use a static user object.
const guestUser: User = {
  uid: "guest-user",
  email: "guest@example.com",
  displayName: "Guest",
  photoURL: null,
  emailVerified: true,
  isAnonymous: true,
  metadata: {} as User["metadata"],
  providerData: [],
  providerId: "anonymous",
  tenantId: null,
  refreshToken: "",
  phoneNumber: null,
  delete: async () => {},
  getIdToken: async () => "",
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
  const value = { user: guestUser, loading: false };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
