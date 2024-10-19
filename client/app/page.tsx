// Landing Page
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 to-orange-300 min-h-svh">
        <Navbar />
        <Header />
      </div>
      <div id="features">
        <Features />
      </div>
      <Footer />
    </>
  );
}
