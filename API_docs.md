# Share-a-ride App Server

Share-a-ride App is an application to share and book rides. This app has :

- RESTful endpoint for admins, users, and rides CRUD operation
- JSON formatted response

&nbsp;

## RESTful endpoints

&nbsp;

## Rides

### GET /rides

> Get all rides

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
[
  {
    "id": 1,
    "startLocation": "Jakarta",
    "destination": "Bandung",
    "departureTime": "2023-05-10T10:00:00.000Z",
    "arrivalTime": "2023-05-10T13:00:00.000Z",
    "price": 75000,
    "seats": 3,
    "createdBy": 1,
    "VehicleId": 1,
    "createdAt": "2023-05-06T09:20:14.194Z",
    "updatedAt": "2023-05-06T09:20:14.194Z"
  },
  {
    "id": <ride id>,
    "startLocation": <ride origin>,
    "destination": <ride destination>,
    "departureTime": <ride departure time>,
    "arrivalTime": <ride estimated arrival time>,
    "price": <ride price>,
    "seats": <ride seats left>,
    "createdBy": <creator (user) id>,
    "VehicleId": <creator's vehicle id>,
    "createdAt": "2023-05-06T09:20:14.194Z",
    "updatedAt": "2023-05-06T09:20:14.194Z"
  }
]
```

---

### GET /rides/:id

> Get ride by id

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
{
    "id": <ride id>,
    "startLocation": <ride origin>,
    "destination": <ride destination>,
    "departureTime": <ride departure time>,
    "arrivalTime": <ride estimated arrival time>,
    "price": <ride price>,
    "seats": <ride seats left>,
    "createdBy": <creator (user) id>,
    "VehicleId": <creator's vehicle id>,
    "createdAt": "2023-05-06T09:20:14.194Z",
    "updatedAt": "2023-05-06T09:20:14.194Z",
    "UserRides": [
      {
        "id": <userRide id>,
        "UserId": <user id>,
        "RideId": <ride id>,
        "status": <userRide status>
      },
    ]
}
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

---

### POST /rides

> Create new ride

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
{
  "startLocation": "<ride origin>",
  "destination": "<ride destination>",
  "departureTime": "<ride departure time>",
  "arrivalTime": "<ride estimated arrival time>",
  "price": "<ride price per passenger>",
  "seats": "<number of seats available>",
}
```

_Response (201 - Created)_

```
{
  message: "New ride with <ride id> created"
}
```

_Response (400 - Bad Request)_

```
{
  "message": <validation error> || "You need to register a vehicle to create ride"
}
```

---

### DELETE /rides/:id

> Delete ride with "id"

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
{
  message: "Ride with id <ride id> deleted"
}
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

---

### PATCH /rides/:id

> Edit user ride payment status with userRideId "id" //deprecated

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
[
    <user ride id>,
    [
        {
            "id": <user ride id>,
            "UserId": <user id>,
            "RideId": <ride id>,
            "paymentStatus": "paid",
            "createdAt": "2023-05-06T09:20:14.203Z",
            "updatedAt": "2023-05-07T14:55:02.724Z"
        }
    ]
]
```

---

### PUT /rides/:id

> Edit ride with "id"

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
{
  "startLocation": "<ride origin>",
  "destination": "<ride destination>",
  "departureTime": "<ride departure time>",
  "arrivalTime": "<ride estimated arrival time>",
  "price": "<ride price per passenger>",
  "seats": "<number of seats available>",
}
```

_Response (200 - OK)_

```
{
  message: "Ride with id <ride id> updated"
}
```

_Response (400 - Bad Request)_

```
{
  "message": <validation error>
}
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

---

### POST /rides/:generate-midtrans-token

> Generate midtrans token and url for payment purposes and confirm booking

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
{
  "token": "<midtrans token>",
  "redirect_url": "<midtrans url>"
}
```

_Response (400 - Bad Request)_

```
{
  "message": "You are already a booked"
}
```

---

### POST /rides/order/:id

> Create new order for ride with ride id "id"

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (201 - Created)_

```
{
  message: "Order received"
}
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

_Response (400 - Bad Request)_

```
{
  "message": "You have ordered this ride" || "The ride is fully booked"
}
```

---

### DELETE /rides/order/:id

> Cancel order with "id"

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
{
  message: "Order is cancelled"
}
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

_Response (403 - Forbidden)_

```
{
  "message": "Forbidden"
}
```

---

&nbsp;

## Users

### POST /users/register

> Register new User

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name": "<user name>",
  "email": "<user email>",
  "password": "<user password>",
  "phoneNumber": "<user phone number>",
  "photo": "<user photo>",
  "idCardImg": "<user id card photo>",
}
```

_Response (201 - Created)_

```
{
  message: "User <name> has succesfully registered"
}
```

---

### POST /users/login

> User login

_Request Header_

```
not needed
```

_Request Body_

```
{
  "email": "<user email>",
  "password": "<user password>",
}
```

_Response (200 - OK)_

```
{
  "access_token": "<access_token>",
  "name": "<user username>",
  "email": "<user email>",
  "phoneNumber": "<user phone number>",
  "photo": "<user photo>",
  "rating": "<user rating>"
}
```

_Response (400 - Bad Request)_

```
{
  "message": "Email is required" || "Password is required"
}
```

_Response (401 - Unauthorized)_

```
{
  "message": "Email / Password is wrong"
}
```

---

### POST /users/request-driver-upgrade

> User requests to become a driver (submits license and documents)

_Request Header_
```
{
  "access_token": "<your access token>"
}
```

_Request Body_
```
{
  "licenseNumber": "<driver license number>",
  "driverDocuments": { "ktp": "url", "sim": "url" }
}
```

_Response (200 - OK)_
```
{
  "message": "Driver upgrade request submitted successfully. Please wait for admin approval."
}
```

_Response (400 - Bad Request)_
```
{
  "errors": [ { "msg": "License number is required", ... } ]
}
```

---

## GET /users/rides

> Get logged in user's rides

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
[
  {
    "id": 2,
    "UserId": 1,
    "RideId": 1,
    "status": "pending",
    "createdAt": "2023-05-06T09:20:14.203Z",
    "updatedAt": "2023-05-06T09:20:14.203Z",
    "Ride": {
      "id": 1,
      "startLocation": "Jakarta",
      "destination": "Bandung",
      "departureTime": "2023-05-10T10:00:00.000Z",
      "arrivalTime": "2023-05-10T13:00:00.000Z",
      "price": 75000,
      "seats": 3,
      "createdBy": 1,
      "VehicleId": 1,
      "createdAt": "2023-05-06T09:20:14.194Z",
      "updatedAt": "2023-05-06T09:20:14.194Z"
    }
  },
  {
    "id": "<user ride id>",
    "UserId": "<current user id>",
    "RideId": "<ride id>",
    "status": "<ride payment status>",
    "createdAt": "2023-05-06T09:20:14.203Z",
    "updatedAt": "2023-05-06T09:20:14.203Z",
    "Ride": {
      "id": "<ride id>",
      "startLocation": "<ride origin>",
      "destination": "<ride destination>",
      "departureTime": "<ride departure time>",
      "arrivalTime": "<ride estimated arrival time>",
      "price": <ride price>,
      "seats": <number of seats available>,
      "createdBy": <creator (user) id>,
      "VehicleId": <creator (user)'s vehicle id'>,
      "createdAt": "2023-05-06T09:20:14.194Z",
      "updatedAt": "2023-05-06T09:20:14.194Z"
    }
  },
]
```

---

### PATCH /users/rate/:id

> Rate another user with "id"

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
{
  "rating": "<inputted rating>",
}
```

_Response (200 - OK)_

```
{
  "message": "Rated <user name> with <rating> successfully",
}
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

_Response (400 - Bad Request)_

```
{
  "message": "You cannot rate yourself" || "Rating must be between 1-5"
}
```

---

### GET /admin/pending-drivers

> Admin views all users with pending driver requests

_Request Header_
```
{
  "access_token": "<admin access token>"
}
```

_Response (200 - OK)_
```
[
  {
    "id": <user id>,
    "name": "<user name>",
    "email": "<user email>",
    "driverStatus": "pending",
    "licenseNumber": "<driver license number>",
    "driverDocuments": { ... },
    ...
  },
  ...
]
```

---

### PATCH /admin/approve-driver/:userId

> Admin approves a pending driver request

_Request Header_
```
{
  "access_token": "<admin access token>"
}
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
{
  "message": "Driver request for user <user name> has been approved."
}
```

_Response (400 - Bad Request)_
```
{
  "message": "User does not have a pending driver request."
}
```

---

### PATCH /admin/reject-driver/:userId

> Admin rejects a pending driver request

_Request Header_
```
{
  "access_token": "<admin access token>"
}
```

_Request Body_
```
not needed
```

_Response (200 - OK)_
```
{
  "message": "Driver request for user <user name> has been rejected."
}
```

_Response (400 - Bad Request)_
```
{
  "message": "User does not have a pending driver request."
}
```

---

&nbsp;

## Admins

### POST /admin/register

> Register new Admin

_Request Header_

```
not needed
```

_Request Body_

```
{
  "name": "<admin name>",
  "email": "<admin email>",
  "password": "<admin password>"
}
```

_Response (201 - Created)_

```
{
  message: "Admin <name> has succesfully registered"
}
```

---

### POST /admin/login

> Admin login

_Request Header_

```
not needed
```

_Request Body_

```
{
  "email": "<admin email>",
  "password": "<admin password>",
}
```

_Response (200 - OK)_

```
{
  "access_token": "<admin access_token>"
}
```

_Response (400 - Bad Request)_

```
{
  "message": "Email is required" || "Password is required"
}
```

_Response (401 - Unauthorized)_

```
{
  "message": "Email / Password is wrong"
}
```

---

### GET /admin/users

> Get all users

_Request Header_

```
{
  "access_token": "<admin access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
[
  {
    "id": 1,
    "name": "Andi Susanto",
    "email": "andisusanto@contoh.com",
    "phoneNumber": "555-1234",
    "photo": "https://contoh.com/andisusanto.png",
    "idCardImg": "https://contoh.com/andisusanto-id.png",
    "rating": 5,
    "status": "unverified",
    "createdAt": "2023-05-06T09:20:14.053Z",
    "updatedAt": "2023-05-06T09:20:14.053Z"
  },
  {
    "id": <user id>,
    "name": "<user name>",
    "email": "<user email>",
    "phoneNumber": "<user phone number>",
    "photo": "<user photo>",
    "idCardImg": "<user id card image>",
    "rating": <user rating>,
    "status": "<user status>",
    "createdAt": "2023-05-06T09:20:14.053Z",
    "updatedAt": "2023-05-06T09:20:14.053Z"
  }
]
```

---

### GET /admin/users/:id

> Get user by "id"

_Request Header_

```
{
  "access_token": "<admin access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
{
    "id": <user id>,
    "name": "<user name>",
    "email": "<user email>",
    "phoneNumber": "<user phone number>",
    "photo": "<user photo>",
    "idCardImg": "<user id card image>",
    "rating": <user rating>,
    "status": "<user status>",
    "createdAt": "2023-05-06T09:20:14.053Z",
    "updatedAt": "2023-05-06T09:20:14.053Z"
  }
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

---

### PATCH /admin/users/:userId

> Change status of user with <userId>

_Request Header_

```
{
  "access_token": "<admin access token>"
}
```

_Request Body_

```
{
  "status": "<new status>"
}
```

_Response (200 - OK)_

```
{
    "message": "Status of user with id <user id> has been changed to <status>"
  }
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

_Response (400 - Bad Request)_

```
{
  "message": "No changes has been made"
}
```

---

### GET /admin/rides

> Get all rides for admin

_Request Header_

```
{
  "access_token": "<admin access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
[
  {
    "id": 1,
    "startLocation": "Jakarta",
    "destination": "Bandung",
    "departureTime": "2023-05-10T10:00:00.000Z",
    "arrivalTime": "2023-05-10T13:00:00.000Z",
    "price": 75000,
    "seats": 3,
    "createdBy": 1,
    "VehicleId": 1,
    "createdAt": "2023-05-06T09:20:14.194Z",
    "updatedAt": "2023-05-06T09:20:14.194Z"
  },
  {
    "id": <ride id>,
    "startLocation": <ride origin>,
    "destination": <ride destination>,
    "departureTime": <ride departure time>,
    "arrivalTime": <ride estimated arrival time>,
    "price": <ride price>,
    "seats": <ride seats left>,
    "createdBy": <creator (user) id>,
    "VehicleId": <creator's vehicle id>,
    "createdAt": "2023-05-06T09:20:14.194Z",
    "updatedAt": "2023-05-06T09:20:14.194Z"
  }
]
```

---

### DELETE /admin/rides/:id

> Delete ride with "id"

_Request Header_

```
{
  "access_token": "<admin access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
{
  message: "Ride with id <ride id> deleted"
}
```

_Response (404 - Not Found)_

```
{
  "message": "Data not found"
}
```

---

## Global Errors

_Response (500 - Internal Server Error)_

```
{
  "message": "Internal Server Error"
}
```

_Response (403 - Forbidden)_

```
{
  "message": "Forbidden"
}
```

_Response (400 - Bad request)_

```
{
  "message": "Access Token Missing"
}
```

## User Model (fields)
- id
- name
- email
- password
- phoneNumber
- address
- photo
- idCardImg
- rating
- status
- money
- role: "user" | "driver" | "admin" | "support" | "superadmin"
- driverStatus: "none" | "pending" | "approved" | "rejected"
- licenseNumber: string | null
- driverDocuments: object | null

## Admin Model (fields)
- id
- name
- email
- password
- role: "admin" | "superadmin" | "support"

## Ride Model (fields)
- id
- startLocation
- destination
- departureTime
- arrivalTime
- price
- seats
- status: "open" | "in_progress" | "completed" | "cancelled"
- createdBy (UserId)
- VehicleId

## Vehicle Model (fields)
- id
- type
- plateNumber
- status: "active" | "inactive" | "pending_approval"
- UserId

## AuditLog Model (fields)
- id
- adminId
- action
- targetId
- targetType
- details
- createdAt
- updatedAt

## User Email OTP Verification

### POST /users/request-email-otp

> Request an OTP to be sent to the user's email for registration verification.

_Request Body_
```
{
  "email": "user@example.com"
}
```
_Response (200 - OK)_
```
{
  "message": "OTP sent to email"
}
```
_Response (400 - Bad Request)_
```
{
  "message": "Email is required" | "Email already verified"
}
```

---

### POST /users/verify-email-otp

> Verify the OTP sent to the user's email.

_Request Body_
```
{
  "email": "user@example.com",
  "otp": "123456"
}
```
_Response (200 - OK)_
```
{
  "message": "Email verified successfully"
}
```
_Response (400 - Bad Request)_
```
{
  "message": "No OTP requested for this email" | "Invalid OTP" | "OTP expired"
}
```

---

### Registration Flow Update

> Registration now requires the email to be verified via OTP before proceeding.

1. Call `POST /users/request-email-otp` with the user's email.
2. User receives OTP via email.
3. Call `POST /users/verify-email-otp` with the email and OTP.
4. After successful verification, call `POST /users/register` with the full registration data.

If the email is not verified, registration will fail with:
```
{
  "message": "Email not verified. Please verify your email via OTP before registering."
}
```

## Disputes (Support Role)

### GET /disputes
> List all disputes (support only)

_Request Header_
```
{ "access_token": "<support access token>" }
```
_Response (200 - OK)_
```
[ { id, rideId, userId, description, status, resolvedBy, resolvedAt, createdAt, updatedAt, ... } ]
```

### GET /disputes/:id
> Get dispute details (support only)

_Request Header_
```
{ "access_token": "<support access token>" }
```
_Response (200 - OK)_
```
{ id, rideId, userId, description, status, resolvedBy, resolvedAt, createdAt, updatedAt, ... }
```

### PATCH /disputes/:id/resolve
> Resolve a dispute (support only)

_Request Header_
```
{ "access_token": "<support access token>" }
```
_Response (200 - OK)_
```
{ message: "Dispute resolved" }
```

### POST /rides/:id/disputes
> User creates a dispute for a ride

_Request Header_
```
{ "access_token": "<user access token>" }
```
_Request Body_
```
{ "description": "Problem description" }
```
_Response (201 - Created)_
```
{ id, rideId, userId, description, status, ... }
```

### Support Role View-Only Access
- GET /users, GET /users/:id — support can view all users
- GET /rides, GET /rides/:id — support can view all rides

## Role Management (Superadmin)

### PATCH /admin/assign-role/:userId
> Assign or revoke a role for a user or admin (superadmin only)

_Request Header_
```
{ "access_token": "<superadmin access token>" }
```
_Request Body_
```
{ "role": "user" | "driver" | "admin" | "support" | "superadmin" }
```
_Response (200 - OK)_
```
{ "message": "Role updated to <role> for user/admin <userId>" }
```
_Response (400 - Bad Request)_
```
{ "message": "Invalid role." }
```
_Response (403 - Forbidden)_
```
{ "message": "Only superadmin can assign roles." }
```
_Response (404 - Not Found)_
```
{ "message": "User or admin not found." }
```

_Notes:_
- Only superadmin can assign/revoke roles.
- All role changes are audit logged.

## Authentication: Refresh Token

### POST /users/login
> Login and receive access and refresh tokens

_Response (200 - OK)_
```
{
  "access_token": "...",
  "refresh_token": "...",
  ...
}
```

### POST /users/refresh-token
> Exchange refresh token for new access token

_Request Body_
```
{ "refresh_token": "..." }
```
_Response (200 - OK)_
```
{ "access_token": "..." }
```
_Response (401 - Unauthorized)_
```
{ "message": "Invalid or expired refresh token" }
```

### POST /users/logout
> Invalidate a refresh token

_Request Body_
```
{ "refresh_token": "..." }
```
_Response (200 - OK)_
```
{ "message": "Logged out" }
```
_Response (400 - Bad Request)_
```
{ "message": "Invalid refresh token" }
```

## Password Reset

### POST /users/request-password-reset
> Request a password reset OTP to be sent to the user's email

_Request Body_
```
{ "email": "user@example.com" }
```
_Response (200 - OK)_
```
{ "message": "Password reset OTP sent to email" }
```
_Response (404 - Not Found)_
```
{ "message": "User not found" }
```

### POST /users/reset-password
> Reset password using OTP

_Request Body_
```
{ "email": "user@example.com", "otp": "123456", "newPassword": "newpass" }
```
_Response (200 - OK)_
```
{ "message": "Password reset successful" }
```
_Response (400 - Bad Request)_
```
{ "message": "No OTP requested for this email" | "Invalid OTP" | "OTP expired" }
```
