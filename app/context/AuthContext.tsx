"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  username: string;
  role: string;
  full_name: string;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null; // <-- PERUBAHAN 1: Tambahkan ini
  login: (userData: UserData, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Inisialisasi User
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) {
        try { return JSON.parse(savedUser); } catch { return null; }
      }
    }
    return null;
  });

  // PERUBAHAN 2: Tambahkan state token agar bisa diakses komponen lain
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('access_token');
    }
    return null;
  });

  const login = (userData: UserData, token: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setToken(token); // <-- Update state token saat login
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setToken(null); // <-- Reset state token saat logout
    window.location.href = '/login';
  };

  return (
    // PERUBAHAN 3: Masukkan token ke dalam Provider value
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};