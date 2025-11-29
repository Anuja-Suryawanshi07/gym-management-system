gym_management_system

--1️⃣ Roles Table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE  
);

--2️⃣ Users Table (Authentication)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    gender ENUM('male', 'female', 'other'),
    dob DATE,
    address TEXT,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--3️⃣ User & Roles Mapping Table
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

--4️⃣ Trainer Profile Table
CREATE TABLE trainer_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    specialty VARCHAR(100),
    experience_years INT DEFAULT 0,
    certification_details VARCHAR(255),
    status ENUM('active','inactive') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--5️⃣ Member Profile Table
CREATE TABLE member_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    trainer_id INT,
    membership_start DATE,
    membership_end DATE,
    health_details TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES users(id)
);

--6️⃣ Plans Table (Membership/Fitness Plans)
CREATE TABLE plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL UNIQUE,
    duration_months INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    status ENUM('active','inactive') DEFAULT 'active'
);

--7️⃣ Member Plan Enrollment Table
CREATE TABLE member_plan_enrollment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('paid','unpaid','pending') DEFAULT 'pending',
    FOREIGN KEY (member_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

--8️⃣ Attendance Table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    check_in_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    check_out_datetime DATETIME,
    notes VARCHAR(255),
    FOREIGN KEY (member_id) REFERENCES users(id)
);

--9️⃣ Trainer-Member Sessions Table
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainer_id INT NOT NULL,
    member_id INT NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    status ENUM('scheduled','completed','canceled') DEFAULT 'scheduled',
    FOREIGN KEY (trainer_id) REFERENCES users(id),
    FOREIGN KEY (member_id) REFERENCES users(id)
);

-- 🔟 Payments Table (Stripe Integration)
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    enrollment_id INT NOT NULL,
    stripe_payment_id VARCHAR(255) UNIQUE,  
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Stripe',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('success','failed','pending') DEFAULT 'pending',
    FOREIGN KEY (member_id) REFERENCES users(id),
    FOREIGN KEY (enrollment_id) REFERENCES member_plan_enrollment(id)
);

✅ ERD (Summary)
roles ---< user_roles >--- users
users ---< trainer_profiles
users ---< member_profiles >--- users (trainer)
plans ---< member_plan_enrollment ---< payments
users ---< attendance
users ---< sessions >--- users