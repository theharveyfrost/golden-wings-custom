-- Create the database
CREATE DATABASE IF NOT EXISTS golden_wings_custom;
USE golden_wings_custom;

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    client_name VARCHAR(255),
    client_feedback TEXT,
    completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create artwork_images table
CREATE TABLE IF NOT EXISTS artwork_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artwork_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create garages table
CREATE TABLE IF NOT EXISTS garages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    max_daily_appointments INT DEFAULT 8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    garage_id INT NOT NULL,
    service_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    notes TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (garage_id) REFERENCES garages(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Insert services
INSERT INTO services (name, description, duration_minutes) VALUES
('Custom Paint Job', 'Full vehicle custom paint job with premium materials', 1440),
('Interior Detailing', 'Deep cleaning and conditioning of vehicle interior', 240),
('Performance Tuning', 'Engine and performance optimization', 180),
('Consulting and Observation Visit', 'Initial consultation and vehicle assessment', 60);

-- Insert garages
INSERT INTO garages (name, location, address, phone, email, max_daily_appointments) VALUES
('GWC CASA', 'Casablanca', '123 Custom Street, Casablanca, Morocco', '+212 522 123 456', 'casa@goldenwings.ma', 8),
('GWC RABAT', 'Rabat', '456 Auto Lane, Rabat, Morocco', '+212 537 123 456', 'rabat@goldenwings.ma', 6),
('GWC AGADIR', 'Agadir', '789 Motor Way, Agadir, Morocco', '+212 528 123 456', 'agadir@goldenwings.ma', 5);

-- Insert sample data for artworks (optional)
INSERT INTO artworks (title, description, client_name, client_feedback, completion_date) VALUES
('Custom Interior & Exterior', 'Full custom interior in burnt-orange leather, polished engine bay detailing, and bespoke exterior wings with a maroon & copper two-tone finish.', 'Victor M.', 'Feels like a retro spaceship. Absolute Perfection.', '2024-06-21');

-- Insert sample image for the artwork
INSERT INTO artwork_images (artwork_id, image_url, is_primary) VALUES
(1, '/images/sample-car.jpg', TRUE);
