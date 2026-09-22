import { ReactNode } from "react";
import { ThemeToggle } from "@my-project/ui";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  icon: ReactNode;
  footerText: string;
}

export default function AuthShell({ children, title, subtitle, icon, footerText }: AuthShellProps) {
  return (
    <div className="relative w-full flex items-center justify-center p-6 overflow-hidden">
      {/* Ambient background glow & grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Glow 1 */}
        <div className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] min-w-[300px] min-h-[300px] rounded-full bg-accent/5 blur-[120px] dark:bg-accent/10 mix-blend-normal opacity-80" />
        {/* Glow 2 */}
        <div className="absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] min-w-[300px] min-h-[300px] rounded-full bg-accent/10 blur-[140px] dark:bg-accent/15 mix-blend-normal opacity-70" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      </div>

    
      <div className="w-full max-w-md bg-background p-10 rounded-card shadow-neo space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out relative z-10">
          <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-inner bg-background text-foreground mb-2 shadow-neo-sm group overflow-hidden transition-all duration-300">
            {/* Pulsing glow background */}
            <div className="absolute inset-0 rounded-full bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 w-6 h-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
          </div>
          <h1 className="text-3xl font-serif text-foreground tracking-tight leading-none">{title}</h1>
          <p className="text-muted-foreground text-sm font-medium">{subtitle}</p>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Footer Section */}
        {footerText && (
          <div className="pt-6  /40 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
              {footerText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
