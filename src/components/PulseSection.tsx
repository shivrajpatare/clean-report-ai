import { Eye, Sparkles, Heart, Leaf, ArrowRight } from "lucide-react";

export const PulseSection = () => {
  const journey = [
    {
      icon: Eye,
      step: "01",
      title: "Witness",
      subtitle: "See what others overlook",
      description: "That overflowing bin. The faded park bench. The forgotten corner where weeds meet litter. You notice what the city has forgotten.",
      impact: "Every observation is an act of care",
    },
    {
      icon: Sparkles,
      step: "02", 
      title: "Capture",
      subtitle: "One photo, infinite data",
      description: "Aura's AI instantly decodes the scene—material types, environmental risk, optimal cleanup approach. What takes humans hours, happens in seconds.",
      impact: "AI-powered precision routing",
    },
    {
      icon: Heart,
      step: "03",
      title: "Connect",
      subtitle: "Your voice reaches the right ears",
      description: "No bureaucratic maze. No lost reports. Your observation flows directly to local Keepers who are equipped, trained, and ready to act.",
      impact: "Direct line to action",
    },
    {
      icon: Leaf,
      step: "04",
      title: "Transform",
      subtitle: "Watch your impact bloom",
      description: "Track resolution in real-time. See the before and after. Celebrate with your community as spaces are restored to their natural beauty.",
      impact: "Visible, measurable change",
    },
  ];

  return (
    <section id="pulse" className="relative py-32 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background dark:via-muted/10" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl animate-drift" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary/10 dark:bg-secondary/5 blur-3xl animate-float" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            The Journey
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-foreground mb-6">
            From <span className="text-primary font-medium">Observation</span> to{" "}
            <span className="text-secondary font-medium">Restoration</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
            Every clean street starts with someone who cared enough to notice. 
            Here's how your awareness becomes the city's transformation.
          </p>
        </div>

        {/* Journey Cards */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {journey.map((item, index) => (
              <div
                key={index}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card */}
                <div className="glass-panel p-8 h-full transition-all duration-500 hover:shadow-glow group-hover:-translate-y-2">
                  {/* Step number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl font-extralight text-primary/30 dark:text-primary/20">
                      {item.step}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-medium text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-primary/80 dark:text-primary font-medium mb-4">
                    {item.subtitle}
                  </p>
                  <p className="text-muted-foreground font-light leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Impact badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 dark:bg-success/20 text-success text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    {item.impact}
                  </div>
                </div>

                {/* Arrow connector (not on last item) */}
                {index < journey.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-2 z-10 w-4 h-4 items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Problem Statement Callout */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                Why This Matters
              </h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed mb-6 max-w-2xl mx-auto">
                Urban waste isn't just an eyesore—it's a symptom of disconnection between citizens and their city. 
                Traditional reporting is slow, frustrating, and often ignored. 
                <span className="text-foreground font-medium"> Aura bridges that gap</span>, 
                turning passive frustration into active restoration.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 border-t border-border/50">
                <div>
                  <div className="text-3xl md:text-4xl font-light text-primary mb-1">72%</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Faster Resolution</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-light text-secondary mb-1">3x</div>
                  <div className="text-xs md:text-sm text-muted-foreground">More Reports Acted On</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-light text-accent mb-1">89%</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Citizen Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PulseSection;
