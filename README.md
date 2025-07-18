# Share-a-Ride Backend

This is the backend (Node.js/Express) for Share-a-Ride.

## Features
- Unified user/driver model with admin approval for drivers
- Role-based access control: user, driver, admin, support, superadmin
- Admin endpoints for driver approval/rejection
- Audit logging for admin/support actions
- Comprehensive validation and error handling

## Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file (see `.env.example`):
   - Database credentials
   - JWT secret
   - Email credentials
   - ImageKit keys
3. Run migrations and seeders:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Roles
- `user`: Can book rides, request driver upgrade
- `driver`: Can create rides (after admin approval)
- `admin`: Can manage users, approve/reject drivers, view audit logs
- `support`: (optional) Can view data, assist with disputes
- `superadmin`: (optional) Can manage admins and system settings

## Driver Approval Flow
1. User submits driver documents via `/users/request-driver-upgrade`
2. Admin reviews pending requests via `/admin/pending-drivers`
3. Admin approves (`/admin/approve-driver/:userId`) or rejects (`/admin/reject-driver/:userId`) the request

## Monitoring & Alerting

This project uses [Sentry](https://sentry.io/) for error monitoring and alerting. To enable:
- Set `SENTRY_DSN` in your `.env` file (see .env.example)
- All unhandled errors will be reported to your Sentry project

## .env.example
```
# Database
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_NAME_TEST=
DB_HOST=

# JWT
SECRET_KEY=

# Nodemailer
EMAIL_USER=
EMAIL_PASS=

# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

## API Documentation
See [API_docs.md](./API_docs.md) for full endpoint details.

Interactive Swagger UI: [http://localhost:PORT/api-docs](http://localhost:PORT/api-docs)
