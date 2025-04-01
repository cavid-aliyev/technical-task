# Balance Management Application

This is a Node.js application that provides a REST API for managing user balances with safeguards to prevent negative balances.

## Tech Stack

- **Node.js**: Runtime environment
- **Express**: Web application framework
- **PostgreSQL**: Primary database
- **Sequelize ORM**: Object Relational Mapper for PostgreSQL
- **Umzug**: Migration management

## Requirements (Part 1)

- Create a simple web application using Node.js (Express), PostgreSQL (Sequelize ORM)
- On startup, create a users table via migration with a user account that has a balance of 10000
- Create a route to update user balance (increase or decrease)
- Ensure user balance cannot be negative
- Balance updates must happen in real-time, without using queues or delayed tasks
- Application must handle 10000 simultaneous requests to withdraw 2 units each
    - 5000 should succeed
    - 5000 should fail with an appropriate insufficient funds error

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
    - Copy `.env.example` to `.env`
    - Update database connection details

3. Create the database:
   ```bash
   createdb balance_app
   ```

4. Run migrations:
   ```bash
   npm run migrate
   ```

5. Start the application:
   ```bash
   npm start
   ```

## API Endpoints

### Get User Details
- **URL**: `/api/users/:userId`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "balance": 10000
    }
  }
  ```

### Update User Balance
- **URL**: `/api/users/:userId/balance`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "amount": -2
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "balance": 9998,
      "previousBalance": 10000,
      "amount": -2
    }
  }
  ```
- **Error Response** (Insufficient funds):
  ```json
  {
    "success": false,
    "error": {
      "code": "INSUFFICIENT_FUNDS",
      "message": "Insufficient funds for this operation"
    }
  }
  ```

## Testing the Application

You can use tools like Apache Benchmark or Artillery to simulate high concurrency:

```bash
# Using artillery for load testing (need to install it first: npm install -g artillery)
artillery quick --count 1000 -n 10 -m PUT -b '{"amount":-2}' http://localhost:3000/api/users/1/balance
```
