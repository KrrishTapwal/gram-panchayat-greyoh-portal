'use client'

import { CheckCircle2, Target, Eye, Phone, Mail, MapPin, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  const features = [
    'Government scheme updates',
    'Complaint & feedback system',
    'Development work tracking',
    'Panchayat notices & announcements',
    'Transparent expenditure reports',
    'Citizen participation platform',
    'Real-time analytics dashboard',
    'Bilingual (Hindi & English) support',
  ]

  const hindiFeatures = [
    'सरकारी योजनाओं की जानकारी',
    'शिकायत एवं सुझाव प्रणाली',
    'विकास कार्य ट्रैकिंग',
    'पंचायत नोटिस एवं अपडेट',
    'पारदर्शी खर्च रिपोर्ट',
    'नागरिक सहभागिता मंच',
    'रियल-टाइम विश्लेषण डैशबोर्ड',
    'द्विभाषी (हिंदी और अंग्रेजी) समर्थन',
  ]

  const { language } = useLanguage()
  const displayFeatures = language === 'hi' ? hindiFeatures : features

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-black text-4xl">ग</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('about.title')}</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">{t('about.subtitle')}</p>
          <div className="mt-6 text-saffron-400 font-semibold">{t('tagline')}</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card p-8">
            <div className="w-12 h-12 bg-navy-100 rounded-2xl flex items-center justify-center mb-4">
              <Eye size={24} className="text-navy-900" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-3">{t('about.vision')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('about.visionText')}</p>
          </div>
          <div className="card p-8">
            <div className="w-12 h-12 bg-saffron-100 rounded-2xl flex items-center justify-center mb-4">
              <Target size={24} className="text-saffron-700" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-3">{t('about.mission')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('about.missionText')}</p>
          </div>
        </div>

        {/* About Portal */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">
            {language === 'hi' ? 'इस पोर्टल के बारे में' : 'About This Portal'}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            {language === 'hi'
              ? 'ग्राम पंचायत ग्रयोह डिजिटल सेवा पोर्टल एक आधुनिक सरकारी डिजिटल प्लेटफ़ॉर्म है जो नागरिकों को पंचायत से जोड़ता है। यह पोर्टल पारदर्शी शासन, त्वरित शिकायत समाधान और नागरिक सशक्तिकरण के लिए बनाया गया है।'
              : 'The Gram Panchayat Greyoh Digital Service Portal is a modern government digital platform that connects citizens with their Panchayat. Built for transparent governance, quick complaint resolution, and citizen empowerment, this portal leverages technology to bridge the communication gap between rural citizens and their elected representatives.'}
          </p>
          <p className="text-slate-600 leading-relaxed">
            {language === 'hi'
              ? 'यह पोर्टल डिजिटल इंडिया पहल के तहत बनाया गया है और स्मार्टफोन और कंप्यूटर दोनों पर आसानी से काम करता है। हमारा लक्ष्य है कि हर नागरिक अपनी समस्या आसानी से दर्ज कर सके और उसका समय पर समाधान हो।'
              : 'Built under the Digital India initiative, this portal works seamlessly on smartphones and computers. Our goal is to ensure every citizen can easily register their issues and receive timely resolution from the Panchayat.'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">{t('about.features')}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {displayFeatures.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                </div>
                <span className="text-slate-700 font-medium text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Info */}
        <div className="card p-8 mb-8 bg-navy-50 border-navy-200">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            {language === 'hi' ? 'तकनीकी जानकारी' : 'Technical Information'}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Platform',    value: 'Next.js 14 + React 18' },
              { label: 'Database',    value: 'Firebase Firestore' },
              { label: 'Auth',        value: 'Firebase Authentication' },
              { label: 'Hosting',     value: 'Vercel (Global CDN)' },
              { label: 'Security',    value: 'Firestore Rules + HTTPS' },
              { label: 'Language',    value: 'Bilingual (HI + EN)' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-navy-100 rounded-xl p-3">
                <p className="text-xs text-navy-500 font-medium mb-0.5">{label}</p>
                <p className="text-navy-900 font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-5">{t('about.contact')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: MapPin, label: 'Address',  value: 'Gram Panchayat Greyoh, Uttarakhand, India' },
              { icon: Phone,  label: 'Phone',    value: '+91 12345 67890' },
              { icon: Mail,   label: 'Email',    value: 'pradhan@greyoh.gov.in' },
              { icon: Globe,  label: 'Portal',   value: 'greyoh.gov.in' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-navy-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-slate-700 font-medium text-sm">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
