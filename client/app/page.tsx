// Landing Page
import Features from "@/components/Features";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 to-orange-300 min-h-svh">
        <Navbar />
        <Header />
        <div id="features">
          <Features />
        </div>
      </div>
    </>
  );
}
