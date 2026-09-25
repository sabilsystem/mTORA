"use client";

import { useEffect } from "react";
import PromoBar from "@/components/layout/PromoBar";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import MealFitSection from "@/components/home/MealFitSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  useEffect(() => {
    const revealEls = document.querySelectorAll<HTMLElement>(".reveal, .reveal-scale");
    const checkVisibility = () => {
      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 50) {
          el.classList.add("is-visible");
        }
      });
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px 40px 0px" }
      );

      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add("is-visible");
        } else {
          io.observe(el);
        }
      });

      window.addEventListener("scroll", checkVisibility, { passive: true });

      const fallbackTimer = setTimeout(() => {
        revealEls.forEach((el) => el.classList.add("is-visible"));
      }, 1500);
      return () => {
        io.disconnect();
        window.removeEventListener("scroll", checkVisibility);
        clearTimeout(fallbackTimer);
      };
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }, []);

  return (
    <>
      <PromoBar />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <BenefitsSection />
        <MealFitSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
