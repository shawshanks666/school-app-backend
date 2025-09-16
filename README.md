Tech Stack

Backend:

    Framework: NestJS (Node.js)

    Database: MongoDB with Mongoose

    Authentication: JWT (JSON Web Tokens) with Passport.js

    Styling: None (API only)


Setup

0. Prerequisites

    Node.js (v18 or later recommended)

    npm or yarn

    A MongoDB Atlas account for the database connection string.

1. Installation

    Clone the repository and navigate into the backend folder (e.g., school-app-backend).

    git clone <your-repo-url>
    cd <your-repo-folder>/school-app-backend

    Install the required dependencies.

    npm install

2. Environment Variables

    Create a .env file in the root of the backend folder.

    Copy the contents of .env.example (if provided) or add the following required variables:

    # MongoDB Connection
    MONGO_URI=your_mongodb_atlas_connection_string

    # JWT Secret for app authentication
    JWT_SECRET=your_super_secret_and_long_jwt_string

    # Payment Gateway Credentials (from assessment)
    PG_KEY=edvtest01
    API_KEY=your_payment_gateway_api_key
    SCHOOL_ID=65b0e6293e9f76a9694d84b4

3. Running the Server

To start the backend development server, run:

npm run start:dev

The API will be available at http://localhost:3000.
Backend API Endpoints

All endpoints under /transactions and /payments are protected and require a valid JWT Bearer token in the Authorization header.
Authentication (/auth)

    POST /auth/register: Creates a new user account.

        Body: { "email": "testuser@example.com", "password": "qwerty123" }
<img width="1590" height="538" alt="image" src="https://github.com/user-attachments/assets/fa069a32-8f02-4181-8e60-b5b1daa5bd49" />

    POST /auth/login: Authenticates a user and returns an access_token.

        Body: { "email": "testuser@example.com", "password": "qwerty123" }
<img width="1575" height="595" alt="image" src="https://github.com/user-attachments/assets/28505093-18cf-4819-8cfa-cf3858a6c742" />

        GET /auth/profile: 
    
        Body: { "email": "testuser1@example.com", "password": "qwerty123"

        
<img width="1587" height="576" alt="image" src="https://github.com/user-attachments/assets/3e6ef8d7-c42a-42db-b326-38f0caaf68d2" />
Payments (/payments)

    POST /payments/create-payment: Creates a new payment request and returns a payment URL from the provider.

    Body: { "amount": 10000, "callback_url": "https://school-app-frontend-nu.vercel.app/success" }
<img width="1559" height="729" alt="image" src="https://github.com/user-attachments/assets/387f9cfd-47e1-4a31-b8b0-31887e7e8c0d" />


    POST /payments/webhook: (Unprotected) An endpoint for the payment gateway to send transaction status updates.
<img width="1573" height="625" alt="image" src="https://github.com/user-attachments/assets/1d2c125f-ac2b-4b09-81ac-35dabd56a275" />

Transactions (/transactions)

    GET /transactions: Fetches a paginated, sorted, and filtered list of all transactions.

        Query Parameters (Optional):

            page (number, default: 1)

            limit (number, default: 10)

            status (string, e.g., "success", "failed")

            schoolId (string)

            sortBy (string, e.g., "createdAt", "order_amount")

            order (string, "asc" or "desc")
    <img width="1570" height="1141" alt="image" src="https://github.com/user-attachments/assets/54565706-0b79-4b6c-b703-b65fb32d4e2c" />


    GET /transactions/status/:id: Fetches the current status of a single transaction by its unique ID.
<img width="1575" height="509" alt="image" src="https://github.com/user-attachments/assets/3e879339-98a0-442d-b060-cf7adc71027f" />





