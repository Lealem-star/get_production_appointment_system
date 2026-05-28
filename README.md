# Get Production Appointment System

Full-stack studio appointment system.

## Development

### Backend

- **Folder**: `backend/`
- **Env**: set `MONGODB_URI` and `JWT_SECRET` in `backend/.env`
- **Run**:
  - `npm run dev`

### Frontend

- **Folder**: `frontend/`
- **Env**: `frontend/.env` should contain `VITE_API_BASE_URL=http://localhost:5000`
- **Run**:
  - `npm run dev`

## Notes

- Admin login uses `/auth/login` and loads data from `/admin/bootstrap`.

