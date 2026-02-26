gym_management_system


CREATE TABLE attendance (
    id INT NOT NULL AUTO_INCREMENT,
    member_id INT NOT NULL,
    check_in_at DATETIME DEFAULT NULL,
    check_out_at DATETIME DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    trainer_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX (member_id)
);

CREATE TABLE attendance_backup (
    id INT NOT NULL DEFAULT 0,
    member_id INT NOT NULL,
    check_in_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    check_out_datetime DATETIME DEFAULT NULL,
    notes VARCHAR(255) DEFAULT NULL,
    check_in_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    trainer_id INT DEFAULT NULL
);

CREATE TABLE member_plan_enrollment (
    id INT NOT NULL AUTO_INCREMENT,
    member_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('paid', 'unpaid', 'pending') DEFAULT 'pending',
    PRIMARY KEY (id),
    INDEX (member_id),
    INDEX (plan_id)
);

CREATE TABLE member_profiles (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    membership_status VARCHAR(50) NOT NULL DEFAULT 'Inactive',
    health_goals VARCHAR(200) NOT NULL,
    membership_start_date DATE DEFAULT NULL,
    membership_end_date DATE DEFAULT NULL,
    assigned_trainer_id INT DEFAULT NULL,
    current_plan_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (user_id)
);

CREATE TABLE membership_requests (
    id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) DEFAULT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE payments (
    id INT NOT NULL AUTO_INCREMENT,
    member_id INT NOT NULL,
    enrollment_id INT DEFAULT NULL,
    stripe_payment_id VARCHAR(255) DEFAULT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Stripe',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('success', 'failed', 'pending') DEFAULT 'pending',
    plan_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (stripe_payment_id),
    INDEX (member_id),
    INDEX (enrollment_id),
    INDEX (plan_id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (role_name)
);

CREATE TABLE sessions (
    id INT NOT NULL AUTO_INCREMENT,
    trainer_user_id INT DEFAULT NULL,
    member_user_id INT DEFAULT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'canceled') DEFAULT 'scheduled',
    duration_minutes INT NOT NULL DEFAULT 60,
    notes TEXT DEFAULT NULL,
    completed_at DATETIME DEFAULT NULL,
    canceled_at DATETIME DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX (trainer_user_id),
    INDEX (member_user_id)
);

CREATE TABLE trainer_profiles (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    specialty VARCHAR(100) DEFAULT NULL,
    experience_years INT DEFAULT 0,
    certification_details VARCHAR(255) DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    schedule TEXT DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (user_id)
);

CREATE TABLE user_roles (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (id),
    INDEX (user_id),
    INDEX (role_id)
);

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) DEFAULT NULL,
    gender ENUM('male', 'female', 'other') DEFAULT NULL,
    dob DATE DEFAULT NULL,
    address TEXT DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    role ENUM('admin', 'member', 'trainer') NOT NULL DEFAULT 'member',
    PRIMARY KEY (id),
    UNIQUE KEY (email)
);