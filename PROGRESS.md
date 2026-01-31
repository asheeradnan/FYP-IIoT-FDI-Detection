# FYP Progress Tracker

## ✅ Completed Tasks

### Backend (FastAPI) - DONE
1. **Project Structure Setup** ✅
   - Created organized backend folder structure
   - Set up configuration management
   - Created database models and schemas

2. **Authentication System** ✅
   - User registration with constraints (name, employee ID, email, password)
   - Employee ID uniqueness validation
   - Login system with JWT tokens
   - Password hashing with bcrypt
   - User status management (pending/approved/declined)

3. **Database Models** ✅
   - User model with roles (admin/user) and status
   - Anomaly model for FDI attack detection
   - SQLite database setup (can be upgraded to PostgreSQL)

4. **Admin APIs** ✅
   - Get pending user registrations
   - Approve/decline user requests  
   - Analytics endpoint (user stats, system health)

5. **Model Integration** ✅
   - DQN model loader for PyTorch model
   - Prediction endpoint for anomaly detection
   - Topology generation endpoint
   - Anomaly management (list, resolve)

6. **Server Running** ✅
   - FastAPI server running on http://127.0.0.1:8000
   - API documentation available at http://127.0.0.1:8000/docs
   - Admin user created (admin@fyp.com / Admin@123)

## 📋 API Endpoints Available

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token

### Admin (requires admin JWT)
- `GET /admin/pending-users` - List pending registrations
- `POST /admin/approve-user` - Approve or decline user
- `GET /admin/analytics` - Get system analytics

### Model
- `POST /model/predict` - Get anomaly predictions
- `GET /model/anomalies` - List detected anomalies
- `GET /model/topology` - Get IIoT network topology
- `POST /model/anomalies/{id}/resolve` - Mark anomaly as resolved

## 🔄 Next Steps

### Frontend (React) - IN PROGRESS
1. **Setup React Project**
   - Initialize Vite + React + TypeScript
   - Install dependencies (React Router, Axios, Tailwind CSS, etc.)
   - Configure routing

2. **Authentication Pages**
   - Login page
   - Signup page with reCAPTCHA
   - Password validation

3. **Admin Dashboard**
   - User approval interface
   - System analytics panel
   - Alert management
   - IIoT topology viewer

4. **User Dashboard**
   - System alerts with shutdown controls
   - Sensor thresholds display
   - IIoT topology visualization (interactive graph)
   - User guide section

5. **Topology Visualization**
   - Interactive graph using D3.js or React Flow
   - Color-coded nodes (green=normal, red=attack)
   - Hover effects and zoom/pan controls

## 🎨 Design Decisions
- **Backend**: FastAPI (async, fast, auto-docs)
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT tokens
- **ML Model**: PyTorch DQN-GNN
- **Frontend**: React + TypeScript (planned)
- **Styling**: Tailwind CSS + shadcn/ui (planned)

## 📝 Notes
- Model path: `swat_fdai_model_final.pth`
- Default admin credentials stored securely
- Email notifications not yet implemented (placeholder)
- reCAPTCHA validation not yet implemented (placeholder)
