'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, CheckCircle2, Copy, Clock, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth }     from '@/contexts/AuthContext'
import { submitComplaint, Category, ComplaintType, Priority } from '@/lib/api'

const WARDS = ['Ward 1','Ward 2','Ward 3','Ward 4','Ward 5','Ward 6','Ward 7','Ward 8','Ward 9','Ward 10']

export default function ComplaintsPage() {
  const { t } = useLanguage()
  const { profile } = useAuth()

  const [form, setForm] = useState({
    name:        profile?.name ?? '',
    ward:        profile?.ward ?? '',
    category:    '' as Category,
    type:        'complaint' as ComplaintType,
    description: '',
    priority:    'medium' as Priority,
  })
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [trackingId,  setTrackingId]  = useState('')
  const [copied,      setCopied]      = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.ward || !form.category || !form.description) {
      setError(t('common.required'))
      return
    }
    setLoading(true)
    setError('')

    try {
      const tid = await submitComplaint({
        ...form,
        trackingId: '',
        userId:     profile?.id ?? 'anonymous',
        status:     'pending',
      })
      setTrackingId(tid)
    } catch {
      setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const copyId = () => {
    navigator.clipboard.writeText(trackingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reset = () => {
    setTrackingId('')
    setForm({ name: profile?.name ?? '', ward: profile?.ward ?? '', category: '' as Category, type: 'complaint', description: '', priority: 'medium' })
  }

  if (trackingId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full card p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{t('complaints.success.title')}</h2>
          <p className="text-slate-500 text-sm mb-6">{t('complaints.success.message')}</p>

          <div className="bg-navy-50 border border-navy-200 rounded-xl p-5 mb-6">
            <p className="text-xs font-semibold text-navy-600 uppercase tracking-wide mb-2">
              {t('complaints.success.trackingId')}
            </p>
            <div className="flex items-center justify-between gap-2 bg-white border border-navy-300 rounded-xl px-4 py-3">
              <code className="text-navy-900 font-bold text-lg tracking-wider">{trackingId}</code>
              <button
                onClick={copyId}
                className="text-navy-600 hover:text-navy-900 transition-colors p-1"
                title={t('common.copyId')}
              >
                {copied ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {copied ? t('common.copied') : 'Save this ID to track your complaint status'}
            </p>
          </div>

          <div className="flex gap-3">
            <Link href={`/complaints/track?id=${trackingId}`} className="btn-primary flex-1 justify-center">
              <Clock size={16} />
              {t('complaints.success.trackNow')}
            </Link>
            <button onClick={reset} className="btn-secondary flex-1 justify-center">
              {t('complaints.success.submitAnother')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={24} className="text-saffron-400" />
            <h1 className="text-2xl font-bold">{t('complaints.title')}</h1>
          </div>
          <p className="text-blue-200">{t('complaints.subtitle')}</p>
          <div className="mt-4">
            <Link href="/complaints/track" className="inline-flex items-center gap-2 text-sm
              text-blue-200 hover:text-white transition-colors">
              Already submitted? Track your complaint <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="card p-6 md:p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type Selector */}
            <div>
              <label className="label">{t('complaints.form.type')}</label>
              <div className="grid grid-cols-3 gap-3">
                {(['complaint','feedback','requirement'] as ComplaintType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('type', type)}
                    className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                      form.type === type
                        ? type === 'complaint'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : type === 'feedback'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t(`complaints.types.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="label">{t('complaints.form.name')}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  className="input-field"
                  placeholder={t('complaints.form.namePlaceholder')}
                  required
                />
              </div>

              {/* Ward */}
              <div>
                <label className="label">{t('complaints.form.ward')}</label>
                <select value={form.ward} onChange={e => set('ward', e.target.value)} className="select-field" required>
                  <option value="">{t('complaints.form.wardPlaceholder')}</option>
                  {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="label">{t('complaints.form.category')}</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className="select-field" required>
                  <option value="">{t('complaints.form.categoryPlaceholder')}</option>
                  {(['water','electricity','road','garbage','drainage','health','education','agriculture','other'] as Category[]).map(c => (
                    <option key={c} value={c}>{t(`complaints.categories.${c}`)}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="label">{t('complaints.form.priority')}</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['low','medium','high','urgent'] as Priority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => set('priority', p)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        form.priority === p
                          ? p === 'urgent' ? 'bg-red-600 border-red-600 text-white'
                            : p === 'high' ? 'bg-orange-500 border-orange-500 text-white'
                            : p === 'medium' ? 'bg-amber-500 border-amber-500 text-white'
                            : 'bg-slate-500 border-slate-500 text-white'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {t(`complaints.priorities.${p}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">{t('complaints.form.description')}</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                className="input-field min-h-[120px] resize-none"
                placeholder={t('complaints.form.descriptionPlaceholder')}
                rows={5}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3 shadow-lg shadow-navy-900/20"
            >
              {loading ? t('complaints.form.submitting') : t('complaints.form.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
