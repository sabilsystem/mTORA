import Link from "next/link";
import { WHATSAPP_NUMBER } from "./orderData";

export interface ConfirmedOrderDetails {
  orderId: string;
  name: string;
  mobile: string;
  packType: string;
  packQty: number;
  locationArea: string;
  deliveryZone: string;
  deliveryDay: string;
  deliverySlot: string;
  deliveryFee: number;
  codFee: number;
  paymentMode: string;
  total: number;
}

interface OrderConfirmationProps {
  order: ConfirmedOrderDetails;
  onNewOrder: () => void;
}

export default function OrderConfirmation({
  order,
  onNewOrder,
}: OrderConfirmationProps) {
  const rows: [string, string][] = [
    ["Name", order.name],
    ["Mobile", order.mobile],
    ["Pack", `${order.packType} × ${order.packQty}`],
    ["Delivery Area", `${order.locationArea} (${order.deliveryZone})`],
    ["Delivery Day", order.deliveryDay],
    ["Delivery Slot", order.deliverySlot],
    ["Delivery Charge", order.deliveryFee === 0 ? "Free" : `₹${order.deliveryFee}`],
  ];

  if (order.codFee > 0) {
    rows.push(["COD Charge", `₹${order.codFee}`]);
  }

  rows.push([
    "Payment Mode",
    order.paymentMode === "UPI" ? "UPI" : "Cash on Delivery",
  ]);
  rows.push(["Total Payable", `₹${order.total}`]);

  const waText = encodeURIComponent(
    `Hi mTORA! I just placed an order.\n` +
      `Order ID: ${order.orderId}\n` +
      `Name: ${order.name}\n` +
      `Pack: ${order.packType} x${order.packQty}\n` +
      `Delivery: ${order.deliveryDay}, ${order.deliverySlot}\n` +
      `Total: ₹${order.total}\n` +
      `Payment Mode: ${order.paymentMode}\n` +
      `Please confirm my order${
        order.paymentMode === "UPI" ? " and share payment details." : "."
      }`
  );

  const cleanWhatsappNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${waText}`;

  return (
    <div className="order-confirm is-visible" id="orderConfirm">
      <div className="confirm-check">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          width="36"
          height="36"
          aria-hidden="true"
        >
          <path
            d="M4 12.5l5 5L20 6"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2>Order placed successfully!</h2>
      <p className="lede">
        Save your Order ID below. Tap the button to message us on WhatsApp and complete your payment.
      </p>

      <div className="confirm-id">
        <span className="lbl">Your Order ID</span>
        <span className="val" id="confirmOrderId">
          {order.orderId}
        </span>
      </div>

      <div className="confirm-table" id="confirmTable">
        {rows.map(([label, value]) => (
          <div className="row" key={label}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <div className="confirm-ctas">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--whatsapp"
          id="confirmWhatsappBtn"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.9 14.2c-.2.6-1.4 1.2-1.9 1.2-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.6.8 2 .9 2.1.1.2.1.4 0 .6-.1.2-.1.3-.3.5-.1.2-.3.4-.4.5-.1.1-.3.3-.1.6.2.3.9 1.5 2 2.4 1.3 1.2 2.5 1.5 2.8 1.7.3.2.5.1.7-.1.2-.2.8-1 1-1.3.2-.3.4-.3.7-.2.3.1 1.7.8 2 1 .3.1.5.2.6.3.1.2.1.9-.1 1.5z" />
          </svg>
          Notify &amp; Pay on WhatsApp
        </a>

        <Link href="/protein-report" className="btn btn--ghost-dark">
          View Protein Report
        </Link>

        <button
          type="button"
          className="btn btn--ghost-dark"
          id="newOrderBtn"
          onClick={onNewOrder}
        >
          Place Another Order
        </button>
      </div>
    </div>
  );
}
