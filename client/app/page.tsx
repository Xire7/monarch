// Landing Page
import Features from "@/components/Features";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import monarch_butterflies from "../public/assets/monarch_butterflies.png"
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 to-orange-300">
        <Navbar />
        <Header />
        <Image src={monarch_butterflies} width={30} height={30} alt="monarch butterflies"/>
      </div>
      <Features />
    </>
  );
}
