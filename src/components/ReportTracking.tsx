import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  MessageSquare,
  ChevronRight,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ReportTrackingProps {
  onBack: () => void;
}

interface Report {
  id: string;
  category: string;
  priority: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  before_image_url: string;
  after_image_url: string | null;
  ai_description: string | null;
  created_at: string;
  resolved_at: string | null;
  citizen_verified: boolean | null;
  citizen_feedback: string | null;
}

const categoryLabels: Record<string, string> = {
  garbage_dump: "Garbage Dump",
  dustbin_not_cleaned: "Dustbin Not Cleaned",
  burning_garbage: "Burning Garbage",
  open_manhole: "Open Manhole/Drain",
  stagnant_water: "Stagnant Water",
  dead_animal: "Dead Animal",
  sewage_overflow: "Sewage Overflow",
  sweeping_not_done: "Sweeping Not Done",
  other: "Other Issue",
};

export const ReportTracking = ({ onBack }: ReportTrackingProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("public_reports") // Use secure view
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      // @ts-ignore - view types might not be generated yet
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Could not load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFeedback = async (reportId: string, verified: boolean) => {
    try {
      // Use secure RPC instead of direct update
      const { error } = await supabase.rpc("submit_report_feedback", {
        report_id: reportId,
        verified: verified,
      });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: verified ? "Thank you for confirming!" : "We'll follow up on this.",
      });

      fetchReports();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-sm text-warning font-light">Pending</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm text-secondary font-light">In Progress</span>
          </span>
        );
      case "resolved":
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm text-success font-light">Resolved</span>
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
      case "in_progress":
        return <Truck className="w-6 h-6 text-secondary" />;
      case "resolved":
        return <CheckCircle className="w-6 h-6 text-success" />;
      default:
        return <Clock className="w-6 h-6 text-foreground/40" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { label: string; className: string }> = {
      low: { label: "🟡 Low", className: "bg-success/10 text-success" },
      medium: { label: "🟠 Medium", className: "bg-warning/10 text-warning" },
      high: { label: "🔴 High", className: "bg-destructive/10 text-destructive" },
      critical: { label: "🚨 Critical", className: "bg-destructive/20 text-destructive" },
    };
    const p = config[priority] || config.medium;
    return <span className={`px-3 py-1 rounded-full text-xs font-light ${p.className}`}>{p.label}</span>;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (selectedReport) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-background via-primary/5 to-secondary/10">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-drift" />
          <div
            className="absolute bottom-40 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-drift"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        {/* Header */}
        <div className="relative p-4">
          <div className="glass-panel rounded-2xl px-5 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedReport(null)}
              className="rounded-xl hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-medium text-foreground/80">Report Details</h2>
              <p className="text-sm text-foreground/50 font-mono">{selectedReport.id.slice(0, 8)}</p>
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
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-light text-foreground/90">
                    {categoryLabels[selectedReport.category] || selectedReport.category}
                  </h3>
                  {getPriorityBadge(selectedReport.priority)}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/50 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="font-light">{selectedReport.address}</span>
                </div>
                {selectedReport.ai_description && (
                  <p className="text-sm text-foreground/60 mt-3 font-light">{selectedReport.ai_description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Before Image */}
          {selectedReport.before_image_url && (
            <div className="space-y-3">
              <h4 className="text-sm font-light text-foreground/60 px-2">Reported Image</h4>
              <div className="glass-panel p-3 rounded-2xl">
                <img
                  src={selectedReport.before_image_url}
                  alt="Before"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            </div>
          )}

          {/* After Image (if resolved) */}
          {selectedReport.status === "resolved" && selectedReport.after_image_url && (
            <div className="space-y-3">
              <h4 className="text-sm font-light text-foreground/60 px-2">After Cleanup</h4>
              <div className="glass-panel p-3 rounded-2xl">
                <img src={selectedReport.after_image_url} alt="After" className="w-full h-48 object-cover rounded-xl" />
              </div>
            </div>
          )}

          {/* Citizen Feedback (for resolved reports) */}
          {selectedReport.status === "resolved" && selectedReport.citizen_verified === null && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h4 className="font-medium text-foreground/80">Was this issue actually resolved?</h4>
              <p className="text-sm text-foreground/50 font-light">Your feedback helps improve city services</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleFeedback(selectedReport.id, true)}
                  className="flex-1 bg-success/20 hover:bg-success/30 text-success"
                >
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  Yes, fixed!
                </Button>
                <Button
                  onClick={() => handleFeedback(selectedReport.id, false)}
                  variant="outline"
                  className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <ThumbsDown className="w-5 h-5 mr-2" />
                  Still dirty
                </Button>
              </div>
            </div>
          )}

          {selectedReport.citizen_verified !== null && (
            <div
              className={`glass-panel p-5 rounded-2xl ${selectedReport.citizen_verified ? "bg-success/5" : "bg-warning/5"}`}
            >
              <p className="text-sm font-light">
                {selectedReport.citizen_verified
                  ? "✅ You confirmed this issue was resolved"
                  : "⚠️ You reported this is still not fixed - we're following up"}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground/70 tracking-wide px-2">Timeline</h3>
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary ring-4 ring-primary/20" />
                  {selectedReport.status !== "pending" && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-foreground/20 to-foreground/5" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-sm font-light text-foreground/80">Report submitted</p>
                  <p className="text-xs text-foreground/40 font-light mt-1">{formatDate(selectedReport.created_at)}</p>
                </div>
              </div>

              {selectedReport.status !== "pending" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${selectedReport.status === "resolved" ? "bg-foreground/20" : "bg-gradient-to-br from-primary to-secondary ring-4 ring-primary/20"}`}
                    />
                    {selectedReport.status === "resolved" && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-foreground/20 to-foreground/5" />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-sm font-light text-foreground/80">Work in progress</p>
                    <p className="text-xs text-foreground/40 font-light mt-1">Team assigned</p>
                  </div>
                </div>
              )}

              {selectedReport.status === "resolved" && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-success to-emerald-400 ring-4 ring-success/20" />
                  </div>
                  <div>
                    <p className="text-sm font-light text-foreground/80">Issue resolved</p>
                    <p className="text-xs text-foreground/40 font-light mt-1">
                      {selectedReport.resolved_at ? formatDate(selectedReport.resolved_at) : "Recently"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-drift" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-drift"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Header */}
      <div className="relative p-4">
        <div className="glass-panel rounded-2xl px-5 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-medium text-foreground/80 tracking-wide">Track Reports</h2>
            <p className="text-sm text-foreground/50 font-light">{reports.length} reports found</p>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchReports} className="rounded-xl hover:bg-white/10">
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 mx-auto text-primary/40 mb-4" />
            <p className="text-foreground/60 font-light">No reports yet</p>
            <p className="text-sm text-foreground/40 font-light">Be the first to report an issue!</p>
          </div>
        ) : (
          reports.map((report) => (
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-light text-foreground/90 text-lg">
                          {categoryLabels[report.category] || report.category}
                        </h3>
                        {getPriorityBadge(report.priority)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/50 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate font-light">{report.address}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-foreground/30 shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    {getStatusBadge(report.status)}
                    <span className="text-xs text-foreground/40 font-light">{formatDate(report.created_at)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="p-4">
        <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-full glass-card">
          <Sparkles className="w-5 h-5 text-primary animate-pulse-glow" />
          <p className="text-sm text-foreground/50 font-light">Every report helps make the city cleaner</p>
        </div>
      </div>
    </div>
  );
};

export default ReportTracking;
