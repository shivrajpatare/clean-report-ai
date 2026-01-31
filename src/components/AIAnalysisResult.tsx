import { useState } from "react";
import { MapPin, Calendar, AlertTriangle, CheckCircle, Send, ChevronDown, Trash2, Leaf, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface AIAnalysisResultProps {
  onSubmit: () => void;
  onBack: () => void;
}

const wasteTypes = [
  { id: "garbage", label: "Street Garbage", icon: Trash2, confidence: 94 },
  { id: "debris", label: "Construction Debris", icon: Construction, confidence: 78 },
  { id: "organic", label: "Organic Waste", icon: Leaf, confidence: 65 },
];

export const AIAnalysisResult = ({ onSubmit, onBack }: AIAnalysisResultProps) => {
  const [selectedType, setSelectedType] = useState(wasteTypes[0]);
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>
          <h2 className="font-semibold">AI Analysis</h2>
          <Badge variant="success" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Complete
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* AI Detection Summary */}
        <div className="civic-card p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <selectedType.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{selectedType.label}</h3>
                <Badge variant="ai" className="text-xs">{selectedType.confidence}% match</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                AI detected this as {selectedType.label.toLowerCase()}. You can adjust if needed.
              </p>
            </div>
          </div>

          {/* Change Type */}
          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <span>Change detected type</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
            </Button>
            
            {showTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20">
                {wasteTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-muted transition-colors ${
                      selectedType.id === type.id ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => {
                      setSelectedType(type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <type.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="flex-1 text-left font-medium">{type.label}</span>
                    <Badge variant="outline" className="text-xs">{type.confidence}%</Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Severity Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Severity Level</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "low", label: "Low", color: "bg-success/10 border-success/20 text-success" },
              { value: "medium", label: "Medium", color: "bg-warning/10 border-warning/20 text-warning" },
              { value: "high", label: "High", color: "bg-destructive/10 border-destructive/20 text-destructive" },
            ].map((level) => (
              <button
                key={level.value}
                className={`p-4 rounded-xl border-2 transition-all ${
                  severity === level.value
                    ? level.color + ' border-current'
                    : 'border-border hover:border-muted-foreground/30'
                }`}
                onClick={() => setSeverity(level.value as "low" | "medium" | "high")}
              >
                <AlertTriangle className={`w-5 h-5 mx-auto mb-2 ${severity === level.value ? '' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="civic-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">MG Road, Bengaluru</p>
              <p className="text-sm text-muted-foreground">Ward 76 • Auto-detected via GPS</p>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Additional Details (Optional)</label>
          <Textarea
            placeholder="Add any extra information that might help cleanup crews..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-24 resize-none"
          />
        </div>

        {/* Estimated Response */}
        <div className="flex items-center gap-3 p-4 bg-success/5 rounded-xl border border-success/20">
          <Calendar className="w-5 h-5 text-success" />
          <div className="flex-1">
            <p className="text-sm font-medium text-success">Estimated Response: 24-48 hours</p>
            <p className="text-xs text-muted-foreground">Based on current workload in your area</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button variant="hero" size="xl" className="w-full" onClick={onSubmit}>
          <Send className="w-5 h-5" />
          Submit Report to City Ward
        </Button>
      </div>
    </div>
  );
};

export default AIAnalysisResult;
