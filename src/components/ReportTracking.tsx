import { useState } from "react";
import { ArrowLeft, MapPin, Clock, CheckCircle, AlertCircle, Truck, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportTrackingProps {
  onBack: () => void;
}

const mockReports = [
  {
    id: "CSA-2024-00847",
    location: "FC Road, Shivajinagar",
    type: "Street Garbage",
    status: "pending",
    date: "Today, 10:30 AM",
    updates: [
      { time: "10:30 AM", message: "Report submitted", type: "submitted" },
    ],
  },
  {
    id: "CSA-2024-00832",
    location: "Koregaon Park",
    type: "Construction Debris",
    status: "progress",
    date: "Yesterday",
    updates: [
      { time: "9:00 AM", message: "Report submitted", type: "submitted" },
      { time: "2:30 PM", message: "Assigned to cleanup crew", type: "assigned" },
      { time: "Today, 8:00 AM", message: "Crew en route", type: "progress" },
    ],
  },
  {
    id: "CSA-2024-00798",
    location: "Kothrud, Paud Road",
    type: "Organic Waste",
    status: "resolved",
    date: "2 days ago",
    updates: [
      { time: "Mon, 8:00 AM", message: "Report submitted", type: "submitted" },
      { time: "Mon, 11:00 AM", message: "Assigned to cleanup crew", type: "assigned" },
      { time: "Mon, 3:00 PM", message: "Cleanup completed", type: "resolved" },
    ],
  },
];

export const ReportTracking = ({ onBack }: ReportTrackingProps) => {
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="pending">Pending Review</Badge>;
      case "progress":
        return <Badge variant="progress">In Progress</Badge>;
      case "resolved":
        return <Badge variant="resolved">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "progress":
        return <Truck className="w-5 h-5 text-secondary" />;
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-success" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  if (selectedReport) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold">Report Details</h2>
            <p className="text-sm text-muted-foreground">{selectedReport.id}</p>
          </div>
          {getStatusBadge(selectedReport.status)}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Report Info */}
          <div className="civic-card p-4 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                {getStatusIcon(selectedReport.status)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{selectedReport.type}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {selectedReport.location}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold">Status Timeline</h3>
            <div className="space-y-0">
              {selectedReport.updates.map((update, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === selectedReport.updates.length - 1 
                        ? 'bg-primary ring-4 ring-primary/20' 
                        : 'bg-muted-foreground/30'
                    }`} />
                    {index < selectedReport.updates.length - 1 && (
                      <div className="w-0.5 h-16 bg-border" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium">{update.message}</p>
                    <p className="text-xs text-muted-foreground">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {selectedReport.status !== "resolved" && (
            <div className="civic-card p-4">
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4" />
                Send Feedback to Officials
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="font-semibold">My Reports</h2>
          <p className="text-sm text-muted-foreground">{mockReports.length} reports submitted</p>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mockReports.map((report) => (
          <button
            key={report.id}
            className="w-full civic-card p-4 text-left transition-all hover:shadow-card-hover"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {getStatusIcon(report.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold truncate">{report.type}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{report.location}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  {getStatusBadge(report.status)}
                  <span className="text-xs text-muted-foreground">{report.date}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportTracking;
