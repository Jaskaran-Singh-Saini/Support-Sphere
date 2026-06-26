# Support-Sphere

**Support-Sphere** is a digital mental health and psychological support ecosystem for students, built for Smart India Hackathon problem statement **ID25092**.

## Architecture

| Layer | Stack |
|-------|-------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Django 5.2 + Django REST Framework |
| Real-time | Django Channels + Redis + WebSockets |
| Database | PostgreSQL (production) / SQLite (local dev) |
| Auth | JWT (SimpleJWT via dj-rest-auth) + RBAC |
| AI | Google Gemini (Willow wellness assistant) |
| Deployment | Docker Compose + Nginx |

## Five Pillars

1. **AI Chat (Willow)** — empathetic first-line support with crisis keyword detection
2. **Counselor Booking** — confidential session scheduling with institutional counselors
3. **Peer Forums** — moderated community posts with NLP keyword filtering
4. **Resource Hub** — psychoeducational articles, exercises, and assessments
5. **Admin Dashboard** — anonymized campus wellness analytics

---

## Local Development

### Prerequisites

- Python 3.12+
- Node.js 20+
- Redis (for WebSocket chat)
- PostgreSQL (optional; defaults to SQLite)

### Backend

```bash
cd Support-Sphere-backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # Add your GEMINI_API_KEY
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

For WebSocket support, run with Daphne instead:

```bash
daphne -b 127.0.0.1 -p 8000 support_sphere.asgi:application
```

Start Redis locally:

```bash
redis-server
```

### Frontend

```bash
cd Support-Sphere-frontend
npm install
npm run dev
```

Open http://localhost:5173

### Demo Accounts (after seed_data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | admin123 |
| Student | student@university.edu | student123 |

---

## Docker Deployment

### 1. Configure environment

Create a `.env` file in the project root:

```env
DJANGO_SECRET_KEY=your-secure-secret-key
GEMINI_API_KEY=your-gemini-api-key
POSTGRES_PASSWORD=strong-password
```

### 2. Build and run

```bash
docker compose up --build -d
```

The app will be available at **http://localhost**

Services:
- **nginx** — reverse proxy (port 80)
- **frontend** — React SPA
- **backend** — Django + Daphne (API + WebSockets)
- **db** — PostgreSQL 16
- **redis** — Channel layer for real-time chat

### 3. Verify

```bash
docker compose ps
docker compose logs backend
curl http://localhost/api/counselors/
```

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login/` | JWT login (email + password) |
| `POST /api/auth/refresh/` | Refresh JWT token |
| `GET /api/me/` | Current user profile + role |
| `POST /api/chat/` | Willow AI chat (HTTP) |
| `WS /ws/chat/` | Willow AI chat (WebSocket) |
| `GET/POST /api/reflections/` | Encrypted journal reflections |
| `GET/POST /api/posts/` | Forum posts (moderated) |
| `GET /api/counselors/` | Counselor directory |
| `POST /api/appointments/` | Book counseling session |
| `GET /api/resources/` | Self-help resource hub |
| `GET /api/admin/analytics/` | Admin wellness dashboard data |

---

## Security Features

- **JWT authentication** with role-based access (student / counselor / admin)
- **Field-level encryption** for reflection journal entries (Fernet)
- **Crisis keyword detection** in AI chat and forums with alert logging
- **Forum content moderation** via NLP keyword filters
- **Environment-based secrets** — no hardcoded production keys

---

## Project Structure

```
hackathon-project/
├── docker-compose.yml
├── nginx/nginx.conf
├── Support-Sphere-backend/
│   ├── api/                  # Models, views, WebSocket consumers
│   ├── support_sphere/       # Django settings, ASGI
│   ├── Dockerfile
│   └── requirements.txt
└── Support-Sphere-frontend/
    ├── src/
    │   ├── pages/            # 25+ route pages
    │   ├── components/
    │   └── config/api.js     # Centralized API URLs
    └── Dockerfile
```

---

## Hackathon Notes

- Problem Statement: **ID25092** — Smart India Hackathon
- Team: Support-Sphere
- Localization: English + Hindi (Settings → Language)
