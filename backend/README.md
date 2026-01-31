# FYP IIoT Anomaly Detection System - Backend

Backend API for the FYP project on FDI Attack Detection in IIoT using Deep Q-Learning + GNN.

## Features

- 🔐 User Authentication (JWT-based)
- 👨‍💼 Admin Dashboard (User approval system)
- 🤖 Model Inference (DQN-GNN anomaly detection)
- 📊 Real-time Anomaly Detection
- 🌐 IIoT Topology Visualization

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Run the Server**
   ```bash
   python -m uvicorn main:app --reload
   ```

4. **Access API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Admin
- `GET /admin/pending-users` - Get pending registrations
- `POST /admin/approve-user` - Approve/decline user
- `GET /admin/analytics` - Get system analytics

### Model
- `POST /model/predict` - Get anomaly predictions
- `GET /model/anomalies` - Get recent anomalies
- `GET /model/topology` - Get network topology
- `POST /model/anomalies/{id}/resolve` - Resolve anomaly

## Project Structure

```
backend/
├── app/
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── utils/           # Utilities (auth, model)
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   └── schemas.py       # Pydantic schemas
├── main.py              # FastAPI application
└── requirements.txt     # Dependencies
```

## Default Admin User

To create a default admin user, run:
```python
python create_admin.py
```
