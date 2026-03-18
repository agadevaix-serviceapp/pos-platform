# POS Platform - Pusat Layanan Digital untuk UMKM

Sistem pusat layanan digital yang menjual berbagai aplikasi berbasis langganan kepada pelaku usaha kecil di Indonesia.

## 🏗️ Arsitektur

- **Backend API**: Node.js + Express + Prisma + PostgreSQL (Railway)
- **Admin Dashboard**: React + Vite + Tailwind CSS (Vercel)
- **Desktop App**: Electron + React + SQLite (Coming Soon)

## 🚀 Quick Start

### Backend API

```bash
cd pos
npm install
npm run dev
# Running on http://localhost:8080
```

### Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev
# Running on http://localhost:5173
```

## 📡 API Endpoints

- `GET /` - Health check
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers
- `POST /api/licenses/generate` - Generate license key
- `POST /api/licenses/activate` - Activate license
- `POST /api/licenses/validate` - Validate license

## 🛠️ Tech Stack

### Backend
- Node.js 22.x
- Express 4.22.x
- Prisma 5.22.x
- PostgreSQL 15 (Railway)
- TypeScript 5.9.x

### Dashboard
- React 18.3.x
- Vite 5.x
- Tailwind CSS 3.4.x
- TanStack Query 5.x
- React Router 6.x

## 📄 License

MIT
