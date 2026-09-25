export default function BenefitsSection() {
  return (
    <section className="section section--cream2">
      <div className="wrap">
        <div className="benefits-head">
          <span className="eyebrow">
            Why <span className="brand-name">mTORA</span>
          </span>
          <h2 className="reveal">More than just a roti.</h2>
          <p className="lede reveal">
            Every mTORA Protein Roti is designed to bring more nutrition to your
            everyday meal.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card benefit-card--feature reveal">
            <span className="benefit-num">01</span>
            <svg
              className="benefit-icon"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="20"
                cy="20"
                r="17"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="20"
                cy="20"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                opacity=".5"
              />
              <circle cx="20" cy="20" r="3.5" fill="currentColor" />
            </svg>
            <h3>15g protein</h3>
            <p>15g of protein in every roti.</p>
          </div>

          <div className="benefit-card reveal">
            <span className="benefit-num">02</span>
            <svg
              className="benefit-icon"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 30C8 18 18 8 30 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 22c6 0 10-4 10-10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity=".55"
              />
            </svg>
            <h3>Good source of fiber</h3>
            <p>Made to bring more fiber into your everyday meal.</p>
          </div>

          <div className="benefit-card reveal">
            <span className="benefit-num">03</span>
            <svg
              className="benefit-icon"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 6l12 6v9c0 8-5.4 13.6-12 15-6.6-1.4-12-7-12-15v-9l12-6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 20l4 4 8-8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3>No preservatives</h3>
            <p>Made without added preservatives.</p>
          </div>

          <div className="benefit-card reveal">
            <span className="benefit-num">04</span>
            <svg
              className="benefit-icon"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 5c4 4 4 8 0 12s-4 8 0 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M10 5c4 4 4 8 0 12s-4 8 0 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity=".5"
              />
              <path
                d="M30 5c4 4 4 8 0 12s-4 8 0 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity=".5"
              />
            </svg>
            <h3>Essential amino acids</h3>
            <p>
              Designed with protein sources that provide essential amino acids.
            </p>
          </div>

          <div className="benefit-card reveal">
            <span className="benefit-num">05</span>
            <svg
              className="benefit-icon"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="7"
                y="12"
                width="26"
                height="20"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M13 12V9a3 3 0 013-3h8a3 3 0 013 3v3"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <h3>Everyday nutrition</h3>
            <p>
              An easy way to make protein part of your regular Indian meals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
