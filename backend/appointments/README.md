# A Unified Web-Based Appointment Booking system for Government Services
Spring Boot REST API for the appointment booking system.

## Prerequisites
- Java 17 or higher
- Maven 3.8+
- PostgreSQL 16+

## Database Setup
Update database credentials in `src/main/resources/application.properties`:


## Installation
mvn clean install

## Running the Application
mvn spring-boot:run
The API will be available at `http://localhost:8080`

## Running Tests
mvn test


## Key Files

### Configuration Files

- **`pom.xml`** - Maven dependencies and build configuration
- **`src/main/resources/application.properties`** - Application configuration (database, email, etc.)

### Database

- **`src/main/java/ie/gov/appointments/config/DataSeeder.java`** - Seeds initial data (users, services, centres)

### API Endpoints

#### Public Endpoints
- `POST /api/auth/send-code` - Send verification code to email
- `POST /api/auth/verify` - Verify code and login
- `GET /api/services` - Get all services
- `GET /api/centres/service/{serviceId}` - Get centres for a service
- `GET /api/slots/available/{centreId}` - Get available time slots

#### User Endpoints (requires authentication)
- `POST /api/appointments/book` - Book an appointment
- `GET /api/appointments/user/{userId}` - Get user's appointments
- `PUT /api/appointments/{id}/cancel` - Cancel appointment
- `PUT /api/appointments/{id}/reschedule` - Reschedule appointment

#### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/appointments` - Get all appointments
- `POST /api/admin/slots` - Create time slots
- `DELETE /api/admin/slots/{id}` - Delete time slot

## Email Configuration
The application uses Gmail SMTP for sending emails. Update these properties in `application.properties`:


## Technologies Used
- **Spring Boot 4.0.3** - Application framework
- **Spring Data JPA** - Database access
- **PostgreSQL** - Database
- **Spring Mail** - Email service
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework for tests

## Database Schema
The application uses Hibernate to auto-generate tables:
- `users` - User accounts
- `services` - Government services
- `service_centres` - Service locations
- `time_slots` - Available appointment slots
- `appointments` - Booked appointments
- `notifications` - User notifications

## Testing
mvn test