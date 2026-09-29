# MTORA V2 Product Specification

## 1. Product Overview
MTORA V2 transitions the mTORA Protein Roti ordering experience from a static inquiry form into a real, high-converting Direct-to-Consumer (D2C) e-commerce product. The platform serves customers in the Greater Hyderabad metropolitan area with freshly prepared protein rotis delivered in designated morning and evening delivery windows.

The product philosophy emphasizes:
- **Zero Friction**: Browsing and pack selection require no upfront login; authentication is deferred until checkout intent.
- **Transparent, Distance-Based Delivery**: Dynamic calculation from the central preparation hub in Attapur, Hyderabad.
- **Mobile-First Checkout**: Designed for speed and thumbs, utilizing a progressive 4-step sequence with a persistent summary bar.
- **Robust Multi-Channel Communication**: Seamless customer updates via automated WhatsApp notifications and real-time on-site tracking.

---

## 2. Canonical Product Requirements

### 2.1 Customer Identity & Authentication
- **Business Identifier**: 10-digit Indian Mobile Number (`+91`) is the unique customer identifier.
- **Authentication Method**: Passwordless One-Time Password (OTP) sent via SMS/WhatsApp.
- **Authentication Trigger Points**:
  1. *Just-in-Time (Checkout Gate)*: Visitors configure pack size, quantity, and view pricing freely. Clicking "Proceed to Checkout" triggers the authentication gate if no valid session exists.
  2. *Navbar Direct Login*: A prominent user icon / "Login" action in the global navigation bar allows pre-authenticating or accessing account details.
- **Session Persistence**:
  - Once verified, the customer session persists across browser visits via secure, HTTP-only cookies.
  - Customers can re-order, manage addresses, and check out without entering OTP again during an active session.
  - Manual logout immediately terminates the session across client and server.
  - *Status*: `NEEDS DECISION` on exact duration (30, 60, or 90 days; sliding vs absolute).

### 2.2 Customer Onboarding & Profiles
- **Unified Mobile-First Flow**:
  - Customer inputs 10-digit mobile number.
  - Backend verifies OTP and evaluates account existence.
  - **Returning Customer**: Instantly authenticated; system auto-hydrates customer name, WhatsApp number, and saved address book. The user advances directly to address/slot confirmation.
  - **First-Time Customer**: A lightweight profile onboarding step appears requesting:
    - *Full Name* (Mandatory).
    - *WhatsApp Number* (Mandatory; pre-filled with the authenticated mobile number and a checked toggle "Same as Mobile Number").
  - On completing onboarding, the user flows directly into the delivery address step.

### 2.3 Address Capture & Management
- **Customer Address Book**: Customers can save multiple delivery addresses with user-friendly labels (`Home`, `Work`, `Other`).
- **Address Data Elements**:
  - Pinned GPS Coordinates (`latitude`, `longitude`).
  - Locality / Area / Street Name (resolved from GPS/search, editable).
  - Flat / House No. / Floor / Building Name (Mandatory).
  - Landmark / Delivery Notes (Optional).
  - Address Label (`Home`, `Work`, `Other`).
- **Location Detection & Correction**:
  - One-tap "Use current location" requesting device GPS permission.
  - Search Autocomplete: Locality/landmark search input for manual entry or when GPS permission is denied.
  - Map Pinpoint: Users can adjust or fine-tune their pinned location on a map preview.

### 2.4 Delivery Hub, Zones, and Dynamic Fees
- **Central Dispatch Hub**: Attapur, Hyderabad (Coordinates: `17.3688° N, 78.4398° E`).
- **Serviceability & Fee Structure**:
  - **0 – 5 km**: Free (₹0 delivery charge).
  - **5 – 10 km**: +₹15.
  - **10 – 15 km**: +₹25.
  - **15 – 20 km**: +₹50.
  - **20 – 40 km**: ₹50 + ₹5 per additional km above 20 km (rounded to nearest rupee).
- **Service Boundary Policy**:
  - **Within 40 km (Greater Hyderabad)**: Orders are strictly **NEVER REJECTED**. The delivery fee adjusts dynamically according to the distance.
  - **Beyond 40 km / Outside Hyderabad Metro**: Order placement is gated with a polite notice: *"We currently deliver fresh batches only within Greater Hyderabad (up to 40 km from Attapur). For special bulk catering inquiries, please chat with us on WhatsApp."*
- *Status*: `NEEDS DECISION` on the exact distance calculation algorithm (radial Haversine vs road routing distance).

### 2.5 Delivery Scheduling & Slots
- **Delivery Days**:
  - Dropdown selector offering: `Today`, `Tomorrow`, and selectable dates up to `7 days` in advance.
- **Delivery Slots**:
  - `Morning (7:00 AM – 9:00 AM)`
  - `Evening (7:00 PM – 9:00 PM)`
- **Dynamic Cutoff Rules**:
  - Morning Slot cutoff: 10:00 PM on the previous calendar day.
  - Evening Slot cutoff: 4:00 PM on the same calendar day.
  - If a cutoff has passed for the selected day, the slot is disabled and marked as "Closed for today".

### 2.6 Product Catalog & Purchasing Model
- **Purchasing Architecture**: Single-pack Fast Checkout. Customers select a single pack configuration per order, adjusting quantity via stepper.
- **Core Catalog**:
  - **Pack of 1** (1 Protein Roti): ₹45 (MRP: ₹45)
  - **Pack of 2** (2 Protein Rotis): ₹80 (MRP: ₹90, 10% volume discount)
  - **Pack of 5** (5 Protein Rotis): ₹160 (MRP: ₹180, 10% volume discount)
- **Quantity Multiplier**: Stepper (`-`, `+`) with minimum 1 and maximum 20 packs per order.
- **Promotions / Coupons**: Custom coupon codes are deferred to V2.1. Built-in tier savings are displayed automatically.
- *Status*: `NEEDS DECISION` on whether future catalog expansion (e.g. multiple distinct packs or meal add-ons in one transaction) will require migrating from Single-Pack Fast Checkout to a full Multi-Item Cart.

### 2.7 Payment Methods & Lifecycle
- **Supported Payment Modes**:
  1. **Online Payment (UPI / PG)**:
     - ₹0 convenience fee.
     - Supports mobile UPI Intent (direct app launch for GPay, PhonePe, Paytm, CRED), dynamic desktop UPI QR, and Cards/NetBanking fallback.
  2. **Cash on Delivery (COD)**:
     - +₹15 cash handling convenience fee added to bill.
     - Validated by verified customer identity; no second OTP required at checkout.
- **Payment Lifecycle & Failure Resilience**:
  - Online orders initialize in `PENDING_PAYMENT` state with a 15-minute reservation window.
  - Successful gateway webhook/callback transitions order to `CONFIRMED` and payment to `PAID`.
  - Payment failure or gateway dismissal keeps the customer on Step 4 (Review & Payment) with an explicit error alert, allowing immediate retry or switching to Cash on Delivery without loss of entered address or slot data.

### 2.8 Order Fulfillment & Tracking
- **Order Confirmation Experience**:
  - Instant redirect to rich confirmation and live tracking page upon successful placement.
  - Live status indicator: `Placed` ➔ `Kitchen Preparing` ➔ `Out for Delivery` ➔ `Delivered`.
  - Full itemized bill breakdown, delivery slot, and immutable delivery address snapshot.
- **Automated WhatsApp Notification**:
  - Backend dispatches an automated, formatted order confirmation message to the customer's registered WhatsApp number upon order confirmation.
- **Customer Order History**:
  - Logged-in customers have access to a "My Orders" view displaying active and past orders with real-time status and 1-tap re-order capability.
- **Support Escalation**:
  - A persistent, floating WhatsApp button allows customers to open a pre-filled chat with support citing their Order ID for address adjustments or urgent instructions.

---

## 3. Scope Boundaries & Deferrals

| Feature | In V2 Scope | Deferred (V2.1+) |
| :--- | :--- | :--- |
| Mobile OTP Auth | Yes | — |
| Single-pack Fast Checkout | Yes | — |
| Multi-item Cart Drawer | No | Yes (V2.1) |
| Dynamic Attapur GPS Distance Fee | Yes | — |
| Multi-address Book | Yes | — |
| Multi-day Slot Scheduling | Yes | — |
| Online UPI + COD (₹15 fee) | Yes | — |
| Payment Gateway Integration | Contract & Mocks in V2 | Live Gateway Vendor Selection |
| Promo / Coupon Codes | No | Yes (V2.1) |
| Live Order Status Tracking | Yes | — |
| Automated WhatsApp Dispatch | Contract & Mocks in V2 | Production WABA Integration |
| Admin Order Editing via Support | Yes (Backend/DB level) | Dedicated Admin Web Portal |

---

## 4. Unresolved Decisions Checklist
- [ ] **Exact Session Duration**: 30 days vs 60 days vs 90 days sliding window (`NEEDS DECISION`).
- [ ] **Final SMS/OTP Vendor**: MSG91 vs Twilio vs Fast2SMS vs Firebase (`NEEDS DECISION`).
- [ ] **Final Payment Gateway**: Razorpay vs Cashfree vs PhonePe (`NEEDS DECISION`).
- [ ] **Distance Calculation Methodology**: Straight-line Haversine approximation vs Google Distance Matrix driving route (`NEEDS DECISION`).
- [ ] **Product Model Evolution**: Single-pack fast checkout vs future multi-item cart migration timeline (`NEEDS DECISION`).
