# Mtora - V0 Business Management Backend

V0 of a clean, maintainable, scalable business management backend for an early-stage startup migrating its order management workflow from Google Sheets to a robust relational system.

\---

## 1\. Project Purpose

The startup previously tracked customer orders, pack types, delivery slots, and payment states using a Google Sheet. This backend represents the initial V0 foundation:

* Normalizes customer data, catalog packs, and orders into a relational database.
* Supports multi-pack orders with snapshot pricing (preserving historical `unit\_price`).
* Calculates order totals using Decimal-safe math (never floating-point).
* Built completely independent of any frontend framework, ready for future web/mobile clients.

\---

## 2\. High-Level Architecture

```
Client / Future Frontend
         │
         ▼ (HTTP / JSON)
   FastAPI Application (/api/v1)
         │
         ▼
     API Routers (/customers, /packs, /orders, /health)
         │
         ▼
    Service Layer (customer\_service, pack\_service, order\_service)
         │
         ▼
    SQLAlchemy 2.x ORM \& Sessions
         │
         ▼
 PostgreSQL (Supabase) / SQLite (tests \& local dev)
```

* **API Layer**: Handles request routing, response serialization via Pydantic v2 schemas, and HTTP error mappings.
* **Service Layer**: Encapsulates transactional business logic (validating entities, pricing snapshots, Decimal arithmetic).
* **Persistence Layer**: SQLAlchemy 2.x declarative models with Alembic schema migrations.

\---

## 3\. Technology Stack

* **Python 3.10+** (tested on Python 3.14)
* **FastAPI**: Modern, high-performance web framework
* **Uvicorn**: ASGI web server
* **SQLAlchemy 2.x**: Object Relational Mapper with declarative mapping
* **PostgreSQL / Supabase**: Production database infrastructure
* **psycopg 3**: Modern PostgreSQL database adapter
* **Pydantic v2 \& pydantic-settings**: Request/response validation and environment config
* **Alembic**: Database schema migration framework
* **pytest**: Test automation suite

\---

## 4\. Folder Structure

```
backend/
├── app/
│   ├── \_\_init\_\_.py
│   ├── main.py                  # FastAPI application entrypoint \& error handlers
│   ├── core/
│   │   ├── \_\_init\_\_.py
│   │   ├── config.py            # Pydantic BaseSettings and DB URL normalization
│   │   └── exceptions.py        # Domain exceptions (EntityNotFoundError, etc.)
│   ├── db/
│   │   ├── \_\_init\_\_.py
│   │   ├── base.py              # DeclarativeBase with model registrations for Alembic
│   │   ├── session.py           # Engine and SessionLocal session factory
│   │   └── seed.py              # Repeatable idempotent pack seed logic
│   ├── models/
│   │   ├── \_\_init\_\_.py
│   │   ├── customer.py          # Customer ORM model
│   │   ├── pack.py              # Pack ORM model
│   │   ├── order.py             # Order ORM model
│   │   └── order\_item.py        # OrderItem ORM model
│   ├── schemas/
│   │   ├── \_\_init\_\_.py
│   │   ├── customer.py          # CustomerCreate, CustomerUpdate, CustomerResponse
│   │   ├── pack.py              # PackResponse
│   │   ├── order.py             # OrderCreate, OrderUpdate, OrderResponse
│   │   └── order\_item.py        # OrderItemCreate, OrderItemResponse
│   ├── services/
│   │   ├── \_\_init\_\_.py
│   │   ├── customer\_service.py  # Customer business logic
│   │   ├── pack\_service.py      # Pack retrieval
│   │   └── order\_service.py     # Transactional order creation \& price calculation
│   └── api/
│       ├── \_\_init\_\_.py
│       └── routes/
│           ├── \_\_init\_\_.py      # Combined API router
│           ├── customers.py     # /api/v1/customers endpoints
│           ├── packs.py         # /api/v1/packs endpoints
│           └── orders.py        # /api/v1/orders endpoints
├── alembic/
│   ├── env.py                   # Migration environment configuration
│   ├── script.py.mako
│   └── versions/
│       └── 9470fbb11f5a\_initial\_schema.py
├── scripts/
│   └── seed\_packs.py            # CLI entrypoint to seed initial packs
├── tests/
│   ├── \_\_init\_\_.py
│   ├── conftest.py              # Pytest in-memory DB and TestClient fixture
│   ├── test\_customers.py        # Customer CRUD and health tests
│   ├── test\_packs.py            # Pack retrieval and price validation tests
│   └── test\_orders.py           # Multi-item orders and price preservation tests
├── .env.example
├── .gitignore
├── alembic.ini
├── requirements.txt
└── README.md
```

\---

## 5\. Database Architecture

### Initial 4 Core Tables

```
customers (1) ───────────< orders (N)
                             │ (1)
                             ▼
                        order\_items (N)
                             ▲
                             │ (N)
                          packs (1)
```

1. **`customers`**

   * `id`: Integer Primary Key
   * `name`: String, NOT NULL
   * `mobile\_no`: String(50), NOT NULL, indexed (never stored as integer)
   * `whatsapp\_no`: String(50), nullable
   * `address`: Text, nullable
   * `location`: String(255), nullable
   * `created\_at`, `updated\_at`: DateTime(timezone=True)
2. **`packs`**

   * `id`: Integer Primary Key
   * `code`: String(50), unique, indexed (`pack1`, `pack2`, `pack5`)
   * `name`: String(255), NOT NULL
   * `regular\_price`: Numeric(10, 2), NOT NULL (Decimal, never float)
   * `selling\_price`: Numeric(10, 2), NOT NULL (Decimal, never float)
   * `created\_at`, `updated\_at`: DateTime(timezone=True)
3. **`orders`**

   * `id`: Integer Primary Key
   * `order\_id`: String(100), unique, indexed (e.g. `ORD-20260915-A1B2C3`)
   * `customer\_id`: Integer ForeignKey(`customers.id`), indexed
   * `payment\_mode`: String(50), nullable
   * `notes`: Text, nullable
   * `total\_amount`: Numeric(10, 2), NOT NULL (Decimal)
   * `order\_status`: String(50), default `'pending'`
   * `payment\_status`: String(50), default `'pending'`
   * `delivery\_status`: String(50), default `'pending'`
   * `delivery\_slot`: String(100), nullable
   * `delivery\_day`: String(50), nullable
   * `created\_at`, `updated\_at`: DateTime(timezone=True)
4. **`order\_items`**

   * `id`: Integer Primary Key
   * `order\_id`: Integer ForeignKey(`orders.id`, ondelete='CASCADE'), indexed
   * `pack\_id`: Integer ForeignKey(`packs.id`), indexed
   * `quantity`: Integer, NOT NULL
   * `unit\_price`: Numeric(10, 2), NOT NULL (Snapshot price charged at order time)

### Historical Price Rule

`order\_items.unit\_price` preserves the exact price charged when the order was placed. If a pack price is later altered in `packs.selling\_price`, historical orders retain their original `unit\_price` and `total\_amount`.

\---

## 6\. Setup \& Installation

### Step 1: Clone and Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` as appropriate:

```ini
# For PostgreSQL / Supabase:
DATABASE\_URL=postgresql+psycopg://postgres:\[YOUR-PASSWORD]@db.\[YOUR-PROJECT-REF].supabase.co:5432/postgres

# For Local SQLite testing (default fallback):
# DATABASE\_URL=sqlite:///./mtora.db

APP\_ENV=development
API\_PREFIX=/api/v1
```

\---

## 7\. Supabase / PostgreSQL Setup

When hosting on Supabase:

1. Obtain the **URI connection string** from your Supabase Dashboard:
`Settings` -> `Database` -> `Connection string` -> `URI`.
2. Ensure the scheme is `postgresql+psycopg://` (the application automatically converts `postgres://` or `postgresql://` to `postgresql+psycopg://`).
3. Run Alembic migrations.

\---

## 8\. Database Migrations

To apply database migrations to head:

```bash
python -m alembic upgrade head
```

To autogenerate a new migration after modifying models:

```bash
python -m alembic revision --autogenerate -m "description of changes"
```

\---

## 9\. Seed Initial Packs

The application provides a repeatable, idempotent script to seed initial packs without creating duplicates:

|Code|Name|Regular Price|Selling Price|
|-|-|-|-|
|pack1|Pack of 1|INR 40.00|INR 40.00|
|pack2|Pack of 2|INR 90.00|INR 80.00|
|pack5|Pack of 5|INR 180.00|INR 160.00|

Run the seed script:

```bash
python scripts/seed\_packs.py
```

\---

## 10\. Running the FastAPI Server

Start the development server with Uvicorn:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Interactive API Documentation

FastAPI automatically generates interactive Swagger UI and ReDoc documentation:

* **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
* **OpenAPI JSON**: [http://127.0.0.1:8000/api/v1/openapi.json](http://127.0.0.1:8000/api/v1/openapi.json)

\---

## 11\. API Overview

### Health

* `GET /health` -> `{"status": "ok"}`

### Customers

* `GET /api/v1/customers` -> List customers (paginated)
* `GET /api/v1/customers/{customer\_id}` -> Retrieve customer by ID
* `POST /api/v1/customers` -> Create customer
* `PUT /api/v1/customers/{customer\_id}` -> Update customer

### Packs

* `GET /api/v1/packs` -> List all packs
* `GET /api/v1/packs/{pack\_id}` -> Retrieve single pack

### Orders

* `GET /api/v1/orders` -> List all orders (with customer \& items)
* `GET /api/v1/orders/{order\_id}` -> Retrieve by database ID or business order ID
* `POST /api/v1/orders` -> Create new multi-item order (calculates total atomically)
* `PUT /api/v1/orders/{order\_id}` -> Update order status / metadata

#### Example Order Creation Request:

```json
POST /api/v1/orders
Content-Type: application/json

{
  "customer\_id": 1,
  "payment\_mode": "UPI",
  "notes": "Deliver in morning",
  "delivery\_slot": "10:00-12:00",
  "delivery\_day": "2026-09-15",
  "items": \[
    {
      "pack\_id": 2,
      "quantity": 2
    },
    {
      "pack\_id": 1,
      "quantity": 1
    }
  ]
}
```

**Total Calculated**: (2 × ₹80) + (1 × ₹40) = ₹200.00

\---

## 12\. Running Tests

Run the full pytest suite:

```bash
python -m pytest -v
```

The test suite runs against an isolated in-memory SQLite database, verifying:

* Health check endpoint
* Customer creation, retrieval, updates, and 404s
* Phone numbers stored as strings
* Pack retrieval and decimal precision
* Order creation with single and multiple items
* Order total calculation
* Historical unit price preservation when pack catalog prices change
* Foreign key and invalid reference validations

