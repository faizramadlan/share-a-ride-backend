# Share-a-Ride Backend

A comprehensive carpooling platform backend that connects drivers and passengers for shared rides. This Node.js/Express API provides secure, scalable backend services for ride sharing, user management, payment processing, and administrative oversight.

**Note: This project is currently in active development. Expect bugs, errors, and breaking changes as features are being implemented and refined.**

## What is Share-a-Ride?

Share-a-Ride is a carpooling platform that enables users to share rides, reducing transportation costs and environmental impact. Drivers can offer available seats in their vehicles, while passengers can book rides to their destinations. The platform includes comprehensive user management, payment integration, dispute resolution, and administrative tools.

## Features

### Authentication & Security
- JWT-based authentication with refresh tokens
- Role-based access control (user, driver, admin, support, superadmin)
- Email verification with OTP system
- Password reset functionality
- Rate limiting for API endpoints
- Input validation and sanitization
- Secure file upload handling

### User Management
- User registration with email verification
- Profile management with photo uploads
- Driver upgrade requests with document verification
- User rating and review system
- Account status management (active, suspended, banned)
- Multi-role user system

### Ride Management
- Create and manage ride listings
- Real-time ride search and booking
- Ride status tracking (open, booked, completed, cancelled)
- Seat availability management
- Ride history and analytics
- Location-based ride matching

### Payment Integration
- Midtrans payment gateway integration
- Secure payment token generation
- Transaction history tracking
- Payment status management
- Refund processing capabilities

### Driver Management
- Driver approval workflow
- Document verification system
- Vehicle registration and management
- Driver status tracking
- Performance monitoring

### Administrative Features
- Comprehensive admin dashboard
- User management and oversight
- Driver approval/rejection system
- Ride monitoring and moderation
- System analytics and reporting
- Audit logging for all admin actions

### Dispute Resolution
- Dispute creation and tracking
- Support ticket management
- Resolution workflow
- Communication system
- Dispute history and analytics

### Technical Features
- RESTful API design
- Comprehensive error handling
- Request/response logging
- Database migrations and seeding
- Docker containerization
- CI/CD pipeline integration
- API documentation with Swagger
- Environment-based configuration

### Database & Storage
- Sequelize ORM with MySQL/PostgreSQL
- File upload to ImageKit cloud storage
- Redis caching for performance
- Database migrations and seeding
- Data backup and recovery

### Monitoring & Analytics
- Sentry error monitoring and alerting
- Application performance monitoring
- User activity tracking
- System health monitoring
- Audit trail for compliance

## Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/faizramadlan/share-a-ride-backend.git
   cd share-a-ride-backend
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Set up the database:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm start
   ```

## Environment Configuration

Required environment variables:

```env
# Database Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_NAME_TEST=your_test_database
DB_HOST=localhost

# JWT Configuration
SECRET_KEY=your_jwt_secret_key

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint

# Payment Configuration
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key

# Monitoring
SENTRY_DSN=your_sentry_dsn

# Server Configuration
PORT=3000
NODE_ENV=development
```

## API Documentation

- **Interactive Swagger UI**: `http://localhost:3000/api-docs`
- **API Specification**: `swagger.yaml`
- **Complete endpoint documentation** with request/response examples

## User Roles & Permissions

### User
- Register and manage profile
- Book rides and manage bookings
- Rate drivers and passengers
- Request driver upgrade
- View ride history

### Driver
- All user permissions
- Create and manage ride listings
- Manage vehicle information
- View booking requests
- Update ride status

### Admin
- All driver permissions
- Approve/reject driver applications
- Manage user accounts and status
- Monitor rides and transactions
- View system analytics

### Support
- View user and ride data
- Handle dispute resolution
- Assist with user issues
- Access support tools

### Superadmin
- All admin permissions
- Manage admin accounts
- System configuration
- Full system oversight

## Driver Approval Workflow

1. User submits driver upgrade request with documents
2. Admin reviews pending applications
3. Admin approves or rejects with reason
4. User receives notification of decision
5. Approved users gain driver permissions

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL/PostgreSQL with Sequelize ORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: ImageKit cloud storage
- **Payment**: Midtrans payment gateway
- **Caching**: Redis
- **Monitoring**: Sentry
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker
- **Testing**: Jest

## Project Structure

```
share-a-ride-backend/
├── controllers/          # Request handlers
├── models/              # Database models
├── routes/              # API route definitions
├── middlewares/         # Custom middleware
├── helpers/             # Utility functions
├── migrations/          # Database migrations
├── seeders/             # Database seeders
├── config/              # Configuration files
├── __test__/            # Test files
├── images/              # Uploaded images
└── docs/                # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
