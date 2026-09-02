import { LucideIcon } from "lucide-react";

export type SocialBrand = "linkedin" | "gmail" | "github" | "whatsapp" | "location";

interface SocialIconButtonProps {
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  brand: SocialBrand;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const brandStyles: Record<
  SocialBrand,
  {
    text: string;
    border: string;
    bg: string;
    glow: string;
    badgeBg: string;
  }
> = {
  linkedin: {
    text: "text-[#0A66C2]",
    border: "hover:border-[#0A66C2]/70",
    bg: "hover:bg-[#0A66C2]/15",
    glow: "hover:shadow-[0_0_20px_rgba(10,102,194,0.45)]",
    badgeBg: "bg-[#0A66C2]",
  },
  gmail: {
    text: "text-[#EA4335]",
    border: "hover:border-[#EA4335]/70",
    bg: "hover:bg-[#EA4335]/15",
    glow: "hover:shadow-[0_0_20px_rgba(234,67,53,0.45)]",
    badgeBg: "bg-[#EA4335]",
  },
  github: {
    text: "text-white",
    border: "hover:border-white/70",
    bg: "hover:bg-white/15",
    glow: "hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]",
    badgeBg: "bg-white text-black",
  },
  whatsapp: {
    text: "text-[#25D366]",
    border: "hover:border-[#25D366]/70",
    bg: "hover:bg-[#25D366]/15",
    glow: "hover:shadow-[0_0_20px_rgba(37,211,102,0.45)]",
    badgeBg: "bg-[#25D366]",
  },
  location: {
    text: "text-[#FF7A00]",
    border: "hover:border-[#FF7A00]/70",
    bg: "hover:bg-[#FF7A00]/15",
    glow: "hover:shadow-[0_0_20px_rgba(255,122,0,0.45)]",
    badgeBg: "bg-[#FF7A00]",
  },
};

export default function SocialIconButton({
  href,
  onClick,
  icon: Icon,
  label,
  brand,
  className = "",
  size = "md",
}: SocialIconButtonProps) {
  const style = brandStyles[brand];

  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-12 h-12",
  }[size];

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4.5 h-4.5",
    lg: "w-5 h-5",
  }[size];

  const sharedProps = {
    "aria-label": label,
    className: `ui-glass-surface relative inline-flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10 ${sizeClasses} ${style.border} ${style.bg} ${style.glow} transition-all duration-150 ease-out hover:scale-110 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816] ${className}`,
  };

  const content = (
    <Icon
      aria-hidden="true"
      focusable="false"
      className={`${iconSizes} ${style.text} transition-transform duration-150`}
    />
  );

  if (href) {
    const isExternal = href.startsWith("http");

    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...sharedProps}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} {...sharedProps}>
      {content}
    </button>
  );
}
