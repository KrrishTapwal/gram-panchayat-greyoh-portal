'use client'

import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, UserCircle, Shield, FileText, Search, Clock, Bell } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const citizenSteps = [
  {
    icon: UserCircle,
    title: 'Register & Login',
    titleHi: 'पंजीकरण और लॉगिन',
    content: 'Visit the login page and create a new account with your name, email, and ward. For existing users, simply login with your email and password.',
    contentHi: 'लॉगिन पेज पर जाएं और अपना नाम, ईमेल और वार्ड के साथ नया खाता बनाएं। पुराने उपयोगकर्ता अपने ईमेल और पासवर्ड से लॉगिन करें।',
  },
  {
    icon: FileText,
    title: 'Submit a Complaint',
    titleHi: 'शिकायत दर्ज करें',
    content: 'Click "Submit Complaint" in the navbar. Fill in your name, ward, category, and describe your issue. Choose priority level and submit.',
    contentHi: 'नेवबार में "शिकायत दर्ज करें" पर क्लिक करें। अपना नाम, वार्ड, श्रेणी भरें और समस्या का वर्णन करें। प्राथमिकता स्तर चुनें और जमा करें।',
  },
  {
    icon: Clock,
    title: 'Track Your Complaint',
    titleHi: 'शिकायत ट्रैक करें',
    content: 'After submission, you receive a unique Tracking ID (e.g., GRY-2024-1234). Go to Track Complaint section and enter this ID to see the latest status and remarks.',
    contentHi: 'जमा करने के बाद आपको एक अनोखी ट्रैकिंग आईडी मिलती है (जैसे, GRY-2024-1234)। ट्रैक शिकायत सेक्शन में जाएं और नवीनतम स्थिति देखने के लिए यह आईडी दर्ज करें।',
  },
  {
    icon: Bell,
    title: 'View Notifications & Schemes',
    titleHi: 'सूचनाएं और योजनाएं देखें',
    content: 'Visit the Notifications section to stay updated with government schemes, panchayat notices, and important announcements. You can also filter by type.',
    contentHi: 'सरकारी योजनाओं, पंचायत नोटिस और महत्वपूर्ण घोषणाओं से अपडेट रहने के लिए सूचनाएं सेक्शन देखें।',
  },
]

const adminSteps = [
  {
    title: 'Manage Complaints',
    titleHi: 'शिकायतें प्रबंधित करें',
    content: 'In the Admin Panel, go to "Manage Complaints". Filter by ward, category, status, or priority. Click on any complaint to add remarks and update the status.',
    contentHi: 'एडमिन पैनल में "शिकायतें प्रबंधित करें" पर जाएं। वार्ड, श्रेणी, स्थिति या प्राथमिकता से फ़िल्टर करें। कोई भी शिकायत पर क्लिक करें और टिप्पणी जोड़ें और स्थिति अपडेट करें।',
  },
  {
    title: 'Publish Notifications',
    titleHi: 'सूचनाएं प्रकाशित करें',
    content: 'Go to Admin > Notifications. Fill in the title and content in both Hindi and English. Choose the type (scheme/notice/announcement) and optionally add an external link.',
    contentHi: 'एडमिन > सूचनाएं पर जाएं। हिंदी और अंग्रेजी दोनों में शीर्षक और सामग्री भरें। प्रकार चुनें और वैकल्पिक रूप से बाहरी लिंक जोड़ें।',
  },
  {
    title: 'Emergency Alerts',
    titleHi: 'आपातकालीन अलर्ट',
    content: 'Publish urgent alerts from Admin > Emergency Alerts. These appear as a scrolling banner on the homepage visible to all citizens immediately.',
    contentHi: 'एडमिन > आपातकालीन अलर्ट से तत्काल अलर्ट प्रकाशित करें। ये होमपेज पर स्क्रॉलिंग बैनर के रूप में सभी नागरिकों को तुरंत दिखाई देते हैं।',
  },
  {
    title: 'Analytics & Reports',
    titleHi: 'विश्लेषण और रिपोर्ट',
    content: 'The Analytics Dashboard shows complaint trends, ward-wise issues, category distribution, and AI-powered insights. Export reports as Excel or PDF from the Reports section.',
    contentHi: 'विश्लेषण डैशबोर्ड शिकायत प्रवृत्तियां, वार्ड-वार समस्याएं, श्रेणी वितरण और AI अंतर्दृष्टि दिखाता है। रिपोर्ट सेक्शन से Excel या PDF में रिपोर्ट निर्यात करें।',
  },
]

const faqs = [
  {
    q: 'What is the Tracking ID?',
    qHi: 'ट्रैकिंग आईडी क्या है?',
    a: 'It\'s a unique code (e.g., GRY-2024-1234) assigned to each complaint. Use it to check your complaint status anytime without logging in.',
    aHi: 'यह एक अनोखा कोड है (जैसे, GRY-2024-1234) जो प्रत्येक शिकायत को दिया जाता है। इसे बिना लॉगिन किए कभी भी अपनी शिकायत की स्थिति देखने के लिए उपयोग करें।',
  },
  {
    q: 'How long does complaint resolution take?',
    qHi: 'शिकायत समाधान में कितना समय लगता है?',
    a: 'Resolution time varies by complaint type and priority. Urgent complaints are handled within 24 hours, while standard complaints may take 3-7 working days.',
    aHi: 'समाधान का समय शिकायत प्रकार और प्राथमिकता के अनुसार भिन्न होता है। अत्यावश्यक शिकायतें 24 घंटे में, जबकि सामान्य शिकायतें 3-7 कार्य दिवसों में हल हो सकती हैं।',
  },
  {
    q: 'Can I submit a complaint without an account?',
    qHi: 'क्या मैं खाते के बिना शिकायत दर्ज कर सकता/सकती हूं?',
    a: 'Yes! You can submit complaints without logging in. However, creating an account lets you track all your complaints from your profile page.',
    aHi: 'हाँ! आप बिना लॉगिन किए शिकायत दर्ज कर सकते हैं। हालांकि, खाता बनाने से आप अपने प्रोफाइल पेज से सभी शिकायतें ट्रैक कर सकते हैं।',
  },
  {
    q: 'Who can access the Admin panel?',
    qHi: 'एडमिन पैनल तक कौन पहुंच सकता है?',
    a: 'Only authorized Pradhan and Admin users can access the admin panel. Admin access is granted by the system administrator.',
    aHi: 'केवल अधिकृत प्रधान और एडमिन उपयोगकर्ता एडमिन पैनल तक पहुंच सकते हैं। एडमिन एक्सेस सिस्टम प्रशासक द्वारा दी जाती है।',
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-slate-800 text-sm">{q}</span>
        {open ? <ChevronUp size={18} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  const { t, language } = useLanguage()
  const [tab, setTab] = useState<'citizen' | 'admin' | 'faq'>('citizen')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-navy-900 text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle size={24} className="text-saffron-400" />
            <h1 className="text-2xl font-bold">{t('help.title')}</h1>
          </div>
          <p className="text-blue-200">{t('help.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-8">
          {[
            { value: 'citizen', label: t('help.citizenGuide'), icon: UserCircle },
            { value: 'admin',   label: t('help.adminGuide'),   icon: Shield },
            { value: 'faq',     label: t('help.faq'),          icon: HelpCircle },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTab(value as typeof tab)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === value ? 'bg-navy-900 text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'citizen' && (
          <div className="space-y-5">
            {citizenSteps.map(({ icon: Icon, title, titleHi, content, contentHi }, i) => (
              <div key={i} className="card p-6 flex gap-5">
                <div className="w-12 h-12 bg-navy-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-navy-900" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">
                    {i + 1}. {language === 'hi' ? titleHi : title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {language === 'hi' ? contentHi : content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'admin' && (
          <div className="space-y-5">
            {adminSteps.map(({ title, titleHi, content, contentHi }, i) => (
              <div key={i} className="card p-6 flex gap-5">
                <div className="w-10 h-10 bg-saffron-100 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-saffron-700">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">
                    {language === 'hi' ? titleHi : title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {language === 'hi' ? contentHi : content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'faq' && (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                q={language === 'hi' ? faq.qHi : faq.q}
                a={language === 'hi' ? faq.aHi : faq.a}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
