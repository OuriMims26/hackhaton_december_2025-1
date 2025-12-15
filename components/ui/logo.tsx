import Link from "next/link";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    href?: string;
}

export function Logo({ className = "", iconOnly = false, href = "/" }: LogoProps) {
    return (
        <Link href={href} className={`flex items-center gap-2 ${className}`}>
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <defs>
                    <linearGradient
                        id="logoGrad1"
                        x1="0"
                        y1="0"
                        x2="32"
                        y2="32"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="#F1C086" />
                        <stop offset="100%" stopColor="#F6B88C" />
                    </linearGradient>
                    <linearGradient
                        id="logoGrad2"
                        x1="0"
                        y1="0"
                        x2="32"
                        y2="32"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0%" stopColor="#8B8CFF" />
                        <stop offset="100%" stopColor="#F6D9A3" />
                    </linearGradient>
                </defs>
                <rect width="32" height="32" rx="8" fill="url(#logoGrad1)" fillOpacity="0.1" />
                <path
                    d="M8 20L14 14L18 18L24 10"
                    stroke="url(#logoGrad1)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="24" cy="10" r="2" fill="url(#logoGrad1)" />
            </svg>
            {!iconOnly && (
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#8B8CFF] to-[#F6D9A3]">
                    OurInvest
                </span>
            )}
        </Link>
    );
}

