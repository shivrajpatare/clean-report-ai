import { X, MapPin, Clock, Tag, AlertTriangle, Users, CheckCircle, Play, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { MapReport } from "./AdminMapPanel";

interface ReportDetailPanelProps {
  report: MapReport | null;
  onClose: () => void;
  onUpdateStatus: (reportId: string, newStatus: string) => void;
  categoryLabels: Record<string, string>;
}

const priorityConfig = {
  critical: { label: "Critical", variant: "destructive" as const, color: "text-destructive" },
  high: { label: "High", variant: "destructive" as const, color: "text-destructive" },
  medium: { label: "Medium", variant: "warning" as const, color: "text-warning" },
  low: { label: "Low", variant: "secondary" as const, color: "text-amber-500" },
};

const statusConfig = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning" },
  in_progress: { label: "In Progress", color: "bg-secondary/10 text-secondary" },
  resolved: { label: "Resolved", color: "bg-success/10 text-success" },
  duplicate: { label: "Duplicate", color: "bg-muted text-muted-foreground" },
};

export const ReportDetailPanel = ({
  report,
  onClose,
  onUpdateStatus,
  categoryLabels,
}: ReportDetailPanelProps) => {
  if (!report) return null;

  const priority = priorityConfig[report.priority as keyof typeof priorityConfig] || priorityConfig.low;
  const status = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 animate-slide-in-right">
        <div className="h-full glass-panel rounded-l-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-medium text-foreground/90 tracking-wide">Report Details</h2>
              <p className="text-xs text-foreground/50 font-light font-mono">{report.id.slice(0, 8)}...</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Image Preview */}
            {report.before_image_url ? (
              <div className="p-5 border-b border-white/10">
                <AspectRatio ratio={16 / 9} className="rounded-xl overflow-hidden bg-black/20">
                  <img
                    src={report.before_image_url}
                    alt="Report image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </AspectRatio>
              </div>
            ) : (
              <div className="p-5 border-b border-white/10">
                <AspectRatio ratio={16 / 9} className="rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-foreground/30">No image available</p>
                  </div>
                </AspectRatio>
              </div>
            )}

            {/* Category & Priority */}
            <div className="p-5 border-b border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 font-light">AI Detected Category</p>
                    <p className="font-medium text-foreground/90">
                      {categoryLabels[report.category] || report.category}
                    </p>
                  </div>
                </div>
                <Badge variant={priority.variant} className="text-xs">
                  {priority.label} Priority
                </Badge>
              </div>

              {/* AI Description */}
              {report.ai_description && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs text-primary/70 mb-1 font-medium">AI Analysis</p>
                  <p className="text-sm text-foreground/70 font-light leading-relaxed">
                    {report.ai_description}
                  </p>
                </div>
              )}

              {/* Current Status */}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-light ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-blue-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-foreground/50 font-light mb-1">Location</p>
                  <p className="text-sm text-foreground/80 font-light">{report.address || 'Address not available'}</p>
                  <p className="text-xs text-foreground/40 font-mono mt-2">
                    {report.latitude?.toFixed(6)}, {report.longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            {/* Time Reported */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning/20 to-orange-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-foreground/50 font-light">Time Reported</p>
                  <p className="text-sm text-foreground/80 font-light">{formatDate(report.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="p-5 border-t border-white/10 space-y-3 bg-background/50 backdrop-blur-xl">
            {report.status === 'pending' && (
              <>
                <Button
                  onClick={() => onUpdateStatus(report.id, 'in_progress')}
                  className="w-full rounded-xl bg-gradient-to-r from-secondary to-blue-500 hover:shadow-lg hover:shadow-secondary/30 transition-all"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Assign Team
                </Button>
                <Button
                  onClick={() => onUpdateStatus(report.id, 'in_progress')}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Mark In Progress
                </Button>
              </>
            )}

            {report.status === 'in_progress' && (
              <Button
                onClick={() => onUpdateStatus(report.id, 'resolved')}
                className="w-full rounded-xl bg-gradient-to-r from-success to-emerald-500 hover:shadow-lg hover:shadow-success/30 transition-all"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Resolved
              </Button>
            )}

            {report.status === 'resolved' && (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                <p className="text-sm text-success font-medium">Issue Resolved</p>
                <p className="text-xs text-foreground/50 font-light">This report has been closed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportDetailPanel;
