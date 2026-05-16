'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, MessageSquare, CheckCircle2, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth }     from '@/contexts/AuthContext'
import {
  getAllComplaints, updateComplaintStatus,
  Complaint, ComplaintStatus,
} from '@/lib/api'
import Badge          from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState     from '@/components/ui/EmptyState'
import { format }     from 'date-fns'

export default function AdminComplaintsPage() {
  const { t }        = useLanguage()
  const { profile }  = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filterWard, setFilterWard] = useState('')
  const [filterCat,  setFilterCat]  = useState('')
  const [filterStat, setFilterStat] = useState('')
  const [filterPri,  setFilterPri]  = useState('')

  const [selected, setSelected] = useState<Complaint | null>(null)
  const [newStatus,setNewStatus]= useState<ComplaintStatus>('pending')
  const [remark,   setRemark]   = useState('')
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    getAllComplaints()
      .then(setComplaints)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const wards      = Array.from(new Set(complaints.map(c => c.ward))).sort()
  const categories = Array.from(new Set(complaints.map(c => c.category))).sort()

  const filtered = complaints.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      c.name.toLowerCase().includes(q) ||
      c.ward.toLowerCase().includes(q) ||
      c.trackingId.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    return (
      matchSearch &&
      (!filterWard || c.ward === filterWard) &&
      (!filterCat  || c.category === filterCat) &&
      (!filterStat || c.status === filterStat) &&
      (!filterPri  || c.priority === filterPri)
    )
  })

  const openModal = (c: Complaint) => {
    setSelected(c)
    setNewStatus(c.status)
    setRemark('')
  }

  const handleUpdate = async () => {
    if (!selected?._id) return
    setSaving(true)
    try {
      await updateComplaintStatus(selected._id, newStatus, remark, profile?.name ?? 'Admin')
      setComplaints(prev => prev.map(c =>
        c._id === selected._id
          ? { ...c, status: newStatus, remarks: [...(c.remarks ?? []), { text: remark, addedBy: profile?.name ?? 'Admin', addedAt: new Date().toISOString() }] }
          : c
      ))
      setSelected(null)
    } catch {
      alert(t('common.error'))
    } finally {
      setSaving(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setFilterWard('')
    setFilterCat('')
    setFilterStat('')
    setFilterPri('')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-navy-900 mb-6">{t('admin.complaints.title')}</h1>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('admin.complaints.searchPlaceholder')}
              className="input-field pl-9 text-xs"
            />
          </div>
          <select value={filterWard} onChange={e => setFilterWard(e.target.value)} className="select-field text-xs">
            <option value="">{t('admin.complaints.filterByWard')}</option>
            {wards.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="select-field text-xs">
            <option value="">{t('admin.complaints.filterByCategory')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStat} onChange={e => setFilterStat(e.target.value)} className="select-field text-xs">
            <option value="">{t('admin.complaints.filterByStatus')}</option>
            {['pending','underReview','inProgress','resolved'].map(s => (
              <option key={s} value={s}>{t(`complaints.statuses.${s}`)}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <select value={filterPri} onChange={e => setFilterPri(e.target.value)} className="select-field text-xs flex-1">
              <option value="">Priority</option>
              {['urgent','high','medium','low'].map(p => (
                <option key={p} value={p}>{t(`complaints.priorities.${p}`)}</option>
              ))}
            </select>
            <button onClick={clearFilters} className="px-3 py-2 text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-xl" title="Clear filters">
              <X size={15} />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3">{filtered.length} of {complaints.length} complaints</p>
      </div>

      {loading ? (
        <LoadingSpinner fullPage label={t('common.loading')} />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('admin.complaints.noComplaints')} icon={Filter} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Tracking ID','Complainant','Ward','Category','Type','Priority','Status','Date','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <code className="text-xs text-navy-700 font-semibold bg-navy-50 px-2 py-0.5 rounded">
                        {c.trackingId}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 text-xs">{c.name}</div>
                      <div className="text-slate-400 text-xs truncate max-w-[140px]">{c.description.slice(0,40)}…</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{c.ward}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 capitalize">{c.category}</td>
                    <td className="px-4 py-3"><Badge value={c.type} type="type" /></td>
                    <td className="px-4 py-3"><Badge value={c.priority} type="priority" /></td>
                    <td className="px-4 py-3"><Badge value={c.status} type="status" /></td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {c.createdAt ? format(new Date(c.createdAt), 'dd MMM yy') : ''}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openModal(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-navy-900 text-white
                                   rounded-lg text-xs font-medium hover:bg-navy-800 transition-colors"
                      >
                        <MessageSquare size={12} />
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="font-bold text-slate-800">Update Complaint</h3>
                <code className="text-xs text-navy-600">{selected.trackingId}</code>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 text-sm">
                <p className="font-semibold text-slate-800 mb-1">{selected.name} — {selected.ward}</p>
                <p className="text-slate-600 text-xs">{selected.description}</p>
              </div>

              <div>
                <label className="label">{t('admin.complaints.updateStatus')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['pending','underReview','inProgress','resolved'] as ComplaintStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setNewStatus(s)}
                      className={`py-2 rounded-xl text-xs font-semibold border-2 transition-colors ${
                        newStatus === s ? 'border-navy-900 bg-navy-50 text-navy-900' : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      {t(`complaints.statuses.${s}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">{t('admin.complaints.addRemark')}</label>
                <textarea
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  className="input-field min-h-[90px] resize-none"
                  placeholder={t('admin.complaints.remarkPlaceholder')}
                />
              </div>
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1 justify-center">
                {t('common.cancel')}
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving || !remark.trim()}
                className="btn-primary flex-1 justify-center disabled:opacity-60"
              >
                <CheckCircle2 size={15} />
                {saving ? t('common.loading') : 'Save Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
