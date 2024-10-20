import React from "react";
import FeatureCard from "@/components/FeatureCard";
import {
  BetweenVerticalStart,
  ChevronsLeftRightEllipsis,
  Crosshair,
} from "lucide-react";

const Features = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-stone-900 min-h-svh p-16">
      <p className="text-4xl font-semibold pb-16 text-white">Features</p>

      <div className="flex flex-col space-y-10">
        <FeatureCard
          icon={ChevronsLeftRightEllipsis}
          title="Intuitive Data Engineering"
          description="Fast, indivdualized choices reduce complex data engineering to simple clicks."
        />
        <FeatureCard
          icon={BetweenVerticalStart}
          title="Multi-Dimensional Column Matching"
          description="Dynamic dataset evaluation allows seamless adaptability to diverse dataset structures."
        />
        <FeatureCard
          icon={Crosshair}
          title="Precise Data Synchronization"
          description="High-precision, context-aware connections minimize denormalized values and enhance data quality."
        />
      </div>
    </div>
  );
};

export default Features;
