# Liveable.in - Citizen Mobilization Platform

Connect citizens, champions, and editors to create liveable Indian cities.

## Key Features
*   **Role-Based Access**: Admin, Editor, Champion (User) roles.
*   **Authentication**: Secure JWT-based session management.
*   **Image Storage**: Fully database-driven (Base64) for profiles and blog posts - no external buckets required.
*   **Interactive UI**: Mobile-responsive design with Charts.js analytics and Leaflet maps.
*   **Supabase Integrated**: Powered by scalable Supabase PostgreSQL.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
# Supabase Connection (Transaction Pooler - Port 6543)
DATABASE_URL="postgresql://postgres.[project]:[password]@[host]:6543/postgres?pgbouncer=true"

# Supabase Client Keys (for potential future use)
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="[public-key]"

# Security
JWT_SECRET="generate-a-strong-random-secret-here"
```

### 3. Initialize Database
Run the schema script to create tables (`users`, `champions`, `blogs`, `votes`, `comments`):
```bash
node scripts/fix-schema.js
```

### 4. Seed Data
Create default Admin and Sample Content:
```bash
node scripts/seed-admin.js   # Creates admin@liveable.in / admin
node scripts/seed-blog.js    # Adds sample stories
```

### 5. Run Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

## 📦 Deployment (Vercel)

Set the following **Environment Variables** in Vercel:
1.  `DATABASE_URL`: Your Supabase Transaction Pooler URL (Port 6543).
2.  `JWT_SECRET`: A strong secret key.
3.  `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
4.  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: Your Supabase Public Key.

## 🔑 Default Credentials
*   **Admin**: `admin@liveable.in` / `admin`
*   **Test Champion**: `champion@clic.org` / `champion123` (created by seed scripts)
