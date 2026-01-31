import { useState } from "react";
import { ArrowLeft, MapPin, Clock, CheckCircle, AlertCircle, Truck, MessageSquare, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportTrackingProps {
  onBack: () => void;
}

const mockReports = [
  {
    id: "AUR-2024-00847",
    location: "FC Road, Shivajinagar",
    type: "Street Friction",
    status: "pending",
    date: "Today, 10:30 AM",
    updates: [
      { time: "10:30 AM", message: "Ripple entered the flow", type: "submitted" },
    ],
  },
  {
    id: "AUR-2024-00832",
    location: "Koregaon Park",
    type: "Construction Residue",
    status: "progress",
    date: "Yesterday",
    updates: [
      { time: "9:00 AM", message: "Ripple entered the flow", type: "submitted" },
      { time: "2:30 PM", message: "Keeper team assigned", type: "assigned" },
      { time: "Today, 8:00 AM", message: "Restoration in progress", type: "progress" },
    ],
  },
  {
    id: "AUR-2024-00798",
    location: "Kothrud, Paud Road",
    type: "Organic Matter",
    status: "resolved",
    date: "2 days ago",
    updates: [
      { time: "Mon, 8:00 AM", message: "Ripple entered the flow", type: "submitted" },
      { time: "Mon, 11:00 AM", message: "Keeper team assigned", type: "assigned" },
      { time: "Mon, 3:00 PM", message: "Space restored to beauty", type: "resolved" },
    ],
  },
];

export const ReportTracking = ({ onBack }: ReportTrackingProps) => {
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-sm text-warning font-light">Awaiting Flow</span>
          </span>
        );
      case "progress":
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm text-secondary font-light">In Flow</span>
          </span>
        );
      case "resolved":
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm text-success font-light">Restored</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-6 h-6 text-warning" />;
      case "progress":
        return <Truck className="w-6 h-6 text-secondary" />;
      case "resolved":
        return <CheckCircle className="w-6 h-6 text-success" />;
      default:
        return <Clock className="w-6 h-6 text-foreground/40" />;
    }
  };

  if (selectedReport) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-background via-primary/5 to-secondary/10">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-drift" />
          <div className="absolute bottom-40 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-drift" style={{ animationDelay: "-3s" }} />
        </div>

        {/* Header */}
        <div className="relative p-4">
          <div className="glass-panel rounded-2xl px-5 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)} className="rounded-xl hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-medium text-foreground/80">Ripple Details</h2>
              <p className="text-sm text-foreground/50 font-mono">{selectedReport.id}</p>
            </div>
            {getStatusBadge(selectedReport.status)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Report Info */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-breath">
                {getStatusIcon(selectedReport.status)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-light text-foreground/90">{selectedReport.type}</h3>
                <div className="flex items-center gap-2 text-sm text-foreground/50 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="font-light">{selectedReport.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground/70 tracking-wide px-2">Flow Timeline</h3>
            <div className="glass-panel rounded-2xl p-6">
              {selectedReport.updates.map((update, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      index === selectedReport.updates.length - 1 
                        ? 'bg-gradient-to-br from-primary to-secondary ring-4 ring-primary/20' 
                        : 'bg-foreground/20'
                    }`} />
                    {index < selectedReport.updates.length - 1 && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-foreground/20 to-foreground/5" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm font-light text-foreground/80">{update.message}</p>
                    <p className="text-xs text-foreground/40 font-light mt-1">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {selectedReport.status !== "resolved" && (
            <div className="glass-panel p-4 rounded-2xl">
              <Button variant="ghost" className="w-full rounded-xl hover:bg-white/10 text-foreground/60 font-light">
                <MessageSquare className="w-5 h-5 mr-2" />
                Send Message to Keepers
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-drift" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Header */}
      <div className="relative p-4">
        <div className="glass-panel rounded-2xl px-5 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-medium text-foreground/80 tracking-wide">My Ripples</h2>
            <p className="text-sm text-foreground/50 font-light">{mockReports.length} observations flowing</p>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockReports.map((report) => (
          <button
            key={report.id}
            className="w-full glass-panel p-5 rounded-2xl text-left transition-all duration-300 hover:bg-white/10 hover:scale-[1.01] group"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                {getStatusIcon(report.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-light text-foreground/90 text-lg">{report.type}</h3>
                    <div className="flex items-center gap-2 text-sm text-foreground/50 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate font-light">{report.location}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-foreground/30 shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <div className="flex items-center justify-between mt-4">
                  {getStatusBadge(report.status)}
                  <span className="text-xs text-foreground/40 font-light">{report.date}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="p-4">
        <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-full glass-card">
          <Sparkles className="w-5 h-5 text-primary animate-pulse-glow" />
          <p className="text-sm text-foreground/50 font-light">
            Every ripple you create helps the city breathe
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportTracking;
