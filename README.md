# 🏋️‍♀️ Gym Management System 

A modern full-stack web application built to streamline gym operations — from managing members and trainers to handling sessions, attendance, and secure online payments.

The system provides dedicated dashboards for **Admin, Trainer, and Member**, ensuring smooth and efficient gym management.

✅ **Deployed on AWS:**

• Frontend hosted on AWS S3
• Backend deployed on AWS EC2
• Database deployed on Aurora and RDS
• Process management using PM2

[gym-management-frontend-anuja.s3-website.eu-north-1.amazonaws.com](http://gym-management-frontend-anuja.s3-website.eu-north-1.amazonaws.com)


---

## 📂 Project Structure
gym-management-system/
│
├── frontend/ → React (Vite + Tailwind CSS)
├── backend/ → Node.js + Express API
└── database/ → MySQL schema & tables


---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Lucide-React

### Backend
- Node.js
- Express.js
- MySQL2

### Database
- MySQL

### Authentication & Security
- JSON Web Tokens (JWT)
- bcrypt (Password Hashing)

### Payments
- Stripe API Integration

---

# ⚙️ Installation & Local Setup

## 1️⃣ Database Setup

1. Install MySQL.
2. Create a database:

```sql
CREATE DATABASE gym_management;

3.Import the provided SQL schema to create required tables.

## 2️⃣ Backend Setup

Navigate to backend folder:

```bash
cd backend

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gym_management
JWT_SECRET=your_secret_key
PORT=5000
STRIPE_SECRET_KEY=sk_test_your_key
```

### Install dependencies

```bash
npm install
```

### Start backend server

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

Navigate to frontend folder:

```bash
cd frontend
```

### Create `.env` file

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 👥 Role-Based Features

## 🧑‍💼 Admin Features

- Accept / Reject new membership requests
- Update membership status (Active / Inactive)
- Update membership period
- Assign trainer and plan to members
- Add, View, Edit, Deactivate trainers
- Add, Edit, Delete membership plans
- View all sessions
- Search sessions by Trainer name and Member name

---

## 🏋️ Trainer Features

- View own assigned sessions
- Add new session
- Edit session details
- Mark session as Completed or Canceled
- View member Check-In / Check-Out status
- Mark attendance for members

---

## 👤 Member Features

- View assigned trainer details
- View selected plan details
- Select membership plan and make payment
- View session details
- View attendance history
- View payment history

---

# 💳 Stripe Payment Integration

The system integrates Stripe API for secure and reliable payment processing.

### Membership Reactivation
Expired or inactive members can securely reactivate their membership.

### Plan Selection & Payment
Members can select plans and complete payments via Stripe Checkout.

### Webhook Support
Stripe Webhooks are used to:
- Verify successful payments
- Update payment status in MySQL
- Activate or update memberships automatically

---

# 🔐 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based route protection
- Secure environment variable handling
- Stripe webhook signature verification

---

# 🚀 Future Enhancements

- Email notifications for members and trainers
- Advanced analytics and reporting dashboard
- Improved role-based access control and permissions
- Mobile-friendly / PWA support
- Additional payment gateways
- Continuous deployment (CI/CD) setup for automatic updates
---

# 👩‍💻 Author

**Anuja Suryawanshi**  
Full-Stack Web Developer   

---

⭐ If you found this project helpful, consider giving it a star!