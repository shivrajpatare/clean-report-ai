import { Eye, Brain, Users } from "lucide-react";

export const PulseSection = () => {
  const steps = [
    {
      icon: Eye,
      title: "See",
      description: "Capture a moment of friction—litter, a faded mural, or an overgrown path.",
      delay: "0s",
    },
    {
      icon: Brain,
      title: "Sense",
      description: "Aura's AI instantly understands the 'wound,' categorizing materials and urgency.",
      delay: "0.2s",
    },
    {
      icon: Users,
      title: "Solve",
      description: "Local Keepers are deployed via the most efficient, low-carbon path.",
      delay: "0.4s",
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      {/* Central Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
        <div className="absolute inset-0 rounded-full gradient-orb animate-pulse-glow" />
        <div className="absolute inset-12 rounded-full bg-white/40 backdrop-blur-3xl border border-white/30" />
        <div className="absolute inset-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 animate-breath" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-light tracking-wide text-foreground/90 mb-6">
            The Pulse
          </h2>
          <p className="text-lg text-muted-foreground font-light">
            How Aura transforms observation into action
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-in-up"
              style={{ animationDelay: step.delay }}
            >
              {/* Connecting line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-px">
                  <svg className="w-full h-20" viewBox="0 0 200 20" preserveAspectRatio="none">
                    <path
                      d="M 0 10 Q 100 0 200 10"
                      fill="none"
                      stroke="url(#flowGradient)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      className="opacity-40"
                    />
                    <defs>
                      <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              <div className="glass-panel p-8 text-center transition-all duration-500 hover:shadow-glow group-hover:-translate-y-2">
                {/* Icon */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-breath" />
                  <div className="absolute inset-2 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-medium text-foreground/90 mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The Current - flowing line */}
        <div className="absolute left-0 right-0 bottom-20 opacity-20">
          <svg className="w-full h-40" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              d="M 0 50 Q 300 20 600 50 T 1200 50"
              fill="none"
              stroke="url(#currentGradient)"
              strokeWidth="2"
              className="animate-breath"
            />
            <defs>
              <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default PulseSection;
