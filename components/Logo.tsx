interface LogoProps {
  className?: string;
  align?: "left" | "center";
  variant?: "full" | "icon";
  /** Use for dark backgrounds (e.g. sidebar) – light text, accent dot */
  inverse?: boolean;
}

export default function Logo({ className = "", align = "center", variant = "full", inverse = false }: LogoProps) {
  if (variant === "icon") {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-accent text-white font-bold text-sm shrink-0 h-8 w-8 ${className}`}
        aria-hidden
      >
        F
      </div>
    );
  }

  const textClass = inverse ? "text-primary-text" : "text-primary-text";

  return (
    <div
      className={`flex flex-col items-start ${className}`}
      aria-label="Free. Then What"
    >
      <div className={`text-sm font-semibold leading-tight flex items-baseline gap-1 ${textClass}`}>
        Free
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent shrink-0 align-middle" aria-hidden />
      </div>
      <div className={`text-sm font-semibold leading-tight ${textClass}`}>
        Then
      </div>
      <div className={`text-sm font-semibold leading-tight ${textClass}`}>
        What
      </div>
    </div>
  );
}
