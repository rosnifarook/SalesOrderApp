# Sales Order Application

A full-stack Sales Order management web application built with **.NET Core Web API** and **React**, following SPIL Labs interview test requirements.

## Tech Stack

### Backend
- .NET 10 Web API
- Layered (N-Tier) Architecture
- Entity Framework Core + SQL Server
- AutoMapper + Dependency Injection

### Frontend
- React (Functional Components + Hooks)
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

## Project Structure

```
SalesOrderApp/
├── API/                         # API Layer
│   ├── Controllers/
│   └── Models/                  # DTOs
├── Application/                 # Business Logic Layer
│   ├── Interfaces/
│   └── Services/
├── Domain/                        # Domain Layer
│   └── Entities/
├── Infrastructure/                # Data Access Layer
│   ├── Data/
│   └── Repositories/
├── Database/                      # SQL Server database script
└── client/                        # React frontend
    └── src/
        ├── components/
        ├── pages/
        ├── redux/
        │   ├── slices/
        │   └── store.js
        ├── services/
        ├── hooks/
        └── utils/
```

## Prerequisites

- [.NET SDK 10+](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- SQL Server or SQL Server LocalDB

## Database Setup

### Option 1: EF Core Migrations (Recommended)
The API automatically applies migrations on startup.

Update connection string in `API/appsettings.json` if needed:

```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SalesOrderDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

### Option 2: Manual SQL Script
Run `Database/SalesOrderDb.sql` in SQL Server Management Studio.

## Running the Application

### 1. Start the Backend API

```bash
cd API
dotnet run
```

API runs at: `http://localhost:5280` (or check console output)

### 2. Start the React Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all customers |
| GET | `/api/clients/{id}` | Get customer by ID |
| GET | `/api/items` | List all items |
| GET | `/api/salesorders` | List all sales orders |
| GET | `/api/salesorders/{id}` | Get sales order by ID |
| POST | `/api/salesorders` | Create new sales order |
| PUT | `/api/salesorders/{id}` | Update existing sales order |

## Features

### Screen 1 - Sales Order
- Customer dropdown populated from `Client` table
- Auto-fill address fields on customer selection (editable)
- Item Code and Description dropdowns (linked selection)
- Line item calculations:
  - Excl Amount = Quantity × Price
  - Tax Amount = Excl Amount × Tax Rate / 100
  - Incl Amount = Excl Amount + Tax Amount
- Order totals (Total Excl, Total Tax, Total Incl)
- Save new / edit existing orders
- Print order option

### Screen 2 - Home
- Lists all saved sales orders
- Add New button navigates to Sales Order screen
- Double-click row to open order for editing

## Database Tables

- **Client** - Customer master data
- **Item** - Product/item master data
- **SalesOrder** - Order header
- **SalesOrderLine** - Order line items

## License

Built for SPIL Labs (Pvt) Ltd interview assessment.
