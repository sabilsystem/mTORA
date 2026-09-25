"use client";

import { useState } from "react";
import Link from "next/link";

import Image from "next/image";

export default function HeroSection() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <header className="hero" id="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow eyebrow--light">
            Everyday Indian Roti · Reinvented
          </span>
          <div className="hero-number">
            15g<sup>PROTEIN</sup>
          </div>
          <div className="hero-per">Per Roti</div>
          <h1 className="hero-headline">
            Your everyday roti, now packed with protein.
          </h1>
          <p className="hero-copy">
            A convenient, high-protein roti made for everyday Indian meals — no
            shakes, no substitutions, no fuss.
          </p>
          <div className="hero-ctas">
            <Link href="/order" className="btn btn--primary">
              Order Now
            </Link>
            <Link href="/protein-report" className="btn btn--ghost-light">
              View Protein Report
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div
            className="puff-ring"
            style={{
              width: "100%",
              height: "100%",
              borderColor: "rgba(228,197,136,.14)",
            }}
          />
          <div
            className="puff-ring"
            style={{
              width: "86%",
              height: "86%",
              borderColor: "rgba(228,197,136,.20)",
            }}
          />
          <div
            className="puff-ring"
            style={{
              width: "72%",
              height: "72%",
              borderColor: "rgba(228,197,136,.28)",
            }}
          />

          {!imgFailed && (
            <Image
              className="roti-plate roti-photo"
              src="/assets/hero/roti.png"
              alt="mTORA protein roti"
              width={400}
              height={400}
              priority
              style={{ height: "auto" }}
              onError={() => setImgFailed(true)}
            />
          )}

          <svg
            className="roti-plate"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="rotiBase" cx="38%" cy="32%" r="75%">
                <stop offset="0%" stopColor="#F1D9A6" />
                <stop offset="45%" stopColor="#E3BE7E" />
                <stop offset="78%" stopColor="#C89257" />
                <stop offset="100%" stopColor="#A9713D" />
              </radialGradient>
              <radialGradient id="rotiInner" cx="50%" cy="50%" r="50%">
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#7A4E22" stopOpacity=".25" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="188" fill="url(#rotiBase)" />
            <circle cx="200" cy="200" r="188" fill="url(#rotiInner)" />
            <g fill="#8A5A2B" opacity="0.35">
              <circle cx="150" cy="120" r="4" />
              <circle cx="260" cy="150" r="3" />
              <circle cx="300" cy="240" r="4.5" />
              <circle cx="120" cy="260" r="3.5" />
              <circle cx="210" cy="290" r="3" />
              <circle cx="180" cy="200" r="2.5" />
              <circle cx="90" cy="180" r="3" />
              <circle cx="250" cy="90" r="2.5" />
              <circle cx="320" cy="180" r="3" />
            </g>
            <ellipse
              cx="150"
              cy="130"
              rx="70"
              ry="40"
              fill="#ffffff"
              opacity="0.10"
            />
          </svg>

          <div className="hero-scan">
            LAB VERIFIED
            <br />
            <b>15.0g</b> PROTEIN / ROTI
            <br />
            NO PRESERVATIVES
          </div>
        </div>
      </div>
      <div className="scroll-cue">
        <span>Scroll</span>
        <span className="line" />
      </div>
    </header>
  );
}
