import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReportHero from "@/components/protein-report/ReportHero";
import ReportViewer from "@/components/protein-report/ReportViewer";
import ReportTrustGrid from "@/components/protein-report/ReportTrustGrid";

export const metadata: Metadata = {
  title: "Protein Report — mTORA",
  description:
    "View and download the lab-verified protein report for mTORA Protein Roti.",
};

export default function ProteinReportPage() {
  return (
    <>
      <Navbar />
      <main>
        <ReportHero />
        <section className="report-body">
          <div className="wrap">
            <ReportViewer />
            <ReportTrustGrid />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}