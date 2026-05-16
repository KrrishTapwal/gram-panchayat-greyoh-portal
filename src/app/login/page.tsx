'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, Shield, UserPlus, Building2 } from 'lucide-react'
import { useAuth }     from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

type Mode = 'citizen-login' | 'citizen-register' | 'admin-login'

function LoginForm() {
  const router       = useRouter()
  const params       = useSearchParams()
  const initialMode  = params.get('mode') === 'admin' ? 'admin-login' : 'citizen-login'

  const [mode,     setMode]     = useState<Mode>(initialMode)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [phone,    setPhone]    = useState('')
  const [ward,     setWard]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [loading,  setLoading]  = useState(false)

  const { login, register, isAdmin } = useAuth()
  const { t } = useLanguage()

  const wards = [
    'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5',
    'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'citizen-register') {
        if (!name || !email || !password || !ward) {
          setError(t('common.required'))
          return
        }
        await register(name, email, password, phone, ward)
        setSuccess(t('auth.registerSuccess'))
        setTimeout(() => setMode('citizen-login'), 2000)
      } else {
        await login(email, password)
        router.push(mode === 'admin-login' ? '/admin' : '/')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('Invalid credentials') || msg.includes('Login failed')) {
        setError(t('auth.loginError'))
      } else if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('Email already registered. Please login.')
      } else {
        setError(msg || t('common.error'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-black text-2xl">ग</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-900">{t('siteName')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('siteSubtitle')}</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1 mb-6 shadow-sm">
          <button
            onClick={() => { setMode('citizen-login'); setError(''); setSuccess('') }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              mode === 'citizen-login' || mode === 'citizen-register'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn size={15} />
            {t('auth.citizenLogin')}
          </button>
          <button
            onClick={() => { setMode('admin-login'); setError(''); setSuccess('') }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              mode === 'admin-login'
                ? 'bg-saffron-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield size={15} />
            Admin / Pradhan
          </button>
        </div>

        {/* Card */}
        <div className="card p-8">
          {mode === 'admin-login' && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
              <Building2 size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{t('auth.adminLoginNote')}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'citizen-register' && (
              <>
                <div>
                  <label className="label">{t('auth.name')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-field"
                    placeholder="Ramesh Kumar"
                    required
                  />
                </div>
                <div>
                  <label className="label">{t('auth.phone')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="label">{t('auth.ward')}</label>
                  <select value={ward} onChange={e => setWard(e.target.value)} className="select-field" required>
                    <option value="">Select Ward</option>
                    {wards.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="label">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-11"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-colors
                ${mode === 'admin-login'
                  ? 'bg-saffron-600 hover:bg-saffron-700'
                  : 'bg-navy-900 hover:bg-navy-800'
                } disabled:opacity-60 disabled:cursor-not-allowed shadow-lg`}
            >
              {loading
                ? t('common.loading')
                : mode === 'citizen-register'
                  ? t('auth.registerButton')
                  : t('auth.loginButton')}
            </button>
          </form>

          {/* Toggle Register/Login */}
          {mode !== 'admin-login' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'citizen-login' ? 'citizen-register' : 'citizen-login')
                  setError('')
                  setSuccess('')
                }}
                className="text-sm text-navy-900 hover:underline font-medium"
              >
                {mode === 'citizen-login'
                  ? t('auth.switchToRegister')
                  : t('auth.switchToLogin')}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By logging in you agree to the terms of the Gram Panchayat Greyoh Digital Portal.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
