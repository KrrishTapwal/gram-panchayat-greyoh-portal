'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type UserRole = 'citizen' | 'admin' | 'pradhan'

export interface UserProfile {
  id:        string
  name:      string
  email:     string
  phone?:    string
  ward?:     string
  role:      UserRole
  createdAt: string
}

interface AuthContextType {
  profile:       UserProfile | null
  loading:       boolean
  isAdmin:       boolean
  login:         (email: string, password: string) => Promise<void>
  register:      (name: string, email: string, password: string, phone: string, ward: string) => Promise<void>
  logout:        () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setProfile(data.user)
      } else {
        setProfile(null)
      }
    } catch {
      setProfile(null)
    }
  }

  useEffect(() => {
    fetchMe().finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    setProfile(data.user)
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    ward: string
  ) => {
    const res = await fetch('/api/auth/register', {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ name, email, password, phone, ward }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Registration failed')
    setProfile(data.user)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setProfile(null)
  }

  const refreshProfile = async () => {
    await fetchMe()
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'pradhan'

  return (
    <AuthContext.Provider value={{ profile, loading, isAdmin, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
