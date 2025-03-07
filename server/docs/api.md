# RevoBike API Documentation

Base URL: `http://localhost:5000`

## Authentication Endpoints

### POST /register
- **Description**: Registers a new user.
- **Full URL**: `http://localhost:5000/register`
- **Input**: User registration details (in request body).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "User registered successfully."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```
- **Testing Instructions**:
  - Use Postman or cURL to send a POST request to the URL with the following JSON body:
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "password123"
    }
    ```

### POST /login
- **Description**: Logs in a user.
- **Full URL**: `http://localhost:5000/login`
- **Input**: User login credentials (in request body).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "token": "JWT_TOKEN"
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```
- **Testing Instructions**:
  - Send a POST request to the URL with the following JSON body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

### GET /profile
- **Description**: Retrieves the profile of the logged-in user.
- **Full URL**: `http://localhost:5000/profile`
- **Input**: Requires authentication (token).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "user": {
        "id": "USER_ID",
        "name": "User Name",
        "email": "user@example.com"
      }
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```
- **Testing Instructions**:
  - Send a GET request to the URL with the Authorization header:
    ```
    Authorization: Bearer JWT_TOKEN
    ```

### GET /admin
- **Description**: Admin-only route that returns a welcome message.
- **Full URL**: `http://localhost:5000/admin`
- **Input**: Requires authentication and admin role.
- **Output**: 
  - Success: 
    ```json
    {
      "message": "Welcome Admin!"
    }
    ```
- **Testing Instructions**:
  - Send a GET request to the URL with the Authorization header:
    ```
    Authorization: Bearer JWT_TOKEN
    ```

## Bike Endpoints

### GET /bikes
- **Description**: Retrieves a list of all bikes in the system.
- **Full URL**: `http://localhost:5000/bikes`
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": [
        {
          "bikeId": "BIKE123",
          "latitude": 40.7128,
          "longitude": -74.0060
        }
      ]
    }
    ```
- **Testing Instructions**:
  - Send a GET request to the URL with the Authorization header:
    ```
    Authorization: Bearer JWT_TOKEN
    ```

### GET /bikes/{id}
- **Description**: Retrieves a specific bike by its MongoDB ID.
- **Full URL**: `http://localhost:5000/bikes/{id}`
- **Input**: Path parameter `id` (the MongoDB ID of the bike).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": {
        "bikeId": "BIKE123",
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Bike not found."
    }
    ```
- **Testing Instructions**:
  - Send a GET request to the URL with the Authorization header:
    ```
    Authorization: Bearer JWT_TOKEN
    ```

### POST /bikes
- **Description**: Creates a new bike (admin only).
- **Full URL**: `http://localhost:5000/bikes`
- **Input**: JSON object with `bikeId`, `latitude`, and `longitude`.
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": {
        "bikeId": "BIKE123",
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```
- **Testing Instructions**:
  - Send a POST request to the URL with the following JSON body and Authorization header:
    ```json
    {
      "bikeId": "BIKE123",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
    ```
    ```
    Authorization: Bearer JWT_TOKEN
    ```

### DELETE /bikes/{id}
- **Description**: Deletes a bike by its MongoDB ID (admin only).
- **Full URL**: `http://localhost:5000/bikes/{id}`
- **Input**: Path parameter `id` (the MongoDB ID of the bike).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "Bike deleted."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Bike not found."
    }
    ```
- **Testing Instructions**:
  - Send a DELETE request to the URL with the Authorization header:
    ```
    Authorization: Bearer JWT_TOKEN
    ```

### POST /bikes/location/update
- **Description**: Updates the current location of a bike (authenticated users only).
- **Full URL**: `http://localhost:5000/bikes/location/update`
- **Input**: JSON object with `bikeId`, `latitude`, and `longitude`.
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "Location updated successfully.",
      "data": {
        "bikeId": "BIKE123",
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```
- **Testing Instructions**:
  - Send a POST request to the URL with the following JSON body and Authorization header:
    ```json
    {
      "bikeId": "BIKE123",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
    ```
    ```
    Authorization: Bearer JWT_TOKEN
    ```

## Payment Endpoints

### POST /payments
- **Description**: Creates a new payment.
- **Full URL**: `http://localhost:5000/payments`
- **Input**: Payment details (in request body).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "Payment created successfully."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```
- **Testing Instructions**:
  - Send a POST request to the URL with the payment details in the request body and Authorization header.

### GET /payments
- **Description**: Retrieves all payments (admin only).
- **Full URL**: `http://localhost:5000/payments`
- **Input**: Requires authentication and admin role.
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": [
        {
          "paymentId": "PAYMENT123",
          "amount": 100,
          "status": "completed"
        }
      ]
    }
    ```

### GET /payments/history
- **Description**: Retrieves the payment history for the logged-in user.
- **Full URL**: `http://localhost:5000/payments/history`
- **Input**: Requires authentication.
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": [
        {
          "paymentId": "PAYMENT123",
          "amount": 100,
          "status": "completed"
        }
      ]
    }
    ```

### GET /payments/{id}
- **Description**: Retrieves a specific payment by its ID.
- **Full URL**: `http://localhost:5000/payments/{id}`
- **Input**: Path parameter `id` (the ID of the payment).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": {
        "paymentId": "PAYMENT123",
        "amount": 100,
        "status": "completed"
      }
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Payment not found."
    }
    ```

### PUT /payments/{id}/status
- **Description**: Updates the status of a payment (admin only).
- **Full URL**: `http://localhost:5000/payments/{id}/status`
- **Input**: Path parameter `id` (the ID of the payment).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "Payment status updated."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```

## Ride Endpoints

### POST /rides/start/{bikeId}
- **Description**: Starts a ride for a specific bike.
- **Full URL**: `http://localhost:5000/rides/start/{bikeId}`
- **Input**: Path parameter `bikeId` (the ID of the bike).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "Ride started."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```

### POST /rides/end/{rideId}
- **Description**: Ends a ride for a specific ride ID.
- **Full URL**: `http://localhost:5000/rides/end/{rideId}`
- **Input**: Path parameter `rideId` (the ID of the ride).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "Ride ended."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```

### GET /rides/history
- **Description**: Retrieves the ride history for the logged-in user.
- **Full URL**: `http://localhost:5000/rides/history`
- **Input**: Requires authentication.
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": [
        {
          "rideId": "RIDE123",
          "bikeId": "BIKE123",
          "status": "completed"
        }
      ]
    }
    ```

### GET /rides
- **Description**: Retrieves all rides (admin only).
- **Full URL**: `http://localhost:5000/rides`
- **Input**: Requires authentication and admin role.
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": [
        {
          "rideId": "RIDE123",
          "bikeId": "BIKE123",
          "status": "completed"
        }
      ]
    }
    ```

## User Endpoints

### GET /users
- **Description**: Retrieves all users (admin only).
- **Full URL**: `http://localhost:5000/users`
- **Input**: Requires authentication and admin role.
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": [
        {
          "userId": "USER123",
          "name": "User Name",
          "email": "user@example.com"
        }
      ]
    }
    ```

### GET /users/{id}
- **Description**: Retrieves a specific user by their ID.
- **Full URL**: `http://localhost:5000/users/{id}`
- **Input**: Path parameter `id` (the ID of the user).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "data": {
        "userId": "USER123",
        "name": "User Name",
        "email": "user@example.com"
      }
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "User not found."
    }
    ```

### PUT /users/{id}
- **Description**: Updates a specific user's information.
- **Full URL**: `http://localhost:5000/users/{id}`
- **Input**: Path parameter `id` (the ID of the user).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "User updated."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
    ```

### DELETE /users/{id}
- **Description**: Deletes a specific user by their ID (admin only).
- **Full URL**: `http://localhost:5000/users/{id}`
- **Input**: Path parameter `id` (the ID of the user).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "User deleted."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "User not found."
    }
    ```

### POST /users/admin
- **Description**: Adds a new admin user (super admin only).
- **Full URL**: `http://localhost:5000/users/admin`
- **Input**: User details (in request body).
- **Output**: 
  - Success: 
    ```json
    {
      "success": true,
      "message": "Admin user added."
    }
    ```
  - Error: 
    ```json
    {
      "success": false,
      "message": "Error message."
    }
