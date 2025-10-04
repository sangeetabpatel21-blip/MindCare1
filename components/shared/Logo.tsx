import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

/**
 * A simple, clean component that displays the company logo.
 * It's an SVG for scalability and easy color changes.
 */
const Logo: React.FC<LogoProps> = ({ className = "", iconOnly = false }) => {
  return (
    <div className={`flex items-center gap-2 font-sans ${className}`} aria-label="MindCare Logo">
      <div className={iconOnly ? "aspect-square h-full" : "aspect-square h-16 flex-shrink-0"}>
        <svg
          className="w-full h-full"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontSize="18"
            fontWeight="bold"
            fill="white"
            dy=".1em" // small vertical adjustment
          >
            MC
          </text>
        </svg>
      </div>
      {!iconOnly && (
        <span className="text-2xl font-bold text-neutral whitespace-nowrap">
          MindCare
        </span>
      )}
    </div>
  );
};

export default Logo;
