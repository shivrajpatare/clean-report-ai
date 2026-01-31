import { useEffect, useRef, useState } from "react";

interface AuraHeroProps {
  onStartReport: () => void;
}

export const AuraHero = ({ onStartReport }: AuraHeroProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background - Ethereal Gradient with Motion */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10 animate-gradient-shift" />
      
      {/* Animated Orbs with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full bg-primary/20 dark:bg-primary/30 blur-ethereal animate-drift transition-transform duration-100"
          style={{
            top: '10%',
            left: '10%',
            transform: `translateY(${scrollY * 0.15}px)`,
          }} 
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full bg-secondary/20 dark:bg-secondary/30 blur-ethereal animate-float transition-transform duration-100"
          style={{
            bottom: '10%',
            right: '10%',
            animationDelay: '-2s',
            transform: `translateY(${scrollY * 0.25}px)`,
          }} 
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full bg-primary/15 dark:bg-primary/25 blur-soft animate-breath transition-transform duration-100"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, calc(-50% + ${scrollY * 0.1}px))`,
          }} 
        />
      </div>

      {/* Floating Lens Effect - follows cursor */}
      <div className="absolute w-80 h-80 rounded-full pointer-events-none transition-all duration-700 ease-out" style={{
      left: mousePos.x - 160,
      top: mousePos.y - 160,
      background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
      filter: 'blur(30px)'
    }} />

      {/* Content */}
      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Text Content */}
          <div className="max-w-2xl text-center lg:text-left space-y-8">
            {/* Main Headline */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground/90">
                Your city,
                <br />
                <span className="font-medium bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-breath">
                  breathing deeper.
                </span>
              </h1>
            </div>

            {/* Sub-headline */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                Aura turns your perspective into progress. A single photo ripples through 
                the city's nervous system to restore beauty in real-time.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <button 
                onClick={onStartReport} 
                className="group relative px-12 py-6 rounded-full text-lg font-medium text-primary-foreground dark:text-background
                           bg-gradient-to-r from-primary via-primary to-secondary
                           shadow-lg transition-all duration-700 ease-out
                           hover:shadow-glow-lg hover:scale-105 hover-glow-pulse"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Begin the Bloom
                </span>
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>

            {/* Trust indicator */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <p className="text-sm text-muted-foreground/70 font-light">
                Join 40,000 citizens shaping a cleaner tomorrow
              </p>
            </div>
          </div>

          {/* Phone Mockup - Onboarding Style */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative w-[280px] md:w-[320px]">
              {/* Phone Frame */}
              <div className="relative bg-foreground rounded-[3rem] p-3 shadow-2xl border border-border">
                {/* Phone Screen */}
                <div className="relative bg-gradient-to-b from-primary/80 to-primary/40 rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-10 z-20 flex items-center justify-between px-6 pt-2">
                    <span className="text-xs font-medium text-foreground/90">9:41</span>
                    <div className="w-24 h-6 bg-foreground rounded-full" />
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-foreground/90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3C7.5 3 3.75 5.25 1.5 9L3 10.5C4.75 7.75 8.25 6 12 6s7.25 1.75 9 4.5L22.5 9C20.25 5.25 16.5 3 12 3zM12 9c-2.75 0-5.25 1.25-7 3.5L6.5 14c1.25-1.5 3.25-2.5 5.5-2.5s4.25 1 5.5 2.5l1.5-1.5C17.25 10.25 14.75 9 12 9zm0 6c-1.5 0-2.75.75-3.5 1.75L12 20l3.5-3.25C14.75 15.75 13.5 15 12 15z"/>
                      </svg>
                      <svg className="w-5 h-5 text-foreground/90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 4h-3V2h-4v2H7v18h10V4z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Skip Button */}
                  <div className="absolute top-12 right-4 z-20">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Dark Wave/Curve */}
                  <svg className="absolute top-8 left-0 right-0 w-full h-32 z-10" viewBox="0 0 320 120" preserveAspectRatio="none">
                    <path 
                      d="M0,0 L0,60 Q80,100 160,70 Q240,40 320,80 L320,0 Z" 
                      fill="hsl(var(--foreground))"
                      fillOpacity="0.95"
                    />
                  </svg>
                  
                  {/* Title Text */}
                  <div className="absolute top-16 left-5 z-20 max-w-[140px]">
                    <h3 className="text-lg font-semibold text-background leading-tight">
                      Your Clean Journey Begins Here
                    </h3>
                  </div>
                  
                  {/* Simplified Character Illustration */}
                  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-28 h-36 z-10">
                    <div className="relative w-full h-full flex items-end justify-center">
                      {/* Simplified person silhouette */}
                      <div className="relative">
                        {/* Body */}
                        <div className="w-14 h-20 bg-secondary/80 rounded-t-3xl" />
                        {/* Head */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-9 h-9 bg-secondary/60 rounded-full" />
                        {/* Face hint */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-6 h-3 bg-accent/50 rounded-lg" />
                      </div>
                      {/* Broom */}
                      <div className="absolute bottom-0 -left-2 w-1 h-24 bg-secondary/70 rounded-full transform -rotate-12 origin-bottom" />
                      <div className="absolute bottom-0 -left-5 w-6 h-3 bg-secondary/50 rounded-b-lg transform -rotate-12" />
                      {/* Bucket */}
                      <div className="absolute bottom-0 -right-2 w-7 h-5 bg-muted-foreground/40 rounded-b-lg">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-1.5 border border-muted-foreground/50 rounded-t-full" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Dots & Arrow */}
                  <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6 z-20">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-foreground/80" />
                      <div className="w-2 h-2 rounded-full bg-foreground/30" />
                      <div className="w-2 h-2 rounded-full bg-foreground/30" />
                    </div>
                    <div className="w-12 h-12 rounded-full bg-foreground/90 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow effect behind phone */}
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default AuraHero;