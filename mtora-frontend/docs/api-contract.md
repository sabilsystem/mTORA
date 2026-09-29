# MTORA V2 API Contract

## 1. Global Conventions & Standards

- **Base URL Prefix**: `/api/v1`
- **Content-Type**: `application/json` for all request and response bodies.
- **Session Authentication**: Secured via HTTP-only, secure, `SameSite=Lax` cookie named `mtora_session`.
- **Date/Time Standard**: ISO 8601 UTC strings (e.g. `2026-09-26T06:30:00Z`).
- **Currency Standard**: Indian Rupees (INR), represented as two-decimal numeric floats/decimals in API representations (e.g. `160.00`).
- **Data Ownership Principle**: The backend is the **sole authoritative source** for product prices, delivery fees, COD convenience fees, slot availability, and order status. Client-calculated values are purely for immediate UI preview and are re-validated upon submission.

---

## 2. Standard Error Response Envelope

All `4xx` and `5xx` error responses adhere to the following schema:

```json
{
  "success": false,
  "error": {
    "code": "SLOT_CUTOFF_EXPIRED",
    "message": "The selected delivery slot (7-9 AM) is closed for today.",
    "details": null
  }
}
```

Common Error Codes:
- `UNAUTHORIZED`: Session is absent, expired, or invalid.
- `INVALID_OTP`: Provided OTP code is incorrect or expired.
- `OTP_RATE_LIMITED`: Too many OTP requests for this phone number.
- `OUT_OF_SERVICE_BOUNDARY`: Location is beyond the 40 km Greater Hyderabad limit.
- `SLOT_CUTOFF_EXPIRED`: The requested slot cannot be booked due to time cutoff.
- `ORDER_NOT_FOUND`: Order ID does not exist or does not belong to the authenticated customer.

---

## 3. Endpoints

### 3.1 Authentication & Session

#### `POST /auth/otp/send`
Dispatches an OTP to the provided Indian mobile number.

- **Request Body**:
```json
{
  "mobile_no": "9030999072"
}
```

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "mobile_no": "9030999072",
    "cooldown_seconds": 60,
    "expires_in_seconds": 600,
    "mock_otp": "1234"
  }
}
```
*(Note: `mock_otp` is only returned in development environments).*

---

#### `POST /auth/otp/verify`
Verifies the submitted OTP code. Upon success, establishes the HTTP-only session cookie.

- **Request Body**:
```json
{
  "mobile_no": "9030999072",
  "otp_code": "1234"
}
```

- **Response (200 OK)**:
- **Set-Cookie**: `mtora_session=<token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`
```json
{
  "success": true,
  "data": {
    "is_new_customer": false,
    "customer": {
      "id": 104,
      "mobile_no": "9030999072",
      "name": "Abdul Quader",
      "whatsapp_no": "9030999072"
    }
  }
}
```

---

#### `GET /auth/me`
Retrieves the profile of the currently authenticated customer based on the active session cookie.

- **Request**: No body; session cookie required.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": 104,
      "mobile_no": "9030999072",
      "name": "Abdul Quader",
      "whatsapp_no": "9030999072"
    }
  }
}
```
- **Response (401 Unauthorized)**: When session is absent or expired.

---

#### `POST /auth/logout`
Invalidates the customer session and clears the session cookie.

- **Response (200 OK)**:
- **Set-Cookie**: `mtora_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### 3.2 Customer Onboarding & Addresses

#### `PATCH /customers/profile`
Used by first-time customers immediately post-OTP verification to provide their profile information.

- **Request Body**:
```json
{
  "name": "Fatima Begum",
  "whatsapp_no": "9030999072"
}
```

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "customer": {
      "id": 105,
      "mobile_no": "9030999072",
      "name": "Fatima Begum",
      "whatsapp_no": "9030999072"
    }
  }
}
```

---

#### `GET /customers/addresses`
Returns all saved addresses for the authenticated customer.

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "label": "Home",
      "flat_door_no": "Flat 302, Green Valley Apts",
      "street_locality": "Attapur Ring Road, Hyderabad",
      "landmark": "Near Pillar 142",
      "latitude": 17.3712,
      "longitude": 78.4410,
      "is_default": true
    }
  ]
}
```

---

#### `POST /customers/addresses`
Saves a new delivery address into the customer's address book.

- **Request Body**:
```json
{
  "label": "Work",
  "flat_door_no": "Suite 4B, Cyber Towers",
  "street_locality": "Hitec City, Hyderabad",
  "landmark": "Opposite Inorbit Mall",
  "latitude": 17.4504,
  "longitude": 78.3808,
  "is_default": false
}
```

- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 13,
    "label": "Work",
    "flat_door_no": "Suite 4B, Cyber Towers",
    "street_locality": "Hitec City, Hyderabad",
    "landmark": "Opposite Inorbit Mall",
    "latitude": 17.4504,
    "longitude": 78.3808,
    "is_default": false
  }
}
```

---

### 3.3 Delivery & Pricing Engine

#### `POST /delivery/calculate`
Authoritative endpoint to compute distance from Attapur hub and resolve the applicable delivery fee. Used during checkout step 2.

- **Request Body**:
```json
{
  "latitude": 17.4504,
  "longitude": 78.3808
}
```

- **Response (200 OK - Serviceable)**:
```json
{
  "success": true,
  "data": {
    "origin": {
      "hub": "Attapur, Hyderabad",
      "latitude": 17.3688,
      "longitude": 78.4398
    },
    "destination": {
      "latitude": 17.4504,
      "longitude": 78.3808
    },
    "distance_km": 11.4,
    "delivery_fee": 25.00,
    "is_serviceable": true,
    "message": "Within Greater Hyderabad Delivery Zone"
  }
}
```

- **Response (200 OK - Beyond Boundary)**:
```json
{
  "success": true,
  "data": {
    "distance_km": 52.1,
    "delivery_fee": null,
    "is_serviceable": false,
    "message": "We currently deliver fresh batches only within Greater Hyderabad (up to 40 km from Attapur). Contact WhatsApp for custom catering."
  }
}
```

---

#### `GET /delivery/slots`
Returns the available delivery days and time slots, dynamically evaluating current server time cutoffs.

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-09-26",
      "label": "Today",
      "slots": [
        {
          "slot_id": "today_morning",
          "label": "Morning (7:00 AM – 9:00 AM)",
          "is_available": false,
          "reason": "Cutoff passed (10:00 PM previous day)"
        },
        {
          "slot_id": "today_evening",
          "label": "Evening (7:00 PM – 9:00 PM)",
          "is_available": true,
          "reason": null
        }
      ]
    },
    {
      "date": "2026-09-27",
      "label": "Tomorrow",
      "slots": [
        {
          "slot_id": "tomorrow_morning",
          "label": "Morning (7:00 AM – 9:00 AM)",
          "is_available": true,
          "reason": null
        },
        {
          "slot_id": "tomorrow_evening",
          "label": "Evening (7:00 PM – 9:00 PM)",
          "is_available": true,
          "reason": null
        }
      ]
    }
  ]
}
```

---

### 3.4 Catalog

#### `GET /packs`
Returns available pack options and baseline pricing.

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "pack1",
      "name": "Pack of 1",
      "rotis_count": 1,
      "price": 45.00,
      "regular_price": 45.00,
      "discount_percent": 0
    },
    {
      "id": "pack2",
      "name": "Pack of 2",
      "rotis_count": 2,
      "price": 80.00,
      "regular_price": 90.00,
      "discount_percent": 10
    },
    {
      "id": "pack5",
      "name": "Pack of 5",
      "rotis_count": 5,
      "price": 160.00,
      "regular_price": 180.00,
      "discount_percent": 10
    }
  ]
}
```

---

### 3.5 Orders & Fulfillment

#### `POST /orders`
Creates a new order. Authoritative calculations occur on the backend.

- **Headers**:
  - `Idempotency-Key`: UUID (optional but recommended)
- **Request Body**:
```json
{
  "pack_id": "pack5",
  "quantity": 2,
  "address_id": 12,
  "delivery_day": "2026-09-26",
  "delivery_slot": "7 - 9 PM",
  "payment_mode": "UPI",
  "notes": "Please leave at security gate"
}
```

- **Response (201 Created - UPI Mode)**:
```json
{
  "success": true,
  "data": {
    "order_id": "MT-2609-8492",
    "order_status": "PENDING_PAYMENT",
    "payment_status": "PENDING",
    "payment_mode": "UPI",
    "bill_summary": {
      "pack_subtotal": 320.00,
      "delivery_fee": 25.00,
      "cod_fee": 0.00,
      "total_amount": 345.00
    },
    "payment_gateway": {
      "gateway_order_id": "mock_pg_MT-2609-8492",
      "amount": 34500,
      "currency": "INR",
      "mock": true
    }
  }
}
```

- **Response (201 Created - COD Mode)**:
```json
{
  "success": true,
  "data": {
    "order_id": "MT-2609-8493",
    "order_status": "CONFIRMED",
    "payment_status": "PENDING",
    "payment_mode": "COD",
    "bill_summary": {
      "pack_subtotal": 320.00,
      "delivery_fee": 25.00,
      "cod_fee": 15.00,
      "total_amount": 360.00
    },
    "payment_gateway": null
  }
}
```

---

#### `GET /orders/{orderId}`
Retrieves public order status for live tracking and confirmation display.

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "order_id": "MT-2609-8492",
    "order_status": "CONFIRMED",
    "payment_status": "PAID",
    "payment_mode": "UPI",
    "placed_at": "2026-09-26T06:45:00Z",
    "delivery": {
      "day": "2026-09-26",
      "slot": "7 - 9 PM",
      "recipient_name": "Abdul Quader",
      "recipient_mobile": "9030999072",
      "recipient_whatsapp": "9030999072",
      "address_flat_door": "Flat 302, Green Valley Apts",
      "address_street_locality": "Attapur Ring Road, Hyderabad",
      "address_landmark": "Near Pillar 142",
      "distance_km": 11.4
    },
    "items": [
      {
        "pack_id": "pack5",
        "pack_name": "Pack of 5",
        "quantity": 2,
        "unit_price": 160.00,
        "subtotal": 320.00
      }
    ],
    "bill_summary": {
      "pack_subtotal": 320.00,
      "delivery_fee": 25.00,
      "cod_fee": 0.00,
      "total_amount": 345.00
    }
  }
}
```

---

#### `GET /orders`
Lists all past and active orders for the currently authenticated customer.

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "order_id": "MT-2609-8492",
      "order_status": "CONFIRMED",
      "payment_status": "PAID",
      "placed_at": "2026-09-26T06:45:00Z",
      "total_amount": 345.00,
      "item_summary": "Pack of 5 × 2"
    }
  ]
}
```

---

### 3.6 Payments Verification

#### `POST /payments/verify`
Client callback after completing gateway payment to verify signature and finalize order state.

- **Request Body**:
```json
{
  "order_id": "MT-2609-8492",
  "gateway_payment_id": "pay_mock_123456",
  "gateway_order_id": "mock_pg_MT-2609-8492",
  "gateway_signature": "mock_valid_signature"
}
```

- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "order_id": "MT-2609-8492",
    "order_status": "CONFIRMED",
    "payment_status": "PAID"
  }
}
```
