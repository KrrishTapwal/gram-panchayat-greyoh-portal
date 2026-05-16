import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider }     from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title:       'ग्राम पंचायत ग्रयोह | Gram Panchayat Greyoh Digital Service Portal',
  description: 'Official digital service portal for Gram Panchayat Greyoh. Submit complaints, track status, view government schemes and panchayat updates.',
  keywords:    'gram panchayat, greyoh, digital portal, citizen services, complaint, panchayat',
  viewport:    'width=device-width, initial-scale=1',
  themeColor:  '#1e3a8a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body>
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
