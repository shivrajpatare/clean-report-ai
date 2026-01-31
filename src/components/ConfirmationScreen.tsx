import { CheckCircle, MapPin, Clock, Share2, Home, FileText, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConfirmationScreenProps {
  onGoHome: () => void;
  onTrackReport: () => void;
}

export const ConfirmationScreen = ({ onGoHome, onTrackReport }: ConfirmationScreenProps) => {
  const reportId = "CSA-2024-00847";

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-6">
      {/* Success Animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-success/20 rounded-full animate-pulse-ring" />
        <div className="relative w-24 h-24 rounded-full gradient-success flex items-center justify-center shadow-glow">
          <CheckCircle className="w-12 h-12 text-success-foreground" />
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center space-y-3 mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold">Report Submitted!</h1>
        <p className="text-muted-foreground max-w-sm">
          Your report has been sent to the city ward officials. Thank you for keeping our streets clean!
        </p>
      </div>

      {/* Report Card */}
      <div className="w-full max-w-sm civic-card p-6 space-y-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Report ID</span>
          <Badge variant="outline" className="font-mono">{reportId}</Badge>
        </div>
        
        <div className="h-px bg-border" />
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">MG Road, Ward 76, Bengaluru</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Est. response: 24-48 hours</span>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">You'll receive updates via notification</span>
          </div>
        </div>
        
        <div className="h-px bg-border" />
        
        <div className="flex items-center justify-between">
          <Badge variant="pending">
            <span className="w-2 h-2 rounded-full bg-warning mr-2" />
            Pending Review
          </Badge>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-3 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <Button variant="hero" size="lg" className="w-full" onClick={onTrackReport}>
          <FileText className="w-5 h-5" />
          Track This Report
        </Button>
        <Button variant="outline" size="lg" className="w-full" onClick={onGoHome}>
          <Home className="w-5 h-5" />
          Back to Home
        </Button>
      </div>

      {/* Civic Message */}
      <p className="text-center text-sm text-muted-foreground mt-8 max-w-sm animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
        🌱 Every report makes a difference. Together, we've resolved over 5,000 issues!
      </p>
    </div>
  );
};

export default ConfirmationScreen;
