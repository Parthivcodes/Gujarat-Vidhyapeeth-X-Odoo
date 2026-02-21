# FleetFlow — Logistics Command Center

FleetFlow is a comprehensive, production-ready Fleet and Logistics Management System. It provides real-time visibility and control over vehicles, drivers, trips, maintenance, and expenses, empowering logistics companies to optimize their operations efficiently.

## 🌟 Key Features

The system is broken down into several fully integrated modules:

*   **Command Center Dashboard**: Real-time KPIs, live charts (Fuel Spend Trend, Fleet Utilization), and recent active trips. Dashboard data is dynamically aggregated from across the system.
*   **Role-Based Access Control (RBAC)**: Secure access tailored to specific organizational roles:
    *   **Fleet Manager**: Full access to all modules and the Command Center.
    *   **Dispatcher**: Focuses on Vehicle Registry, Drivers, and Trip Dispatch.
    *   **Safety Officer**: Focuses on Driver compliance and Maintenance Logs.
    *   **Financial Analyst**: Focuses on Expenses, Fuel costs, and Analytics.
*   **Vehicle Registry**: Complete CRUD tracking of the fleet including statuses, fuel types, capacities, and VINs.
*   **Trip Dispatching**: End-to-end trip lifecycle tracking (Draft → Dispatched → In Progress → Completed/Cancelled). Includes distance, revenue, and cargo weight tracking.
*   **Driver Management**: Tracks driver compliance, license validity, and automated safety scoring.
*   **Maintenance Logs**: Records scheduled and completed maintenance, parts costs, and auto-calculates upcoming service intervals.
*   **Expenses & Fuel Tracking**: Tracks operational expenditures across various categories (Fuel, Tolls, Insurance, Repairs) for granular financial reporting.
*   **Advanced Analytics engine**: Calculates complex business metrics (Cost per KM, Vehicle ROI, Fuel Efficiency) via dedicated backend intelligence.

## 🛠️ Technology Stack

**Backend (API Engine):**
*   **Framework**: Laravel (PHP)
*   **Database**: MySQL
*   **Authentication**: JWT (JSON Web Tokens)
*   **Architecture**: Service Repository Pattern with dedicated API Controllers

**Frontend (Client UI):**
*   **Framework**: React (Vite)
*   **Language**: TypeScript
*   **Data Fetching/State**: `@tanstack/react-query`, Zustand
*   **Styling**: Tailwind CSS + Shadcn UI
*   **Charts**: Recharts

## 🚀 Installation & Setup

### Prerequisites
*   PHP ^8.2
*   Composer
*   Node.js ^18+ & npm
*   MySQL Server

### Backend Setup (Laravel)
1. Navigate to the backend directory:
   ```bash
   cd fleetflow
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Set up your `.env` file containing your local MySQL database credentials:
   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   ```
4. Run database migrations and seed the presentation data (generates realistic mock data spanning 6 months):
   ```bash
   php artisan migrate:fresh --seed --class=PresentationSeeder
   ```
5. Start the API server:
   ```bash
   php artisan serve --port=8000
   ```

### Frontend Setup (React/Vite)
1. Navigate to the frontend directory:
   ```bash
   cd Frontend/fleet-command-center-main/fleet-command-center-main
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server (configured to proxy API requests to `localhost:8000`):
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:8080` (or the port specified by Vite).

## 📊 Default Test Accounts
After running the `PresentationSeeder`, the following accounts are available. All accounts use the password: `password123`.

*   **Fleet Manager**: `admin@fleetflow.com` (Full Access)
*   **Dispatcher**: `dispatcher@fleetflow.com`
*   **Safety Officer**: `safety@fleetflow.com`
*   **Financial Analyst**: `analyst@fleetflow.com`

---
*Developed as a robust, scalable architecture demonstrating full-stack integration patterns.*
