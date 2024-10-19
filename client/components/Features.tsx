import React from "react";
import FeatureCard from "@/components/FeatureCard";
import { FileSpreadsheet, RefreshCw, Zap } from "lucide-react";

const Features = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <p className="text-4xl font-semibold p-6">Features</p>

      <div className="flex flex-col space-y-10">
        <FeatureCard
          icon={Zap}
          title="Feature 1"
          description="Description of Feature 1"
        />
        <FeatureCard
          icon={FileSpreadsheet}
          title="Feature 2"
          description="Description of Feature 2"
        />
        <FeatureCard
          icon={RefreshCw}
          title="Feature 3"
          description="Description of Feature 3"
        />
      </div>
    </div>
  );
};

export default Features;
