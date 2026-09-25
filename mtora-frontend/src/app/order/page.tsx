import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrderHero from "@/components/order/OrderHero";
import OrderForm from "@/components/order/OrderForm";
import OrderSidebar from "@/components/order/OrderSidebar";

export const metadata: Metadata = {
  title: "Order Now — mTORA",
  description:
    "Order mTORA Protein Roti — fill in your details and we'll confirm your order shortly.",
};

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main>
        <OrderHero />
        <section className="order-body">
          <div className="wrap order-grid">
            <div className="order-form-panel">
              <OrderForm />
            </div>
            <OrderSidebar />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
