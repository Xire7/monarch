// Landing Page
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Guide from "@/components/Guide";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Team from "@/components/Team";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 to-orange-300 h-full w-full ">
        <Navbar />
        <Header />
      </div>
      <div id="guide">
        <Guide />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="team">
        <Team />
      </div>

      <Footer />
    </>
  );
}
