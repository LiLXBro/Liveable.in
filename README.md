# CLIC.ORG

Citizens for Liveable Indian Cities - Citizen Mobilization Platform.

## Tech Stack
- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Maps**: React Leaflet (OpenStreetMap)

## Setup & Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/clic_db"
```
*Note: You need a running PostgreSQL instance.*

### 3. Initialize Database
Run the schema initialization script to create the `champions` table:
```bash
node scripts/init-db.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deployment (Render.com)
1. Creates a **Web Service** on Render connected to this repo.
2. Add Environment Variable `DATABASE_URL` (use the Internal URL from your Render PostgreSQL database).
3. Build Command: `npm run build`
4. Start Command: `npm start`
