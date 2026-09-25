"use client";

import { useEffect, useRef } from "react";

export default function AboutSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <div className="about-visual reveal-scale">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/assets/about/about.mp4" type="video/mp4" />
          </video>
          <div className="about-tag">mTORA Kitchen · Everyday Roti</div>
        </div>
        <div className="about-copy">
          <span className="eyebrow">
            <span className="why">About</span>
            <span className="brand-name">mTORA</span>
          </span>
          <h2 className="reveal">More nutrition. Same everyday roti.</h2>
          <p className="lede reveal">
            We believe protein shouldn&apos;t require a separate shake, a
            complicated recipe, or a major change to your everyday meals.
          </p>
          <p className="reveal">
            mTORA was created to make protein a natural part of the food you
            already love starting with the humble Indian roti. We combine
            familiar everyday food with modern nutrition to create convenient,
            protein-rich food for everyday life.
          </p>
        </div>
      </div>
    </section>
  );
}
