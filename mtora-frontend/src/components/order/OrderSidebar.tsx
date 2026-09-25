export default function OrderSidebar() {
  return (
    <aside className="order-sidebar">
      <div className="order-side-card navy">
        <svg
          className="ring-mark"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="17" cy="17" r="14" stroke="currentColor" strokeWidth="1.8" />
          <circle
            cx="17"
            cy="17"
            r="7"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity=".5"
          />
        </svg>
        <h4>What happens next</h4>
        <ul className="order-steps" style={{ marginTop: "14px" }}>
          <li>You place your order — it&apos;s logged instantly to our system.</li>
          <li>You get a unique Order ID right away, on this page.</li>
          <li>Tap &ldquo;Notify &amp; Pay on WhatsApp&rdquo; to confirm &amp; complete payment.</li>
          <li>Once we verify payment, you&apos;ll get a confirmation on WhatsApp.</li>
        </ul>
      </div>

      <div className="order-side-card">
        <svg
          className="ring-mark"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M17 4l11 5.5v8c0 7-4.7 11.9-11 13.5-6.3-1.6-11-6.5-11-13.5v-8L17 4z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
        <h4>Need help ordering?</h4>
        <p>
          Message us directly on Instagram or WhatsApp and our team will help you place your order.
        </p>
      </div>
    </aside>
  );
}
