import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
interface AuraHeroProps {
  onStartReport: () => void;
}
export const AuraHero = ({
  onStartReport
}: AuraHeroProps) => {
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0
  });
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background - Ethereal Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10" />
      
      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-primary/20 dark:bg-primary/30 blur-ethereal animate-drift" style={{
        top: '10%',
        left: '10%'
      }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-secondary/20 dark:bg-secondary/30 blur-ethereal animate-float" style={{
        bottom: '10%',
        right: '10%',
        animationDelay: '-2s'
      }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/15 dark:bg-primary/25 blur-soft animate-breath" style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }} />
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
        <div className="max-w-4xl mx-auto text-center space-y-10">
          {/* Badge */}
          <div className="animate-fade-in-up" style={{
          animationDelay: '0.2s'
        }}>
            
          </div>

          {/* Main Headline */}
          <div className="space-y-6 animate-fade-in-up" style={{
          animationDelay: '0.4s'
        }}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-foreground/90">
              Your city,
              <br />
              <span className="font-medium bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-breath">
                breathing deeper.
              </span>
            </h1>
          </div>

          {/* Sub-headline */}
          <div className="animate-fade-in-up" style={{
          animationDelay: '0.6s'
        }}>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Aura turns your perspective into progress. A single photo ripples through 
              the city's nervous system to restore beauty in real-time.
            </p>
          </div>

          {/* CTA Button - Liquid Effect */}
          <div className="pt-8 animate-fade-in-up" style={{
          animationDelay: '0.8s'
        }}>
            <button onClick={onStartReport} className="group relative px-12 py-6 rounded-full text-lg font-medium text-primary-foreground dark:text-background
                       bg-gradient-to-r from-primary via-primary to-secondary
                       shadow-lg transition-all duration-700 ease-out
                       hover:shadow-glow-lg hover:scale-105">
              <span className="relative z-10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Begin the Bloom
              </span>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          {/* Trust indicator */}
          <div className="animate-fade-in-up" style={{
          animationDelay: '1s'
        }}>
            <p className="text-sm text-muted-foreground/70 font-light">
              Join 40,000 citizens shaping a cleaner tomorrow
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>;
};
export default AuraHero;