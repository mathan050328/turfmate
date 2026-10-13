# Turf Management System

A full-stack sports venue discovery and slot reservation platform built with Spring Boot and MongoDB.

## Features
- **Venue Discovery & Booking**: Real-time slot availability (6 AM to 10 PM) with instant collision prevention.
- **Secure Authentication**: BCrypt password hashing, Gmail SMTP email verification with 6-digit OTP codes.
- **Admin Dashboard**: View total reservations, confirmed/pending status breakdown, customer analytics, and revenue tracking.
- **Payment Processing**: Integrated checkout flow supporting UPI, QR Code, Card, and Pay-at-Turf options.
- **Modern Responsive UI**: Single-page application built with Bootstrap 5, Bootstrap Icons, and Glassmorphism dark theme.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3.2.0, Spring Data MongoDB, Spring Mail (JavaMailSender), Spring Security Crypto (BCrypt)
- **Database**: MongoDB (Local or Atlas)
- **Frontend**: Single-Page Application (HTML5, CSS3, JavaScript ES6+, Bootstrap 5)
- **Build & Dependency Management**: Maven

## Quick Start

### 1. Prerequisites
- Java Development Kit (JDK 17+)
- Apache Maven (3.8+)
- MongoDB running locally on `mongodb://localhost:27017`

### 2. Run the Application
Open a terminal in the project directory and run:

```bash
mvn spring-boot:run
```

The application will start on port **9123**.

### 3. Access the Web App
Open your browser and navigate to:
```
http://localhost:9123
```

- **User Access**: Register a new account or browse turfs directly.
- **Admin Dashboard**: Login using admin credentials (`mathanadmin@gmail.com` / `admin1234`) to access `/admin.html`.

## Project Structure
```
├── src
│   ├── main
│   │   ├── java/com/example/turf
│   │   │   ├── config/          # Security, Seeding & Routing config
│   │   │   ├── controller/      # REST API Controllers (Auth, Turf, Payment, Admin)
│   │   │   ├── model/           # MongoDB Document Models (User, Turf, Booking, Role)
│   │   │   ├── repository/      # Spring Data MongoDB Repositories
│   │   │   └── service/         # Business logic (Booking, Email, Validation)
│   │   └── resources
│   │       ├── application.properties
│   │       └── static/          # Web UI (index.html, admin.html, images)
│   └── test/                    # JUnit 5 Unit & Integration tests
├── pom.xml
└── README.md
```
