# MTORA V2 Backend Specification

## 1. System Architecture & Tech Stack Context
- **Framework**: FastAPI (Python 3.11+).
- **ORM / Database**: SQLAlchemy 2.0 (async), Alembic migrations, PostgreSQL / SQLite (development).
- **Architecture Pattern**: Domain-Driven Layered Architecture (`api/` ➔ `services/` ➔ `models/` ➔ `db/`).
- **Integration Boundary**: The backend is strictly authoritative over identity, session validation, pricing calculations, distance tiers, slot cutoff enforcement, order creation, and payment verification.

---

## 2. Customer Identity & Authentication

### 2.1 Customer Identity Model
- Primary key: `id` (Integer or UUID).
- Unique business identifier: `mobile_no` (Standardized 10-digit Indian MSISDN, e.g. `9030999072`).
- Profile attributes:
  - `name`: String (255), mandatory after onboarding.
  - `whatsapp_no`: String (50), mandatory; defaults to `mobile_no` unless overridden.
  - `is_active`: Boolean (default `True`).
  - `created_at`, `updated_at`: Timestamps with timezone.

### 2.2 OTP Lifecycle & Verification
- **OTP Generation**:
  - 4-to-6 numeric digits generated cryptographically.
  - Expiry window: 10 minutes from generation.
  - Store: Redis / Cache or database table `otp_verifications` with fields `mobile_no`, `otp_hash`, `attempts_count`, `expires_at`, `consumed`.
- **Rate Limiting & Security**:
  - Maximum 3 incorrect attempts allowed per OTP token before code invalidation.
  - Cooldown: 60 seconds minimum between successive OTP dispatch requests to the same mobile number.
  - Throttling: Maximum 5 OTP dispatches per mobile number per hour.

### 2.3 Session Management
- **Persistence Mechanism**: HTTP-only, secure, `SameSite=Lax` session cookie containing an encrypted JWT or cryptographically signed session token.
- **Session Duration**: 30 to 90 days sliding window (`NEEDS DECISION` on exact day count).
- **Revocation**:
  - Explicit logout invalidates the session token in the backend cache/database.
  - Session tokens store `customer_id` and token creation/refresh timestamps.

---

## 3. Customer Address Management
- **Model**: `customer_addresses` (1:N relationship with `Customer`).
- **Fields**:
  - `id`: Primary key.
  - `customer_id`: Foreign key referencing `customers.id`.
  - `label`: Enum / String (`Home`, `Work`, `Other`).
  - `flat_door_no`: String (255), mandatory.
  - `street_locality`: String (500), mandatory.
  - `landmark`: String (255), optional.
  - `latitude`: Numeric (10, 7), mandatory.
  - `longitude`: Numeric (10, 7), mandatory.
  - `is_default`: Boolean (default `False`).
  - `created_at`, `updated_at`: Timestamps.

---

## 4. Delivery Calculation Engine
- **Central Dispatch Origin**: Attapur, Hyderabad (`17.3688° N, 78.4398° E`).
- **Distance Calculation**:
  - System computes distance $D$ in kilometers between origin and customer `(latitude, longitude)`.
  - *Methodology*: `NEEDS DECISION` between Haversine formula (radial distance) and Google Routes/Distance Matrix API (road distance).
- **Authoritative Fee Calculation Rules**:
  - If $D \le 5.0\text{ km}$: Delivery Fee = ₹0 (Free).
  - If $5.0 < D \le 10.0\text{ km}$: Delivery Fee = ₹15.
  - If $10.0 < D \le 15.0\text{ km}$: Delivery Fee = ₹25.
  - If $15.0 < D \le 20.0\text{ km}$: Delivery Fee = ₹50.
  - If $20.0 < D \le 40.0\text{ km}$: Delivery Fee = ₹50 + $\lceil (D - 20) \rceil \times \text{₹5}$.
  - If $D > 40.0\text{ km}$: Delivery boundary exceeded; order submission is blocked with `422 Unprocessable Entity` ("Outside Serviceable Boundary").

---

## 5. Orders & Order Items Model

### 5.1 Order Schema & Immutable Snapshots
Orders must never reference mutable customer addresses directly for fulfillment records. The `orders` table must store a frozen snapshot of customer and delivery data at the moment of checkout:

- **Primary Identifiers**:
  - `id`: Integer primary key.
  - `order_id`: String (e.g. `MT-2609-4821`), unique, indexed, public-facing.
  - `customer_id`: Foreign key referencing `customers.id`.
- **Status Fields**:
  - `order_status`: Enum (`PENDING_PAYMENT`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`).
  - `payment_status`: Enum (`PENDING`, `PAID`, `FAILED`, `REFUNDED`).
  - `payment_mode`: Enum (`UPI`, `COD`).
- **Scheduling**:
  - `delivery_day`: Date / String (e.g. `2026-09-26` or `today`).
  - `delivery_slot`: String (e.g. `7 - 9 PM`).
- **Financial Breakdown (Authoritative Snapshot)**:
  - `pack_subtotal`: Numeric (10, 2).
  - `delivery_fee`: Numeric (10, 2).
  - `cod_fee`: Numeric (10, 2) (₹15 if COD, ₹0 if UPI).
  - `total_amount`: Numeric (10, 2) = `pack_subtotal` + `delivery_fee` + `cod_fee`.
- **Delivery Address Frozen Snapshot**:
  - `recipient_name`: String.
  - `recipient_mobile`: String.
  - `recipient_whatsapp`: String.
  - `address_flat_door`: String.
  - `address_street_locality`: String.
  - `address_landmark`: Optional String.
  - `address_latitude`: Numeric (10, 7).
  - `address_longitude`: Numeric (10, 7).
  - `distance_km`: Numeric (6, 2).
  - `notes`: Optional Text.
- **Timestamps**:
  - `placed_at`: Timestamp.
  - `confirmed_at`: Optional Timestamp.
  - `delivered_at`: Optional Timestamp.

### 5.2 Order Items Model
- `id`: Primary key.
- `order_id`: Foreign key referencing `orders.id`.
- `pack_id`: String (e.g. `pack1`, `pack2`, `pack5`).
- `pack_name`: String (e.g. `Pack of 5`).
- `quantity`: Integer (e.g. `2`).
- `unit_price`: Numeric (10, 2) (e.g. `160.00`).
- `subtotal`: Numeric (10, 2) (e.g. `320.00`).

---

## 6. Provider Abstractions & Mock Layer

To insulate the core business logic from third-party vendor churn, the backend specifies strict abstract interfaces with pluggable mock implementations.

### 6.1 OTP Service Interface (`IOtpService`)
```python
class IOtpService(ABC):
    @abstractmethod
    async def send_otp(self, mobile_no: str, otp_code: str) -> bool:
        pass

class MockOtpService(IOtpService):
    """Active during development. Logs OTP to console and returns True."""
    async def send_otp(self, mobile_no: str, otp_code: str) -> bool:
        logger.info(f"[DEV MOCK OTP] Sent code {otp_code} to {mobile_no}")
        return True
```

### 6.2 Payment Gateway Interface (`IPaymentGateway`)
```python
class IPaymentGateway(ABC):
    @abstractmethod
    async def create_order(self, order_id: str, amount_in_paise: int, customer_mobile: str) -> dict:
        pass

    @abstractmethod
    async def verify_payment(self, payload: dict, signature: str) -> bool:
        pass

class MockPaymentGateway(IPaymentGateway):
    """Active during development. Simulates gateway token generation."""
    async def create_order(self, order_id: str, amount_in_paise: int, customer_mobile: str) -> dict:
        return {
            "gateway_order_id": f"mock_pg_{order_id}",
            "amount": amount_in_paise,
            "currency": "INR",
            "mock": True
        }

    async def verify_payment(self, payload: dict, signature: str) -> bool:
        return signature == "mock_valid_signature"
```

### 6.3 Notification Service Interface (`INotificationService`)
```python
class INotificationService(ABC):
    @abstractmethod
    async def send_order_confirmation(self, order: Order) -> bool:
        pass

class MockNotificationService(INotificationService):
    """Active during development. Logs formatted WhatsApp message."""
    async def send_order_confirmation(self, order: Order) -> bool:
        logger.info(f"[MOCK WHATSAPP NOTIFICATION] Order {order.order_id} confirmed for {order.recipient_whatsapp}")
        return True
```

---

## 7. Background Tasks & Webhooks

### 7.1 Payment Gateway Webhooks
- **Route**: `POST /api/v1/payments/webhook`
- **Security**: Verifies HMAC SHA256 signature header against gateway secret.
- **Handler**:
  1. Parses event (`payment.captured`, `payment.failed`).
  2. Resolves internal `order_id`.
  3. If payment captured: Updates order to `CONFIRMED` and payment to `PAID`, triggers notification dispatcher.
  4. If payment failed: Updates order payment status to `FAILED`, leaves order open for retry until reservation window expires.

### 7.2 Order Reservation Cleanup Job
- A lightweight scheduled background task runs every 5 minutes to mark any `PENDING_PAYMENT` orders older than 15 minutes as `EXPIRED` / `CANCELLED`.

---

## 8. Security & Compliance
- **Data Protection**: Customer phone numbers and addresses are only returned to authenticated sessions matching that customer's ID.
- **Idempotency**: Order submission endpoint accepts an `Idempotency-Key` header to prevent duplicate orders caused by network retries.
- **Input Sanitization**: Strict Pydantic validation across all incoming request schemas.
