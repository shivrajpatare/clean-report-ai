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

          {/* Phone Mockup */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative w-[280px] md:w-[320px] animate-float">
              {/* Phone Frame */}
              <div className="relative bg-foreground/90 dark:bg-foreground/80 rounded-[3rem] p-3 shadow-2xl">
                {/* Phone Screen */}
                <div className="relative bg-background rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="w-20 h-5 bg-foreground/90 rounded-full" />
                  </div>
                  
                  {/* App Content */}
                  <div className="absolute inset-0 pt-10 pb-4 px-4 flex flex-col">
                    {/* App Header */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Aura Active
                      </div>
                    </div>
                    
                    {/* Camera Preview Area */}
                    <div className="flex-1 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/30 flex items-center justify-center relative overflow-hidden">
                      {/* Simulated street scene */}
                      <div className="absolute inset-0 bg-gradient-to-t from-muted-foreground/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 h-12 bg-muted-foreground/10 rounded-lg" />
                      <div className="absolute bottom-8 left-6 w-8 h-16 bg-muted-foreground/20 rounded-t-lg" />
                      <div className="absolute bottom-8 right-8 w-6 h-12 bg-muted-foreground/15 rounded-t-lg" />
                      
                      {/* Scan overlay */}
                      <div className="absolute inset-4 border-2 border-primary/40 rounded-xl">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
                      </div>
                      
                      {/* AI analyzing indicator */}
                      <div className="relative z-10 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/40 animate-ping" />
                        </div>
                        <span className="text-xs text-muted-foreground">Point at an issue</span>
                      </div>
                    </div>
                    
                    {/* Capture Button */}
                    <div className="mt-4 flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow effect behind phone */}
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10 animate-breath" />
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