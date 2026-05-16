'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Language, getTranslation } from '@/translations'

interface LanguageContextType {
  language:      Language
  setLanguage:   (lang: Language) => void
  toggleLanguage: () => void
  t:             (key: string) => string
  isHindi:       boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>('hi')

  // Persist preference
  useEffect(() => {
    const saved = localStorage.getItem('gp-lang') as Language | null
    if (saved === 'en' || saved === 'hi') setLangState(saved)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLangState(lang)
    localStorage.setItem('gp-lang', lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'hi' : 'en')
  }, [language, setLanguage])

  const t = useCallback(
    (key: string) => getTranslation(language, key),
    [language]
  )

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t, isHindi: language === 'hi' }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider')
  return ctx
}
