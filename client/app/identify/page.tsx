"use client";
import React, { useState, useEffect } from "react";
import { CornerRightDown, ChevronLeft, ChevronRight } from "lucide-react";
import Issue from "@/components/Issue";

const Identify = () => {
  // temp
  const issues = [
    "NULL values were found in Columns C and H.",
    "Column 4 may be unnecessary for your data.",
    "Columns Latitude and Longitude can be converted to Cities.",
  ];

  // counter for while scrolling
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollY, setMaxScrollY] = useState(1);

  useEffect(() => {
    const getScrollValue = () => {
      setScrollPosition(window.scrollY);
      setMaxScrollY(
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight
      );
    };
    window.addEventListener("scroll", getScrollValue);
    return () => {
      window.removeEventListener("scroll", getScrollValue);
    };
  }, []);

  return (
    <div className="flex flex-col justify-start bg-gradient-to-b from-orange-400 to-orange-300 min-h-svh p-32 pb-0">
      <p className="text-8xl font-medium text-white leading-normal">
        Thanks for waiting! <br /> Here's what we noticed.
      </p>

      <CornerRightDown
        size={256}
        color="white"
        className="animate-bounce my-48"
      />
      {issues.map((issue, index) => (
        <Issue description={issue} number={index + 1} total={issues.length} />
      ))}
      <div className="flex flex-row fixed bottom-8 right-8 text-white space-x-8">
        <p>
          [ {Math.round((scrollPosition / maxScrollY) * issues.length)} /{" "}
          {issues.length} ]
        </p>
      </div>
    </div>
  );
};

export default Identify;
