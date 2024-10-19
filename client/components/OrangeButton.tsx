import React from "react";
import Link from "next/link";

interface OrangeButtonProps {
  href?: string;
  description: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const OrangeButton: React.FC<OrangeButtonProps> = ({ href, description, type = "button", onClick }) => {
  const buttonContent = (
    <button 
      className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 border-b-4 border-orange-700 hover:border-orange-800 rounded transition duration-300 ease-in-out"
      type={type}
      onClick={onClick}
    >
      {description}
    </button>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};

export default OrangeButton;