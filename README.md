# ग्राम पंचायत ग्रयोह डिजिटल सेवा पोर्टल
# Gram Panchayat Greyoh Digital Service Portal

> Official Government-grade Bilingual (Hindi + English) Digital Portal for Gram Panchayat Greyoh

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd gram-panchayat-portal
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project: `gram-panchayat-greyoh`
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** → Start in test mode
5. Enable **Storage** (for attachments)

### 3. Environment Variables
```bash
cp .env.local.example .env.local
```
Fill in your Firebase config values in `.env.local`

### 4. Firestore Security Rules
Go to Firebase Console → Firestore → Rules and paste the contents of `firestore.rules`

### 5. Create Admin Account
In Firebase Console → Authentication → Add user:
- Email: `pradhan@greyoh.gov.in`
- Password: (set a strong password)

Then in Firestore → users collection → add document with uid matching above:
```json
{
  "uid": "<firebase-uid>",
  "name": "Pradhan Ji",
  "email": "pradhan@greyoh.gov.in",
  "role": "pradhan",
  "ward": "All",
  "createdAt": <timestamp>
}
```

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page
│   ├── login/              # Auth page (citizen + admin tabs)
│   ├── dashboard/          # Public transparency dashboard
│   ├── complaints/         # Submit complaint form
│   │   └── track/          # Track complaint by ID
│   ├── notifications/      # Govt schemes & notices
│   ├── meetings/           # Panchayat meetings
│   ├── profile/            # Citizen profile
│   ├── about/              # About portal
│   ├── help/               # Help & FAQ
│   └── admin/              # Admin panel (protected)
│       ├── page.tsx        # Admin dashboard
│       ├── complaints/     # Manage complaints
│       ├── notifications/  # Add notifications
│       ├── alerts/         # Emergency alerts
│       ├── meetings/       # Meeting management
│       ├── analytics/      # Analytics + AI insights
│       └── reports/        # Export Excel/PDF
├── components/
│   ├── layout/             # Navbar, Footer
│   └── ui/                 # StatCard, Badge, AlertBanner, etc.
├── contexts/
│   ├── AuthContext.tsx     # Firebase auth state
│   └── LanguageContext.tsx # Hindi/English toggle
├── lib/
│   ├── firebase.ts         # Firebase initialization
│   ├── firestore.ts        # All Firestore CRUD operations
│   └── exportUtils.ts      # Excel & PDF export
└── translations/
    ├── en.ts               # English translations
    ├── hi.ts               # Hindi translations
    └── index.ts            # Translation utility
```

---

## 🔥 Firebase Collections

| Collection      | Description                               |
|-----------------|-------------------------------------------|
| `users`         | Citizen & admin profiles                  |
| `complaints`    | Complaints, feedback, requirements        |
| `notifications` | Govt schemes, notices, announcements      |
| `meetings`      | Panchayat meeting records                 |
| `alerts`        | Emergency alerts (visible on homepage)    |

---

## ✨ Key Features

### For Citizens
- 📝 Submit complaints, feedback, or requirements
- 🔍 Track complaint status with unique Tracking ID (GRY-YYYY-XXXX)
- 📢 View government schemes & notifications
- 🗓️ View panchayat meeting summaries
- 👤 Personal profile with complaint history
- 🌐 Bilingual (Hindi + English) interface

### For Admin / Pradhan
- 📊 Real-time analytics dashboard with AI insights
- ✅ Manage & resolve complaints with remarks
- 🔔 Publish notifications and schemes
- 🚨 Publish emergency alerts (shown on homepage)
- 🗓️ Manage panchayat meetings
- 📈 Area-wise issue tracking
- 📄 Export reports (Excel + PDF)

---

## 🚀 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add Environment Variables in Vercel Dashboard:
# NEXT_PUBLIC_FIREBASE_API_KEY
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# NEXT_PUBLIC_FIREBASE_PROJECT_ID
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
# NEXT_PUBLIC_FIREBASE_APP_ID
```

Or connect your GitHub repository to Vercel for automatic deployments.

---

## 🔒 Security

- Firebase Authentication for all users
- Firestore Security Rules restrict access by role
- Admin routes protected with `useEffect` redirect
- Input validation on all forms
- XSS protection via React's built-in escaping
- HTTPS enforced by Vercel

---

## 🛠️ Tech Stack

| Technology          | Version | Purpose                     |
|---------------------|---------|-----------------------------|
| Next.js             | 14.2.5  | React framework (App Router) |
| React               | 18.3    | UI library                  |
| TypeScript          | 5.x     | Type safety                 |
| Tailwind CSS        | 3.4     | Styling                     |
| Firebase            | 10.12   | Auth + Firestore + Storage  |
| Recharts            | 2.12    | Analytics charts            |
| Lucide React        | 0.395   | Icons                       |
| jsPDF + autotable   | 2.5     | PDF export                  |
| xlsx                | 0.18    | Excel export                |
| date-fns            | 3.6     | Date formatting             |

---

## 📞 Support

- **Portal**: [greyoh.gov.in](https://greyoh.gov.in)
- **Email**: pradhan@greyoh.gov.in
- **Phone**: +91 12345 67890
- **Address**: Gram Panchayat Greyoh, Uttarakhand, India

---

*Built under the Digital India Initiative | © 2024 Gram Panchayat Greyoh*
