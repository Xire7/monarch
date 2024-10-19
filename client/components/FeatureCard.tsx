import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 to-white px-24 py-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:scale-125 hover:duration-500 ">
      <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500 ease-in-out"></div>
      <div className="relative z-10">
        <div className="flex justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
          <Icon className="text-orange-500" size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">
          {title}
        </h3>
        <p className="text-gray-600 text-center">{description}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
};

export default FeatureCard;
