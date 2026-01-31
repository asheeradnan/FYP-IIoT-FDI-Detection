# FYP: FDI Attack Detection in IIoT using Deep Q-Learning & GNN

![Python](https://img.shields.io/badge/Python-3.14-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)

## 📋 Project Overview

Research and development on **False Data Injection (FDI) Attack Detection** in Industrial Internet of Things (IIoT) using **Deep Q-Learning** combined with **Graph Neural Networks (GNN)** to represent the IIoT topology.

### Key Features

- 🔐 **Secure Authentication System** - JWT-based login with role-based access control
- 👨‍💼 **Admin Dashboard** - User approval system, analytics, and system monitoring
- 👤 **User Dashboard** - Real-time anomaly alerts, sensor thresholds, and system controls
- 🤖 **ML-Powered Detection** - PyTorch DQN-GNN model for FDI attack prediction
- 🌐 **Interactive Topology Visualization** - Real-time IIoT network graph with anomaly highlighting
- 📊 **Analytics & Monitoring** - System health, anomaly frequency, and user activity tracking

## 🏗️ Architecture

```
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Utilities (auth, ML model)
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database connection
│   │   └── schemas.py      # Pydantic schemas
│   ├── main.py             # FastAPI app
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React Frontend (Coming soon)
│   └── ...
│
└── swat_fdai_model_final.pth/  # Trained DQN-GNN Model
```

## 🚀 Quick Start

### Prerequisites

- Python 3.14+
- PostgreSQL 15+
- Node.js 18+ (for frontend)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FYP
   ```

2. **Install PostgreSQL and create database**
   ```bash
   # Install PostgreSQL from https://www.postgresql.org/download/
   # Or use Docker:
   docker run --name fyp-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=fyp_iiot_db -p 5432:5432 -d postgres:15
   ```

3. **Setup Python environment**
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   ```

4. **Configure database**
   ```bash
   python setup_database.py
   # Follow the prompts to configure PostgreSQL connection
   ```

5. **Create admin user**
   ```bash
   python create_admin.py
   ```

6. **Start the backend server**
   ```bash
   python -m uvicorn main:app --reload
   ```

7. **Access API Documentation**
   - Swagger UI: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

### Frontend Setup (Coming Soon)

```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token

### Admin (Requires Admin Role)
- `GET /admin/pending-users` - List pending user registrations
- `POST /admin/approve-user` - Approve or decline user
- `GET /admin/analytics` - Get system analytics

### Model & Anomaly Detection
- `POST /model/predict` - Get anomaly predictions from DQN-GNN model
- `GET /model/anomalies` - List detected anomalies
- `GET /model/topology` - Get IIoT network topology
- `POST /model/anomalies/{id}/resolve` - Mark anomaly as resolved

## 🔐 Default Credentials

**Admin User:**
- Email: `admin@fyp.com`
- Password: `Admin@123`

⚠️ **Important:** Change the default password after first login!

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **PostgreSQL** - Production-grade database
- **SQLAlchemy** - ORM for database operations
- **PyTorch** - Deep learning framework for DQN-GNN model
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

### Frontend (Planned)
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **D3.js / React Flow** - Interactive graph visualization

### Machine Learning
- **Deep Q-Learning** - Reinforcement learning algorithm
- **Graph Neural Network** - IIoT topology representation
- **PyTorch** - Model training and inference

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `name` - User full name
- `employee_id` - Unique employee identifier
- `email` - Unique email (login)
- `hashed_password` - Bcrypt hashed password
- `role` - admin / user
- `status` - pending / approved / declined
- `is_active` - Account status
- `created_at` - Registration timestamp

### Anomalies Table
- `id` - Primary key
- `node_id` - IIoT node identifier
- `confidence` - Detection confidence score
- `severity` - low / medium / high / critical
- `detected_at` - Detection timestamp
- `is_resolved` - Resolution status

## 🔬 Research Components

### DQN-GNN Model
- **Input:** Sensor data from IIoT devices
- **Processing:** Graph Neural Network for topology representation
- **Learning:** Deep Q-Learning for anomaly detection
- **Output:** Anomaly predictions with confidence scores

### Dataset
- **SWAT Dataset** - Secure Water Treatment testbed data
- **Features:** 51 sensor readings
- **Labels:** Normal vs FDI attack

## 👥 Team Members

- [Your Name] - Project Lead
- [Team Member 2] - Frontend Developer
- [Team Member 3] - Backend Developer

## 📝 Development Progress

- [x] Backend API with FastAPI
- [x] PostgreSQL database setup
- [x] User authentication system
- [x] Admin approval workflow
- [x] DQN-GNN model integration
- [x] Anomaly detection endpoints
- [ ] React frontend
- [ ] Login/Signup pages
- [ ] Admin dashboard
- [ ] User dashboard
- [ ] IIoT topology visualization
- [ ] Real-time updates with WebSockets
- [ ] Email notifications
- [ ] reCAPTCHA integration

## 📄 License

This project is part of a Final Year Project (FYP) for academic purposes.

## 🤝 Contributing

This is an academic project. For team members:

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. Push to the repository
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request for review

## 📞 Contact

For questions or issues, please contact the project team.

---

**Note:** This is a research project focusing on cybersecurity in Industrial IoT environments. The system demonstrates real-time detection of False Data Injection attacks using advanced machine learning techniques.
