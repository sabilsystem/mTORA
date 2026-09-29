# MTORA V2 Frontend Specification

## 1. Application Architecture & Tech Stack
- **Framework**: Next.js 15+ (App Router).
- **Language**: TypeScript (strict mode enabled).
- **Styling**: Vanilla CSS (CSS Modules & custom design tokens) conforming to project guidelines; rich visual aesthetics, glassmorphism accents, high-contrast states, and micro-interactions.
- **State Management**: React Context / Hooks for authentication session, checkout stage state, and customer address management.
- **Client Services / Mock Adapters**: Standardized service contracts for Auth (`AuthService`), Distance Calculation (`DistanceService`), and Payments (`PaymentService`), with production-grade mock adapters active during development.

---

## 2. Routes & Navigation Structure

| Route | Access Level | Description |
| :--- | :--- | :--- |
| `/` | Public | Marketing landing page with hero, nutritional benefits, pack showcase, and direct "Order Now" CTAs. |
| `/order` | Public / Hybrid | Primary ordering and checkout route. Step 1 accessible to guests; Step 2 gates unauthenticated users with Mobile OTP. |
| `/order/[orderId]` | Public (Token/Cookie) | Order confirmation and live tracking view with status stepper and WhatsApp inquiry action. |
| `/orders` | Authenticated | Customer's order history dashboard ("My Orders") with past order receipts and 1-tap re-ordering. |
| `/profile` | Authenticated | Customer profile and address book management (add, edit, delete saved delivery addresses). |

---

## 3. User Journeys

### 3.1 First-Time Customer Order Journey
1. **Landing / Pack Discovery**: Customer views `/` or `/order`, selects desired pack (e.g. Pack of 5) and adjusts quantity stepper to `2`.
2. **Checkout Initiation**: Clicks "Proceed to Checkout" (or sticky footer CTA).
3. **Authentication Gate**: Modal/drawer appears prompting for 10-digit mobile number.
4. **OTP Verification**: Customer receives and enters OTP code.
5. **Profile Onboarding**: System detects new user; prompts for Name and WhatsApp number (with "Same as Mobile" pre-checked).
6. **Address & GPS Pinpoint**:
   - Customer taps "Use Current Location" (browser prompts GPS).
   - Coordinates reverse-geocode into locality name.
   - Customer inputs Flat/Door No., Landmark, and chooses label "Home".
   - System calculates distance from Attapur hub and updates delivery fee in real-time.
7. **Slot Scheduling**: Customer selects delivery day (`Today` or `Tomorrow`) and chooses an active time window (`Morning 7–9 AM` or `Evening 7–9 PM`).
8. **Payment & Review**: Customer reviews itemized breakdown, selects UPI (₹0 fee) or COD (+₹15 fee), and taps "Pay / Confirm Order".
9. **Confirmation & Live Tracking**: User is redirected to `/order/[orderId]` with live status and receives an automated WhatsApp confirmation message.

### 3.2 Returning Customer Quick-Order Journey
1. **Selection**: Customer arrives at `/order` (session cookie active), selects pack and quantity.
2. **Instant Hydration**: System automatically loads saved default address ("Home"), computes delivery fee, and pre-selects the earliest available slot.
3. **Frictionless Review**: Customer reviews order in 1 tap, confirms payment mode, and places order immediately without re-entering OTP or address.

---

## 4. Authentication UX

### 4.1 Trigger Modes
- **Modal / Slide-Over Sheet**: Opens seamlessly when guest clicks "Proceed to Checkout" on `/order`, avoiding a hard page redirect and preserving selected pack & quantity in memory/sessionStorage.
- **Navbar Login Action**: User icon in the navigation bar opens the same authentication modal. Once authenticated on public pages, avatar reflects customer initial with a dropdown menu: *My Orders*, *Saved Addresses*, *Logout*.

### 4.2 OTP Interaction State Machine
1. **Mobile Entry State**:
   - Input: Clean numeric input, enforces 10 digits, formatted with `+91` prefix indicator.
   - Validation: Regex check for valid Indian mobile prefixes (`^[6-9]\d{9}$`).
   - CTA: "Send Verification Code".
2. **Verification State**:
   - 4-to-6 segmented input fields with auto-focus advance and backspace regression.
   - Resend Timer: 60-second visual countdown before "Resend OTP" button becomes active.
   - Attempt Feedback: Clear inline error messaging on invalid OTP with remaining attempts indicator (e.g. *"Incorrect code. 2 attempts remaining"*).
3. **Dev / Mock Mode Indicator**:
   - In development environments, a non-intrusive banner or toast displays the simulated OTP (e.g. `1234`) for rapid testing.

---

## 5. Checkout Flow & Step Transitions

The checkout experience on `/order` is organized as a **Progressive 4-Step Flow** paired with a **Persistent Sticky Bottom Bar** on mobile devices.

```
┌────────────────────────────────────────────────────────┐
│ Step 1: Pack & Quantity Selection                      │
├────────────────────────────────────────────────────────┤
│ Step 2: Delivery Address & Location Pinpoint           │
│         (Auth Gate triggered if unauthenticated)       │
├────────────────────────────────────────────────────────┤
│ Step 3: Delivery Day & Time Slot Scheduling            │
├────────────────────────────────────────────────────────┤
│ Step 4: Bill Summary & Payment Selection               │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│ Sticky Bottom Bar: [Pack Summary | Total ₹] [Next CTA] │
└────────────────────────────────────────────────────────┘
```

### Step 1: Pack & Quantity Selection
- **Catalog Cards**: High-contrast, interactive cards for `Pack of 1` (₹45), `Pack of 2` (₹80), and `Pack of 5` (₹160).
- **Badge Indicators**: Highlight "10% OFF" and protein per roti metrics.
- **Quantity Stepper**: Stepper controls (`-`, count, `+`) with instantaneous subtotal calculation.
- **Action**: "Proceed to Address" advances to Step 2 (triggering OTP modal if session is absent).

### Step 2: Delivery Address & Location
- **Address Selection (Returning Users)**: Carousel or card list of saved labeled addresses (`Home`, `Work`, `Other`) with a "+ Add New Address" button.
- **New Address Capture Form**:
  - *GPS Action Button*: "Detect My Location" with loading spinner and error fallback.
  - *Locality Search Autocomplete*: Integrated with Google Places API.
  - *Map Pinpoint Preview*: Draggable pin showing radius from Attapur.
  - *Manual Door Details*: Flat/House/Floor number (required), Landmark (optional).
  - *Label Toggles*: Selectable chips (`Home`, `Work`, `Other`).
- **Live Fee Engine**: Updates distance in km and delivery fee badge immediately upon coordinate selection.
- **Operational Boundary Check**: If coordinates are > 40 km, Step 2 displays a polite non-blocking warning and restricts the "Next" action to contacting WhatsApp.

### Step 3: Delivery Scheduling
- **Day Selector Dropdown**: Options populated dynamically:
  - `Today`
  - `Tomorrow`
  - Future dates (up to 7 days formatted as `Day, Date Month`)
- **Slot Selector Dropdown**:
  - `Morning (7:00 AM – 9:00 AM)`
  - `Evening (7:00 PM – 9:00 PM)`
- **Cutoff Engine**:
  - Evaluates current browser time against schedule cutoffs (Morning cutoff 10 PM previous day; Evening cutoff 4 PM same day).
  - Automatically disables past slots with label `(Cutoff passed)`.

### Step 4: Bill Summary & Payment
- **Itemized Bill Card**:
  - Pack Subtotal (Pack Price × Quantity)
  - Delivery Fee (Free / ₹15 / ₹25 / ₹50 / ₹50+ based on calculated km)
  - Payment Convenience Fee (₹0 for UPI, ₹15 for COD)
  - **Total Payable Amount** (bold, highlighted currency token)
- **Payment Method Toggle**:
  - `Online Payment (UPI / PG)`: Tagged "Recommended • ₹0 Extra Fee".
  - `Cash on Delivery (COD)`: Tagged "+₹15 Handling Fee".
- **Primary CTA**: "Pay ₹XXX via UPI" or "Confirm Order (COD)".

---

## 6. Payment UX & Error Recovery
- **Online Payment Flow (UPI / PG)**:
  - Tapping "Pay via UPI" creates order in `PENDING_PAYMENT` state and launches Payment Gateway modal (or UPI deep-link intent on mobile).
  - **Mock Development Mode**: Modal appears with two distinct controls: *"Simulate Successful Payment"* and *"Simulate Failed Payment"*.
- **Payment Failure Handling**:
  - If payment is dismissed or fails, user remains on Step 4.
  - An alert banner renders: *"Payment could not be completed. Please retry or choose Cash on Delivery."*
  - No inputs are reset; customer can tap "Retry UPI" or select "COD" and proceed without re-entering data.

---

## 7. Order Confirmation & Live Tracking (`/order/[orderId]`)
- **Visual Status Stepper**:
  - `Placed` (Green checkmark, time stamped).
  - `Kitchen Preparing` (Fresh dough and grilling in progress).
  - `Out for Delivery` (Rider assigned and en route).
  - `Delivered` (Order complete).
- **Frozen Order Details Card**: Full snapshot of selected pack, quantity, scheduled slot, recipient phone, and exact delivery address.
- **Support & Changes Action**:
  - Floating and inline WhatsApp CTA: *"Need to make changes or have questions? Chat with our Attapur dispatch team."* Launches WhatsApp with pre-filled message: `Hi mTORA, regarding my Order MT-XXXXX...`.

---

## 8. Responsive Design & Accessibility
- **Breakpoints**:
  - Mobile: `< 640px` (Progressive vertical stepper, full-width inputs, 48px touch targets, sticky bottom action bar).
  - Tablet: `640px – 1024px` (Centered single-column layout with fixed bottom drawer).
  - Desktop: `> 1024px` (Two-column layout: left column displays sequential checkout steps, right column hosts sticky live order summary).
- **Accessibility (a11y)**:
  - All form controls utilize explicit `<label>` tags with matching `htmlFor` attributes.
  - ARIA attributes for stepper states (`aria-current="step"`, `aria-live="polite"` on summary total).
  - Full keyboard navigability across pack selection, address cards, and modal dismissals.
  - High-contrast visual cues complying with WCAG AA standard.

---

## 9. Frontend Acceptance Criteria
1. Unauthenticated users can choose pack and quantity without seeing any login prompt.
2. Clicking "Proceed to Checkout" prompts the Mobile OTP modal without reloading the page or losing selected pack data.
3. Returning users with active session cookies bypass the OTP step and see their pre-saved address book.
4. Address selection automatically queries distance calculation and accurately updates the delivery fee before moving to slot selection.
5. Delivery slots past their cutoff time cannot be selected.
6. A failed UPI payment attempt leaves the customer on the review screen with an inline error and does not wipe out address or slot inputs.
7. Confirming an order redirects to the `/order/[orderId]` tracking screen displaying the immutable address and live status.
