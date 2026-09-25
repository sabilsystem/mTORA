import Link from "next/link";

export default function FinalCtaSection() {
  return (
    <section className="section final-cta">
      <div className="wrap inner">
        <span className="eyebrow eyebrow--light">
          <span className="brand-name">mTORA</span>
        </span>
        <h2 className="reveal">Make protein part of your everyday meal.</h2>
        <p className="lede reveal">Your everyday roti. Upgraded with protein.</p>
        <div className="ctas">
          <Link href="/protein-report" className="btn btn--on-navy">
            View Protein Report
          </Link>
          <a
            href="https://www.instagram.com/mtora.in?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost-light"
          >
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
