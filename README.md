# RevoBike Project

## Backend Changes
The backend has been updated with the following API endpoints:

### Authentication Endpoints
- **POST /register**: Registers a new user.
- **POST /login**: Logs in a user.
- **GET /profile**: Retrieves the profile of the logged-in user.

### Bike Endpoints
- **GET /bikes**: Retrieves a list of all bikes in the system.
- **POST /bikes**: Creates a new bike (admin only).
- **DELETE /bikes/{id}**: Deletes a bike by its MongoDB ID (admin only).

### Payment Endpoints
- **POST /payments**: Creates a new payment.
- **GET /payments**: Retrieves all payments (admin only).

### Ride Endpoints
- **POST /rides/start/{bikeId}**: Starts a ride for a specific bike.
- **POST /rides/end/{rideId}**: Ends a ride for a specific ride ID.

### User Endpoints
- **GET /users**: Retrieves all users (admin only).

## How to Run the Backend
1. Clone the repository and navigate to the server directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up your MongoDB connection by adding your MongoDB URI to a `.env` file:
   ```
   MONGODB_URI=your_mongodb_uri
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The server will run on port 5000 by default.

## Accessing Swagger UI
You can access the Swagger UI at the following URL:
- [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/)
