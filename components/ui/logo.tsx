import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  href?: string;
}

export function Logo({ className = "", iconOnly = false, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 group ${className}`}>
      <div className="relative w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-110">
        <Image
          src="/logo.png"
          alt="OurInvest Logo"
          fill
          className="object-contain"
          sizes="40px"
        />
      </div>

      {!iconOnly && (
        <span className="font-bold text-2xl pt-2 tracking-tight text-[#F6B88C]">
          OurInvest
        </span>
      )}
    </Link>
  );
}