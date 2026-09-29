# MTORA V2 Architectural & Product Decisions

This document formally records confirmed architectural decisions, design rationales, downstream implications, and explicitly flags all unresolved decisions requiring future alignment.

---

## 1. Confirmed Architectural Decisions

### ADR-01: Just-in-Time Authentication Gate
- **Decision**: Guests can configure pack types, quantities, and explore delivery pricing without logging in. Mobile OTP authentication is triggered when clicking "Proceed to Checkout" (or directly via the navbar).
- **Rationale**: Upfront login friction degrades conversion for discovery-driven D2C food products. Deferring authentication to the point of intent preserves exploratory browsing while capturing verified credentials before address entry.
- **Implications**: The frontend must preserve guest cart/selection state across the authentication modal and hydrate saved profile data immediately upon verification without refreshing or resetting the view.

### ADR-02: Unified Mobile-First Onboarding & Returning Customer Split
- **Decision**: A single input field captures the 10-digit mobile number for both new and existing users. Following OTP verification, the backend returns an `is_new_customer` flag:
  - *Returning Customers* bypass onboarding and immediately view saved addresses.
  - *First-Time Customers* see a lightweight profile step (Name, WhatsApp number with default "Same as Mobile" checked).
- **Rationale**: Eliminates confusing separate "Login" vs "Sign Up" tabs common in legacy web applications. Aligns with standard Indian quick-commerce and D2C UX (e.g. Swiggy, Blinkit, Zepto).
- **Implications**: Customer records are uniquely keyed by mobile number on the business layer. Frontend state must handle the conditional onboarding step cleanly.

### ADR-03: Frictionless Persistent Session
- **Decision**: Customer sessions persist across visits on the same browser using secure, HTTP-only cookies, eliminating the need to re-enter OTPs on repeat orders.
- **Rationale**: Protein roti is a high-frequency replenishment consumable. Requiring OTPs on every order adds unnecessary friction for loyal repeat buyers.
- **Implications**: The session token must be protected against XSS via HTTP-only flags. Sensitive operations (like changing the registered phone number) would require re-auth in future phases.

### ADR-04: Attapur Hub Distance-Based Delivery Fee Formula
- **Decision**: Delivery charges are calculated dynamically based on distance from the central preparation hub in Attapur, Hyderabad (`17.3688° N, 78.4398° E`). Pricing tiers:
  - 0 – 5 km: Free (₹0)
  - 5 – 10 km: +₹15
  - 10 – 15 km: +₹25
  - 15 – 20 km: +₹50
  - 20 – 40 km: ₹50 + ₹5 per additional km above 20 km.
- **Rationale**: In V1, customers self-selected zone dropdowns (e.g. "0-5 km Free"), leading to revenue leakage when distant customers chose free tiers. Automated distance calculation enforces accurate fee collection.
- **Implications**: Orders within the 40 km Greater Hyderabad boundary are never rejected. The fee scales continuously.

### ADR-05: Multi-Address Book with Geocoded Pinpointing
- **Decision**: Customers can maintain multiple labeled addresses (`Home`, `Work`, `Other`) with door numbers, landmarks, and GPS coordinates.
- **Rationale**: Working professionals frequently order to both residential and office locations.
- **Implications**: The backend requires a dedicated `customer_addresses` table with foreign key to `customers`.

### ADR-06: Dynamic Slot Cutoff Enforcement
- **Decision**: Order scheduling supports `Today`, `Tomorrow`, and up to 7 days ahead with Morning (7–9 AM) and Evening (7–9 PM) slots. Slots automatically lock after their cutoff times (Morning closes 10 PM prior night; Evening closes 4 PM same day).
- **Rationale**: Guarantees kitchen prep time and prevents unfulfillable fresh food delivery promises.
- **Implications**: The backend slot query is authoritative. Frontend dynamically disables past cutoffs in real time based on server time.

### ADR-07: Single-Pack Fast Checkout
- **Decision**: Customers select a single pack configuration (`pack1`, `pack2`, `pack5`) with a quantity multiplier per order, bypassing a multi-item cart drawer.
- **Rationale**: mTORA is currently a focused single-product line (Protein Roti). Single-pack checkout minimizes clicks and optimizes mobile conversion.
- **Implications**: Streamlines UI and state management. Order models accommodate multiple items internally for future-proofing, but frontend exposes single-pack selection.

### ADR-08: Dual Payment Model (UPI + COD with ₹15 Fee)
- **Decision**: Offer Online Payment (UPI Intent / QR / PG) at ₹0 fee and Cash on Delivery (COD) with a ₹15 convenience fee.
- **Rationale**: COD carries higher operational risk and RTO rates in fresh food delivery. The ₹15 fee offsets cash handling while incentivizing instant UPI prepayments.
- **Implications**: Authenticated phone verification via OTP provides sufficient trust to place COD orders directly in `CONFIRMED` state.

### ADR-09: In-Place Payment Failure Recovery
- **Decision**: If an online payment attempt fails or is dismissed, the user stays on Step 4 (Payment Review) with an error alert, retaining address, pack, and slot selections.
- **Rationale**: Resetting the cart or navigating away causes drop-offs and frustration. In-place retry allows immediate re-attempt or switching to COD.
- **Implications**: Order remains in `PENDING_PAYMENT` state with a 15-minute reservation timer before auto-expiration.

### ADR-10: Immutable Order Address & Price Snapshot
- **Decision**: Orders store a frozen snapshot of recipient details, full address text, coordinates, distance, and item pricing at checkout.
- **Rationale**: If a customer modifies their saved "Home" address next month, historical order receipts and fulfillment records must remain immutable.
- **Implications**: Order schema includes flattened address snapshot fields rather than purely relying on foreign key joins to mutable address records.

### ADR-11: Provider Abstraction & Mock Adapters for Development
- **Decision**: Isolate third-party SMS (OTP) and Payment Gateway dependencies behind abstract domain interfaces (`IOtpService`, `IPaymentGateway`), backed by fully functional mock adapters in development.
- **Rationale**: Frontend and core business logic development can proceed immediately without waiting for production vendor keys, compliance verification, or SMS gateway top-ups.
- **Implications**: Seamless one-line configuration toggle when production vendor keys are ready.

---

## 2. Unresolved Decisions (NEEDS DECISION)

### UND-01: Exact Session Cookie Lifespan
- **Current State**: Proposed range is 30 to 90 days with sliding window refresh.
- **Options**:
  1. *30 Days Sliding Window*: Refreshes on every active order or authenticated API call. Balances security with low friction.
  2. *60 Days Sliding Window*: Extended retention for monthly repeat buyers.
  3. *90 Days / Long-Lived*: Maximizes convenience; matches leading food apps.
- **Trade-Offs**: Shorter sessions reduce risk on shared family devices; longer sessions minimize OTP costs and friction for repeat buyers.
- **Tag**: `NEEDS DECISION`

---

### UND-02: Final SMS / OTP Gateway Selection
- **Current State**: Decoupled behind `IOtpService`; mock provider active (`1234`).
- **Candidates**:
  1. *MSG91 / Fast2SMS*: Cost-effective for domestic Indian SMS, DLT template registration required.
  2. *Twilio / Gupshup*: Robust enterprise delivery, supports WhatsApp OTP fallback, higher cost per message.
  3. *Firebase Phone Auth*: Free tier available, client-side SDK integration overhead.
- **Trade-Offs**: Direct SMS cost vs delivery speed vs DLT regulatory compliance overhead.
- **Tag**: `NEEDS DECISION`

---

### UND-03: Final Payment Gateway Vendor
- **Current State**: Decoupled behind `IPaymentGateway`; mock provider active.
- **Candidates**:
  1. *Razorpay*: Industry standard in India, premier UPI Intent and checkout modal experience, standard 2% MDR.
  2. *Cashfree*: Strong UPI Intent and webhook reliability, competitive pricing.
  3. *PhonePe Payment Gateway*: Zero/low MDR on UPI transactions, strong mobile brand recognition.
- **Trade-Offs**: Transaction fees (MDR), onboarding turnaround time, and UPI Intent deep-linking UX on mobile browsers.
- **Tag**: `NEEDS DECISION`

---

### UND-04: Distance Calculation Methodology (Radial vs Road Routing)
- **Current State**: Tiered fee formula is locked; backend distance computation algorithm requires selection.
- **Options**:
  1. *Haversine Formula (Radial/Straight-Line)*: Computed purely in code via mathematical coordinates. **Zero API cost, zero network latency**.
  2. *Google Routes / Distance Matrix API*: Computes exact driving road distance. Provides true transit distance, but incurs API calls and billing elements.
- **Trade-Offs**: Haversine is free and instant, but road distance in Hyderabad can be 20–30% longer than radial distance due to flyovers and lake bypasses.
- **Tag**: `NEEDS DECISION`

---

### UND-05: Product Catalog Model Evolution (Single-Pack vs Multi-Pack Cart)
- **Current State**: V2 confirmed as Single-Pack Fast Checkout.
- **Options**:
  1. *Maintain Single-Pack Architecture*: Fastest possible flow for a single SKU business.
  2. *Prepare Migration Path for V2.1 Multi-Item Cart*: If mTORA introduces roti variants (e.g. Sattu, Multigrain) or fresh meal accompaniments (curries/chutneys), a cart drawer will be required.
- **Trade-Offs**: Single-pack optimizes current conversion; multi-item cart increases average order value (AOV) once catalog expands.
- **Tag**: `NEEDS DECISION`

---

### UND-06: Delivery & Payment Edge-Case Policies
- **Current State**: Core flows defined; specific edge handling requires operational sign-off:
  - *Kitchen Cancellation & Refund*: If an accepted prepaid UPI order must be cancelled by the kitchen (e.g. batch stockout), what is the SLA and automated refund initiation flow?
  - *Customer Cancellation Window*: Can a customer cancel an order once placed (e.g. within 5 minutes of placing), or is cancellation strictly manual via WhatsApp support?
  - *COD Non-Acceptance (RTO)*: What policy applies if a COD customer is unreachable upon delivery? (e.g. flag mobile number to require prepayments for future orders).
- **Tag**: `NEEDS DECISION`
