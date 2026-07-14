# Turf Management System

A production‑ready full‑stack application for managing sports turfs.

## Features
- Role‑based JWT authentication (Admin, Owner, Customer)
- Admin dashboard with statistics
- Turf owners can create and manage turfs, set availability
- Customers can browse, filter, and book turfs in real‑time
- Mock payment flow
- Responsive UI built with Bootstrap 5 and modern design

## Tech Stack
- **Backend**: Java 17, Spring Boot 3, JPA/Hibernate, MySQL, JWT
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5, Chart.js
- **Build**: Maven

## Getting Started
1. Install Java 17 and Maven.
2. Create a MySQL database `turfdb` and update `src/main/resources/application.properties`.
3. Run `mvn clean install`.
4. Start the server: `java -jar target/turf-management-0.0.1-SNAPSHOT.jar`.
5. Open `frontend/index.html` in a browser.
