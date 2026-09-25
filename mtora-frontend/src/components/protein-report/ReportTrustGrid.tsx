export default function ReportTrustGrid() {
  return (
    <div className="report-trust">
      <div className="trust-card">
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
        <h4>Independently tested</h4>
        <p>
          Every batch specification is verified against an accredited laboratory analysis.
        </p>
      </div>

      <div className="trust-card">
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
        <h4>No inflated claims</h4>
        <p>
          Every figure on this site matches the verified values published in the report.
        </p>
      </div>

      <div className="trust-card">
        <svg
          className="ring-mark"
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 17c0-6 4.5-11 11-11s11 5 11 11-4.5 11-11 11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 17l3-3M6 17l3 3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h4>Always up to date</h4>
        <p>
          This report is refreshed whenever a new batch analysis becomes available.
        </p>
      </div>
    </div>
  );
}
