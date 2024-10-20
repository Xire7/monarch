// Landing Page
"use client";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Team from "@/components/Team";
import React, { useState } from "react";

export default function Home() {
  const [sessionId, setSessionId] = useState();
  const startSession = async () => {
    const response = await fetch(
      `http://${process.env.NEXT_PUBLIC_BACKEND_URL}}-session/`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    setSessionId(data.sessionId);
  };
  return (
    <>
      <div className="bg-gradient-to-b from-orange-50 to-orange-300">
        <Navbar />
        <Header />
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
