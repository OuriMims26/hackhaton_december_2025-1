import Link from "next/link";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  href?: string;
}

export function Logo({ className = "", iconOnly = false, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 group ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 w-10 h-10 transition-transform duration-300 group-hover:scale-110"
      >
        <defs>
          <linearGradient id="ourinvest_grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B8CFF" /> {/* Violet */}
            <stop offset="50%" stopColor="#F6B88C" /> {/* Or Foncé */}
            <stop offset="100%" stopColor="#F1C086" /> {/* Or Clair */}
          </linearGradient>
          {/* Effet de lueur subtile */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Le Cercle (Portfolio) */}
        <path
          d="M85 15C46.34 15 15 46.34 15 85C15 123.66 46.34 155 85 155C115.6 155 141.7 135.1 150.5 110"
          stroke="url(#ourinvest_grad)"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* La Flèche (Croissance/Signal) */}
        <g>
          {/* La courbe ascendante */}
          <path
            d="M45 115 C 60 115, 70 50, 135 25 L 135 25"
            stroke="url(#ourinvest_grad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* La pointe de la flèche */}
          <path
            d="M135 25 L 105 25 M135 25 L 135 55"
            stroke="url(#ourinvest_grad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      
      {!iconOnly && (
        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#8B8CFF] to-[#F6D9A3]">
          OurInvest
        </span>
      )}
    </Link>
  );
}