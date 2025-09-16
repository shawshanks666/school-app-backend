Tech Stack

Backend:

    Framework: NestJS (Node.js)

    Database: MongoDB with Mongoose

    Authentication: JWT (JSON Web Tokens) with Passport.js

    Styling: None (API only)

Frontend:

    Framework: React with Vite

    Styling: Tailwind CSS

    UI Components: shadcn/ui

    Routing: React Router

    API Communication: Axios

Backend Setup

The backend is a NestJS microservice responsible for handling user authentication, payment processing, and providing data to the frontend.
Prerequisites

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

        Body: { "email": "user@example.com", "password": "yourpassword" }

    POST /auth/login: Authenticates a user and returns an access_token.

        Body: { "email": "user@example.com", "password": "yourpassword" }

Payments (/payments)

    POST /payments/create-payment: Creates a new payment request and returns a payment URL from the provider.

        Body: { "amount": 1500, "callback_url": "https://your-frontend.com/success" }

    POST /payments/webhook: (Unprotected) An endpoint for the payment gateway to send transaction status updates.

Transactions (/transactions)

    GET /transactions: Fetches a paginated, sorted, and filtered list of all transactions.

        Query Parameters (Optional):

            page (number, default: 1)

            limit (number, default: 10)

            status (string, e.g., "success", "failed")

            schoolId (string)

            sortBy (string, e.g., "createdAt", "order_amount")

            order (string, "asc" or "desc")

    GET /transactions/status/:id: Fetches the current status of a single transaction by its unique ID.
