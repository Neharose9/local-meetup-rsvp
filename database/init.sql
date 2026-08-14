CREATE DATABASE IF NOT EXISTS meetup_db;

USE meetup_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    created_by INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_events_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    status ENUM('going', 'maybe', 'declined') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_rsvps_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rsvps_event
        FOREIGN KEY (event_id)
        REFERENCES events(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_event
        UNIQUE (user_id, event_id)
);

-- Seed users
INSERT INTO users (name, email, password_hash)
VALUES
(
    'Neha',
    'neha@example.com',
    '$2b$10$QRSf/s0tt3bWo8lLpdwKYOPgRJfasNj7/fuRJWFTrSDqOvR1t.CNe'
),
(
    'Rahul',
    'rahul@example.com',
    '$2b$10$HKhuDcVkngwtz.gwn4MCVuHN1aoTb4oL3QWHv6kYqNNMKeOh9/Due'
),
(
    'Anu',
    'anu@example.com',
    '$2b$10$AHuwdZXyFtyhgb0RaJVfvucRYfkl46P/H4VSXxLW64zJ..eMLO55y'
);