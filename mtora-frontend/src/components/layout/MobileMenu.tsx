"use client";

import { useEffect } from "react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={`mobile-menu${isOpen ? " is-open" : ""}`}
      id="mobileMenu"
      aria-hidden={!isOpen}
    >
      <Link href="/" onClick={onClose}>
        Home
      </Link>
      <Link href="/protein-report" onClick={onClose}>
        Protein Report
      </Link>
      <Link href="/order" onClick={onClose}>
        Order Now
      </Link>
      <a
        href="https://www.instagram.com/mtora.in?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
      >
        Instagram
      </a>
      <Link href="/protein-report" className="btn btn--primary" onClick={onClose}>
        View Protein Report
      </Link>
    </div>
  );
}
