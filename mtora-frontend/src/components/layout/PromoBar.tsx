"use client";

import { useEffect, useRef, useState } from "react";

export default function PromoBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updateOffset = () => {
      if (!barRef.current) return;
      const shouldHide = window.scrollY > 30;
      setIsHidden(shouldHide);
      const height = shouldHide ? 0 : barRef.current.offsetHeight;
      document.documentElement.style.setProperty("--promo-offset", `${height}px`);
    };

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    window.addEventListener("resize", updateOffset);

    return () => {
      window.removeEventListener("scroll", updateOffset);
      window.removeEventListener("resize", updateOffset);
      document.documentElement.style.setProperty("--promo-offset", "0px");
    };
  }, []);

  return (
    <aside
      ref={barRef}
      className={`promo-bar${isHidden ? " is-hidden" : ""}`}
      id="promoBar"
      aria-label="Announcement"
    >
      <div className="promo-track">
        <span className="promo-item">
          🎉 <b>Launch Offer</b> — Get 10% OFF your first order!
        </span>
        <span className="promo-item">
          🎉 <b>Launch Offer</b> — Get 10% OFF your first order!
        </span>
        <span className="promo-item">
          🎉 <b>Launch Offer</b> — Get 10% OFF your first order!
        </span>
        <span className="promo-item">
          🎉 <b>Launch Offer</b> — Get 10% OFF your first order!
        </span>
      </div>
    </aside>
  );
}
