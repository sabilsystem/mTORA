"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`nav${isScrolled ? " is-scrolled" : ""}`} id="siteNav">
        <div className="wrap">
          <Link href="/" className="logo">
            mTORA
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/protein-report"
                className={pathname === "/protein-report" ? "active" : ""}
              >
                Protein Report
              </Link>
            </li>
            <li>
              <Link
                href="/order"
                className={pathname === "/order" ? "active" : ""}
              >
                Order Now
              </Link>
            </li>
          </ul>
          <div className="nav-right">
            <Link href="/order" className="btn btn--primary btn--sm">
              Order Now
            </Link>
            <button
              type="button"
              className={`nav-burger${isMenuOpen ? " is-open" : ""}`}
              id="burgerBtn"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
