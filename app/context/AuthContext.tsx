"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  username: string;
  role: string;
  full_name: string;
}

interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // MENGATASI MASALAH: Gunakan fungsi inisialisasi langsung di useState
  const [user, setUser] = useState<UserData | null>(() => {
    // Karena Next.js berjalan di Server dulu, kita harus cek apakah 'window' tersedia
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (error) {
          console.error("Gagal parsing data user:", error);
          return null;
        }
      }
    }
    return null;
  });

  // useEffect sekarang kosong dari setUser untuk data awal, 
  // sehingga tidak ada lagi 'cascading renders'
  useEffect(() => {
    // Anda bisa menggunakan ini untuk sinkronisasi lain di masa depan jika perlu
  }, []);

  const login = (userData: UserData, token: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};