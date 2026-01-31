import { useState } from "react";
import { MapPin, Calendar, AlertTriangle, Send, ChevronDown, Trash2, Leaf, Construction, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AIAnalysisResultProps {
  onSubmit: () => void;
  onBack: () => void;
}

const wasteTypes = [
  { id: "garbage", label: "Street Friction", icon: Trash2, confidence: 94 },
  { id: "debris", label: "Construction Residue", icon: Construction, confidence: 78 },
  { id: "organic", label: "Organic Matter", icon: Leaf, confidence: 65 },
];

export const AIAnalysisResult = ({ onSubmit, onBack }: AIAnalysisResultProps) => {
  const [selectedType, setSelectedType] = useState(wasteTypes[0]);
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-drift" style={{ animationDelay: "-5s" }} />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between p-4 glass-panel mx-4 mt-4 rounded-2xl">
        <Button variant="ghost" onClick={onBack} className="rounded-xl hover:bg-white/10">
          ← Back
        </Button>
        <h2 className="font-medium text-foreground/80 tracking-wide">Aura Analysis</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-light text-foreground/70">Complete</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* AI Detection Summary */}
        <div className="glass-panel p-6 rounded-3xl space-y-5">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-lg" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-breath">
                <selectedType.icon className="w-8 h-8 text-primary/80" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-light text-foreground/90">{selectedType.label}</h3>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-sm font-light text-primary">
                  {selectedType.confidence}% resonance
                </span>
              </div>
              <p className="text-sm text-foreground/50 font-light">
                Aura perceived this as {selectedType.label.toLowerCase()}. Adjust if your intuition differs.
              </p>
            </div>
          </div>

          {/* Change Type */}
          <div className="relative">
            <button
              className="w-full flex items-center justify-between p-4 rounded-2xl glass-card hover:bg-white/10 transition-all duration-300"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <span className="text-foreground/70 font-light">Refine perception</span>
              <ChevronDown className={`w-5 h-5 text-foreground/50 transition-transform duration-300 ${showTypeDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl overflow-hidden z-20 shadow-xl">
                {wasteTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`w-full flex items-center gap-4 p-4 hover:bg-white/10 transition-colors ${
                      selectedType.id === type.id ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      setSelectedType(type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <type.icon className="w-5 h-5 text-primary/70" />
                    </div>
                    <span className="flex-1 text-left font-light text-foreground/80">{type.label}</span>
                    <span className="px-3 py-1 rounded-full glass-card text-xs text-foreground/50">{type.confidence}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Severity Selection */}
        <div className="space-y-4">
          <label className="text-sm font-light text-foreground/60 tracking-wide">Urgency Level</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "low", label: "Gentle", color: "from-success/20 to-success/10", textColor: "text-success" },
              { value: "medium", label: "Moderate", color: "from-warning/20 to-warning/10", textColor: "text-warning" },
              { value: "high", label: "Urgent", color: "from-destructive/20 to-destructive/10", textColor: "text-destructive" },
            ].map((level) => (
              <button
                key={level.value}
                className={`p-5 rounded-2xl transition-all duration-300 ${
                  severity === level.value
                    ? `bg-gradient-to-br ${level.color} ring-2 ring-current ${level.textColor}`
                    : 'glass-card hover:bg-white/10'
                }`}
                onClick={() => setSeverity(level.value as "low" | "medium" | "high")}
              >
                <AlertTriangle className={`w-6 h-6 mx-auto mb-3 ${severity === level.value ? '' : 'text-foreground/40'}`} />
                <span className="text-sm font-light">{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="glass-panel p-5 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-secondary/80" />
            </div>
            <div className="flex-1">
              <p className="font-light text-foreground/80">FC Road, Shivajinagar</p>
              <p className="text-sm text-foreground/50 font-light">Ward 14 • Sensed via GPS flow</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white/10 text-foreground/50">
              Adjust
            </Button>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-3">
          <label className="text-sm font-light text-foreground/60 tracking-wide">Additional Insights (Optional)</label>
          <Textarea
            placeholder="Share any context that might help the Keepers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-28 resize-none rounded-2xl glass-card border-white/10 bg-transparent 
                     placeholder:text-foreground/30 focus:ring-primary/30 font-light"
          />
        </div>

        {/* Estimated Response */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-success/10 to-primary/5 border border-success/20">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-success/80" />
          </div>
          <div className="flex-1">
            <p className="font-light text-success/90">Estimated Response: 24-48 hours</p>
            <p className="text-sm text-foreground/40 font-light">Based on current flow in your area</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="relative p-4">
        <div className="glass-panel p-4 rounded-3xl">
          <button
            onClick={onSubmit}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary/80 to-secondary/80 
                     text-white font-light flex items-center justify-center gap-3
                     hover:from-primary hover:to-secondary transition-all duration-500
                     shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                     hover:scale-[1.01] active:scale-[0.99]"
          >
            <Send className="w-5 h-5" />
            Send to City Keepers
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisResult;
