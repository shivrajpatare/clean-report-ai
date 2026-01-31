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
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.5s', perspective: '1000px' }}>
            <div className="relative w-[280px] md:w-[320px] transition-transform duration-500 ease-out hover:rotate-x-2" style={{ transformStyle: 'preserve-3d' }}>
              {/* Phone Frame - Titanium Style */}
              <div className="relative bg-gradient-to-b from-foreground/95 via-foreground/85 to-foreground/90 dark:from-foreground/80 dark:via-foreground/70 dark:to-foreground/75 rounded-[3rem] p-[3px] shadow-2xl">
                {/* Inner bezel */}
                <div className="relative bg-foreground/95 dark:bg-foreground/85 rounded-[2.85rem] p-2.5">
                  {/* Side buttons - Volume */}
                  <div className="absolute -left-[2px] top-24 w-[3px] h-8 bg-foreground/80 dark:bg-foreground/70 rounded-l-sm" />
                  <div className="absolute -left-[2px] top-36 w-[3px] h-8 bg-foreground/80 dark:bg-foreground/70 rounded-l-sm" />
                  {/* Side button - Power */}
                  <div className="absolute -right-[2px] top-28 w-[3px] h-12 bg-foreground/80 dark:bg-foreground/70 rounded-r-sm" />
                  
                  {/* Phone Screen */}
                  <div className="relative bg-background rounded-[2.3rem] overflow-hidden aspect-[9/19.5]">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-foreground/95 dark:bg-foreground/90 rounded-full px-4 py-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-foreground/30 dark:bg-background/20" />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>
                    
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm z-10 flex items-end justify-between px-6 pb-1">
                      <span className="text-[10px] font-medium text-foreground/70">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-[2px]">
                          <div className="w-[3px] h-2 bg-foreground/60 rounded-sm" />
                          <div className="w-[3px] h-2.5 bg-foreground/60 rounded-sm" />
                          <div className="w-[3px] h-3 bg-foreground/60 rounded-sm" />
                          <div className="w-[3px] h-3.5 bg-foreground/40 rounded-sm" />
                        </div>
                        <div className="w-5 h-2.5 border border-foreground/50 rounded-sm ml-1 relative">
                          <div className="absolute inset-[1px] bg-primary rounded-[1px]" style={{ width: '70%' }} />
                          <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-foreground/50 rounded-r-sm" />
                        </div>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="absolute inset-0 pt-14 pb-6 px-3 flex flex-col">
                      {/* App Header */}
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-[8px] font-bold text-white">A</span>
                          </div>
                          <div>
                            <p className="text-[9px] font-semibold text-foreground">Aura</p>
                            <p className="text-[7px] text-muted-foreground">Report Issues</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[8px] font-medium text-primary">Live</span>
                        </div>
                      </div>
                      
                      {/* City Map Preview */}
                      <div className="flex-1 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/10 border border-border/50 relative overflow-hidden">
                        {/* Map background */}
                        <div className="absolute inset-0 bg-[#e8f4e8] dark:bg-[#1a2f1a]" />
                        
                        {/* Grid streets */}
                        <div className="absolute inset-0">
                          {/* Horizontal streets */}
                          <div className="absolute top-[20%] left-0 right-0 h-[3px] bg-white/80 dark:bg-white/20" />
                          <div className="absolute top-[50%] left-0 right-0 h-[4px] bg-white/90 dark:bg-white/25" />
                          <div className="absolute top-[75%] left-0 right-0 h-[3px] bg-white/80 dark:bg-white/20" />
                          
                          {/* Vertical streets */}
                          <div className="absolute left-[25%] top-0 bottom-0 w-[3px] bg-white/80 dark:bg-white/20" />
                          <div className="absolute left-[60%] top-0 bottom-0 w-[4px] bg-white/90 dark:bg-white/25" />
                        </div>
                        
                        {/* Parks/Green areas */}
                        <div className="absolute top-[25%] left-[8%] w-8 h-10 bg-primary/30 rounded-lg" />
                        <div className="absolute bottom-[30%] right-[10%] w-10 h-8 bg-primary/25 rounded-lg" />
                        
                        {/* Building blocks */}
                        <div className="absolute top-[8%] right-[30%] w-6 h-5 bg-muted-foreground/20 rounded-sm" />
                        <div className="absolute top-[55%] left-[10%] w-7 h-6 bg-muted-foreground/15 rounded-sm" />
                        <div className="absolute bottom-[12%] left-[35%] w-5 h-4 bg-muted-foreground/20 rounded-sm" />
                        
                        {/* Issue markers */}
                        <div className="absolute top-[35%] left-[40%] w-3 h-3 bg-warning rounded-full border-2 border-white shadow-sm" />
                        <div className="absolute top-[60%] right-[25%] w-3 h-3 bg-destructive/80 rounded-full border-2 border-white shadow-sm" />
                        <div className="absolute bottom-[40%] left-[20%] w-3 h-3 bg-success rounded-full border-2 border-white shadow-sm" />
                        
                        {/* Cute cleaning truck */}
                        <div className="absolute top-[45%] left-[55%] animate-bounce" style={{ animationDuration: '2s' }}>
                          <div className="relative">
                            {/* Truck body */}
                            <div className="w-8 h-5 bg-primary rounded-lg relative">
                              {/* Cabin */}
                              <div className="absolute -left-2 top-0.5 w-3 h-4 bg-primary rounded-l-md">
                                <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-secondary/50 rounded-sm" />
                              </div>
                              {/* Brush stripes */}
                              <div className="absolute right-1 top-1 w-1 h-3 bg-white/40 rounded-full" />
                              <div className="absolute right-2.5 top-1 w-1 h-3 bg-white/40 rounded-full" />
                            </div>
                            {/* Wheels */}
                            <div className="absolute -bottom-1 left-0 w-2 h-2 bg-foreground/70 rounded-full" />
                            <div className="absolute -bottom-1 right-1 w-2 h-2 bg-foreground/70 rounded-full" />
                            {/* Sparkle */}
                            <div className="absolute -top-2 -right-1 text-[8px]">✨</div>
                          </div>
                        </div>
                        
                        {/* Location label */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-md">
                          <p className="text-[7px] text-foreground/70 font-medium">Pune City</p>
                        </div>
                      </div>
                      
                      {/* Bottom Controls */}
                      <div className="mt-3 flex items-center justify-between px-2">
                        {/* Gallery */}
                        <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-secondary/40 to-primary/40" />
                        </div>
                        
                        {/* Capture Button */}
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary to-secondary p-[3px] shadow-lg shadow-primary/30">
                            <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <div className="w-11 h-11 rounded-full bg-white/90 dark:bg-white/80" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Flash toggle */}
                        <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center">
                          <div className="w-4 h-5 border-2 border-foreground/40 rounded-t-full" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Home indicator */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-foreground/30 rounded-full" />
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