"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import QuantityStepper from "./QuantityStepper";
import OrderSummary from "./OrderSummary";
import OrderConfirmation, { ConfirmedOrderDetails } from "./OrderConfirmation";
import {
  PACK_OPTIONS,
  DELIVERY_ZONES,
  ZONE_LOCATIONS,
  DELIVERY_SLOTS,
  calculateLegacySummary,
} from "./orderData";

interface FormErrors {
  name?: boolean;
  mobile?: boolean;
  whatsapp?: boolean;
  address?: boolean;
  pack?: boolean;
  zone?: boolean;
  location?: boolean;
  day?: boolean;
  slot?: boolean;
}

export default function OrderForm() {
  const [custName, setCustName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [address, setAddress] = useState("");
  const [packType, setPackType] = useState("");
  const [packQty, setPackQty] = useState(1);
  const [deliveryZone, setDeliveryZone] = useState("");
  const [locationArea, setLocationArea] = useState("");
  const [deliveryDay, setDeliveryDay] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrderDetails | null>(null);

  // Live calculation (isolated temporary frontend calculation)
  const summary = calculateLegacySummary(packType, packQty, deliveryZone, paymentMode);

  // Mobile number input handler (10-digit clean)
  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(cleaned);
    if (sameAsMobile) {
      setWhatsappNumber(cleaned);
    }
    if (errors.mobile) {
      setErrors((prev) => ({ ...prev, mobile: false }));
    }
  };

  // WhatsApp number input handler
  const handleWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (sameAsMobile) return;
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setWhatsappNumber(cleaned);
    if (errors.whatsapp) {
      setErrors((prev) => ({ ...prev, whatsapp: false }));
    }
  };

  // Same as mobile checkbox handler
  const handleSameAsMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsMobile(checked);
    if (checked) {
      setWhatsappNumber(mobileNumber);
      if (errors.whatsapp) {
        setErrors((prev) => ({ ...prev, whatsapp: false }));
      }
    }
  };

  // Delivery zone change
  const handleZoneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const zone = e.target.value;
    setDeliveryZone(zone);
    setLocationArea("");
    if (errors.zone) setErrors((prev) => ({ ...prev, zone: false }));
    if (errors.location) setErrors((prev) => ({ ...prev, location: false }));
  };

  // Delivery day change
  const handleDayChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const day = e.target.value;
    setDeliveryDay(day);
    setDeliverySlot("");
    if (errors.day) setErrors((prev) => ({ ...prev, day: false }));
    if (errors.slot) setErrors((prev) => ({ ...prev, slot: false }));
  };

  const validate = (): boolean => {
    const mobileRe = /^[6-9]\d{9}$/;
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!custName.trim()) {
      newErrors.name = true;
      isValid = false;
    }

    if (!mobileRe.test(mobileNumber.trim())) {
      newErrors.mobile = true;
      isValid = false;
    }

    if (!mobileRe.test(whatsappNumber.trim())) {
      newErrors.whatsapp = true;
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = true;
      isValid = false;
    }

    if (!packType) {
      newErrors.pack = true;
      isValid = false;
    }

    if (!deliveryZone) {
      newErrors.zone = true;
      isValid = false;
    }

    if (!locationArea) {
      newErrors.location = true;
      isValid = false;
    }

    if (!deliveryDay) {
      newErrors.day = true;
      isValid = false;
    }

    if (!deliverySlot) {
      newErrors.slot = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      const firstError = document.querySelector(".field.has-error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Generate frontend order identifier for preview
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const generatedOrderId = `ORD-${dateStr}-${randomSuffix}`;

    const selectedPack = PACK_OPTIONS[packType];
    const selectedZone = DELIVERY_ZONES.find((z) => z.value === deliveryZone);

    const orderData: ConfirmedOrderDetails = {
      orderId: generatedOrderId,
      name: custName.trim(),
      mobile: mobileNumber.trim(),
      packType: selectedPack ? selectedPack.name : packType,
      packQty,
      locationArea,
      deliveryZone: selectedZone ? selectedZone.label : deliveryZone,
      deliveryDay: deliveryDay === "today" ? "Today" : "Tomorrow",
      deliverySlot,
      deliveryFee: summary.deliveryFee ?? 0,
      codFee: summary.codFee,
      paymentMode,
      total: summary.total,
    };

    setConfirmedOrder(orderData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setCustName("");
    setMobileNumber("");
    setWhatsappNumber("");
    setSameAsMobile(false);
    setAddress("");
    setPackType("");
    setPackQty(1);
    setDeliveryZone("");
    setLocationArea("");
    setDeliveryDay("");
    setDeliverySlot("");
    setPaymentMode("UPI");
    setNotes("");
    setErrors({});
    setConfirmedOrder(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If order is placed, show confirmation panel
  if (confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} onNewOrder={handleReset} />;
  }

  const availableLocations = deliveryZone ? ZONE_LOCATIONS[deliveryZone] || [] : [];
  const availableSlots = deliveryDay ? DELIVERY_SLOTS[deliveryDay] || [] : [];

  return (
    <>
      <div className="order-form-bar">
        <div className="file-tag">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <rect
              x="4"
              y="3"
              width="16"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M8 8h8M8 12h8M8 16h5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span>mTORA Order Form</span>
        </div>
        <span className="eyebrow" style={{ margin: 0 }}>
          Secure &amp; direct to our team
        </span>
      </div>

      <form className="order-form" id="orderForm" noValidate onSubmit={handleSubmit}>
        <p className="form-section-label">Your details</p>

        <div className="form-row">
          <div className={`field${errors.name ? " has-error" : ""}`} id="field-name">
            <label htmlFor="custName">Full Name</label>
            <input
              type="text"
              id="custName"
              name="custName"
              placeholder="e.g. Name"
              autoComplete="name"
              value={custName}
              onChange={(e) => {
                setCustName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
              }}
              required
            />
            <small className="err">Please enter your name.</small>
          </div>

          <div className={`field${errors.mobile ? " has-error" : ""}`} id="field-mobile">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="10-digit mobile number"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              value={mobileNumber}
              onChange={handleMobileChange}
              required
            />
            <small className="err">Enter a valid 10-digit mobile number.</small>
          </div>
        </div>

        <div className={`field${errors.whatsapp ? " has-error" : ""}`} id="field-whatsapp">
          <label htmlFor="whatsappNumber">WhatsApp Number</label>
          <input
            type="tel"
            id="whatsappNumber"
            name="whatsappNumber"
            placeholder="10-digit WhatsApp number"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
            value={whatsappNumber}
            onChange={handleWhatsappChange}
            readOnly={sameAsMobile}
            required
          />
          <small className="err">Enter a valid 10-digit WhatsApp number.</small>
        </div>

        <div className="check-row">
          <input
            type="checkbox"
            id="sameAsMobile"
            checked={sameAsMobile}
            onChange={handleSameAsMobileChange}
          />
          <label htmlFor="sameAsMobile">Same as mobile number</label>
        </div>

        <div className={`field${errors.address ? " has-error" : ""}`} id="field-address">
          <label htmlFor="address">
            Delivery Address <span className="opt">(house/flat no., street, landmark)</span>
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="Full delivery address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (errors.address) setErrors((prev) => ({ ...prev, address: false }));
            }}
            required
          />
          <small className="err">Please enter your delivery address.</small>
        </div>

        <p className="form-section-label">Your pack</p>

        <div className="form-row">
          <div className={`field${errors.pack ? " has-error" : ""}`} id="field-pack">
            <label htmlFor="packType">Select Pack</label>
            <select
              id="packType"
              name="packType"
              value={packType}
              onChange={(e) => {
                setPackType(e.target.value);
                if (errors.pack) setErrors((prev) => ({ ...prev, pack: false }));
              }}
              required
            >
              <option value="" disabled>
                Choose a pack
              </option>
              <option value="pack1">Pack of 1 — ₹45</option>
              <option value="pack2">Pack of 2 — ₹90 ₹80 (10% OFF)</option>
              <option value="pack5">Pack of 5 — ₹180 ₹160 (10% OFF)</option>
            </select>
            <small className="err">Please choose a pack.</small>
          </div>

          <div className="field">
            <label htmlFor="packQty">Number of Packs</label>
            <QuantityStepper quantity={packQty} onChange={setPackQty} min={1} max={20} />
          </div>
        </div>

        <div className="form-row">
          <div className={`field${errors.zone ? " has-error" : ""}`} id="field-zone">
            <label htmlFor="deliveryZone">
              Delivery Zone <span className="opt">(distance from Attapur)</span>
            </label>
            <select
              id="deliveryZone"
              name="deliveryZone"
              value={deliveryZone}
              onChange={handleZoneChange}
              required
            >
              <option value="" disabled>
                Choose your zone
              </option>
              {DELIVERY_ZONES.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </select>
            <small className="err">Please choose your delivery zone.</small>
          </div>

          <div className={`field${errors.location ? " has-error" : ""}`} id="field-location">
            <label htmlFor="locationArea">Your Area / Locality</label>
            <select
              id="locationArea"
              name="locationArea"
              value={locationArea}
              onChange={(e) => {
                setLocationArea(e.target.value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: false }));
              }}
              disabled={!deliveryZone}
              required
            >
              <option value="">
                {deliveryZone ? "Choose your locality" : "Select a zone first"}
              </option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <small className="err">Please select your locality.</small>
          </div>
        </div>

        <div className="form-row">
          <div className={`field${errors.day ? " has-error" : ""}`} id="field-day">
            <label htmlFor="deliveryDay">Delivery Day</label>
            <select
              id="deliveryDay"
              name="deliveryDay"
              value={deliveryDay}
              onChange={handleDayChange}
              required
            >
              <option value="" disabled>
                Choose delivery day
              </option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
            </select>
            <small className="err">Please choose a delivery day.</small>
          </div>

          <div className={`field${errors.slot ? " has-error" : ""}`} id="field-slot">
            <label htmlFor="deliverySlot">Delivery Slot</label>
            <select
              id="deliverySlot"
              name="deliverySlot"
              value={deliverySlot}
              onChange={(e) => {
                setDeliverySlot(e.target.value);
                if (errors.slot) setErrors((prev) => ({ ...prev, slot: false }));
              }}
              disabled={!deliveryDay}
              required
            >
              <option value="">
                {deliveryDay ? "Choose your slot" : "Select a day first"}
              </option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <small className="err">Please choose a delivery slot.</small>
          </div>
        </div>

        <div className="field">
          <label htmlFor="paymentMode">Payment Mode</label>
          <select
            id="paymentMode"
            name="paymentMode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="UPI">UPI Payment Now</option>
            <option value="COD">Cash/UPI on Delivery (+₹15 COD charge)</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="notes">
            Order Notes <span className="opt">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Preferred delivery time, special instructions, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <OrderSummary
          packPrice={summary.packPrice}
          quantity={packQty}
          deliveryFee={summary.deliveryFee}
          codFee={summary.codFee}
          total={summary.total}
        />

        <div className="form-submit">
          <button type="submit" className="btn btn--primary" id="submitBtn">
            <span id="submitBtnText">Place Order</span>
          </button>
          <p className="form-note">
            By placing an order you agree to be contacted on WhatsApp for order &amp; payment confirmation.
          </p>
        </div>
      </form>
    </>
  );
}
