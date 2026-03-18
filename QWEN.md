# POS Platform - Full Stack Documentation

## 📋 Project Overview

**POS Platform** adalah sistem pusat layanan digital untuk UMKM Indonesia dengan model SaaS offline-first.

### Status Saat Ini
✅ **BACKEND API** - COMPLETE & RUNNING
✅ **ADMIN DASHBOARD** - COMPLETE & RUNNING

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT (Local)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │ Admin Dashboard │         │   Backend API   │           │
│  │  Port: 5173     │────────►│  Port: 8080     │           │
│  │  (Vite + React) │  Proxy  │  (Express)      │           │
│  └─────────────────┘         └────────┬────────┘           │
│                                       │                     │
│                                       │ PostgreSQL          │
│                                       ▼                     │
│                              ┌─────────────────┐           │
│                              │ Railway         │           │
│                              │ PostgreSQL 15   │           │
│                              └─────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Backend API
| Komponen | Versi | Keterangan |
|----------|-------|------------|
| Node.js | 22.x | LTS |
| Express | 4.22.x | Web framework |
| Prisma | 5.22.x | ORM |
| PostgreSQL | 15 | Railway managed |
| TypeScript | 5.9 | Type-safe |
| tsx | 4.21.x | Dev server |

### Admin Dashboard
| Komponen | Versi | Keterangan |
|----------|-------|------------|
| React | 18.3.x | UI framework |
| Vite | 5.x | Build tool |
| TypeScript | 5.3.x | Type-safe |
| Tailwind CSS | 3.4.x | Styling |
| TanStack Query | 5.17.x | Data fetching |
| React Router | 6.21.x | Routing |
| Axios | 1.6.x | HTTP client |
| Lucide React | 0.300.x | Icons |

---

## 🚀 Building and Running

### Backend API

```bash
cd /home/aga/Dokumen/AGADEV/a_RWA/pos

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

**Backend running di:** http://localhost:8080

### Admin Dashboard

```bash
cd /home/aga/Dokumen/AGADEV/a_RWA/pos/admin-dashboard

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**Dashboard running di:** http://localhost:5173

### Database Commands

```bash
cd /home/aga/Dokumen/AGADEV/a_RWA/pos

# Generate Prisma Client
npm run prisma:generate

# Create & apply migration (development)
npm run prisma:migrate

# Apply migration (production)
npm run prisma:migrate:prod

# Buka Prisma Studio (GUI)
npm run prisma:studio
```

---

## 📡 API Endpoints

### Health Check
```
GET http://localhost:8080/
```

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers` | Create customer |
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/:id` | Get customer by ID |

### Licenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/licenses/generate` | Generate license key |
| POST | `/api/licenses/activate` | Activate license |
| POST | `/api/licenses/validate` | Validate license |
| GET | `/api/licenses/customer/:id` | Get licenses by customer |

---

## 🎨 Admin Dashboard Features

### Dashboard (Home)
- **Stats Cards**: Total Customers, Active Licenses, Pending Licenses
- **Recent Customers Table**: 5 customers terbaru

### Customers Page
- **List semua customers** dengan detail
- **Create customer** dengan form modal
- **Contact info**: Phone & Email
- **License count** per customer

### Licenses Page
- **Generate license key** untuk customer
- **Pilih app type**: POS Aksesoris, POS Warung, POS Laundry
- **Set duration** (hari)
- **Copy license key** ke clipboard
- **List semua licenses** dengan status

---

## 🗄️ Database Schema

### Customer
```prisma
model Customer {
  id        String   @id @default(nanoid())
  name      String
  business  String
  phone     String?
  email     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  licenses  License[]
}
```

### License
```prisma
model License {
  id           String    @id @default(nanoid())
  key          String    @unique
  customerId   String
  customer     Customer  @relation(...)
  appType      String
  status       String    @default("pending")
  activatedAt  DateTime?
  expiresAt    DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

---

## 📝 Development Conventions

### Coding Style
- **TypeScript** strict mode
- **Functional components** dengan hooks
- **Error handling** proper di semua endpoint
- **Loading states** di UI

### File Structure

```
pos/
├── src/                      # Backend API
│   └── index.ts              # Main server (all routes)
├── prisma/
│   └── schema.prisma         # Database schema
├── admin-dashboard/          # Admin Dashboard
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Customers.tsx
│   │   │   └── Licenses.tsx
│   │   ├── lib/
│   │   │   ├── api.ts        # API client
│   │   │   └── utils.ts      # Utilities
│   │   ├── App.tsx           # Root component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── tsconfig.json
```

### Environment Variables

```bash
# Backend .env
DATABASE_URL="postgresql://..."
PORT=8080
NODE_ENV=development

# Dashboard .env (optional)
VITE_API_URL="http://localhost:8080"
```

---

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:8080/

# Create customer
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","business":"Test Shop"}'

# Get all customers
curl http://localhost:8080/api/customers

# Generate license
curl -X POST http://localhost:8080/api/licenses/generate \
  -H "Content-Type: application/json" \
  -d '{"customerId":"...","appType":"pos-aksesoris","durationDays":30}'
```

### Test Dashboard

Buka browser: **http://localhost:5173**

1. **Dashboard** - Lihat stats & recent customers
2. **Customers** - Create customer baru
3. **Licenses** - Generate license key

---

## 🔄 Workflow Contoh

### 1. Create Customer
```
Dashboard → Customers → Add Customer
→ Isi form (Name, Business, Phone, Email)
→ Create
```

### 2. Generate License Key
```
Dashboard → Licenses → Generate License
→ Pilih Customer
→ Pilih App Type (POS Aksesoris)
→ Set Duration (30 hari)
→ Generate
→ Copy license key
→ Kirim via WhatsApp ke customer
```

### 3. Customer Activate License (Electron App)
```
Customer buka Electron App
→ Input license key
→ Activate (butuh internet sekali)
→ App aktif selama 30 hari
```

---

## 🚀 Next Steps

### Completed ✅
1. ✅ Backend API (Express + Prisma)
2. ✅ Admin Dashboard (React + Vite)
3. ✅ Customer Management
4. ✅ License Management
5. ✅ Database PostgreSQL di Railway

### Pending ⏭️
1. ⏭️ **Deploy Backend ke Railway**
   - Push code ke GitHub
   - Connect Railway
   - Auto-deploy

2. ⏭️ **Deploy Dashboard ke Vercel**
   - Push code ke GitHub
   - Connect Vercel
   - Auto-deploy

3. ⏭️ **Electron App (POS Aksesoris HP)**
   - License activation flow
   - Product management
   - Transaction management
   - SQLite local storage
   - Offline mode

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Backend (port 8080)
# Edit src/index.ts, ganti PORT = 8081

# Dashboard (port 5173)
# Edit vite.config.ts, ganti port
```

### Dashboard Tidak Connect ke Backend
```bash
# Pastikan backend running di port 8080
# Cek vite.config.ts proxy configuration
```

### Prisma Client Not Generated
```bash
npm run prisma:generate
```

### Database Connection Error
```bash
# Cek DATABASE_URL di .env
# Pastikan Railway PostgreSQL aktif
```

---

## 📞 Contact & Support

**Status**: ✅ Backend + Dashboard Complete

**Backend**: http://localhost:8080
**Dashboard**: http://localhost:5173
**Database**: Railway PostgreSQL (production-ready)

---

## 📚 References

- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [Railway](https://docs.railway.app/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com/)
