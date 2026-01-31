import { useState, useRef } from "react";
import { Camera, X, RotateCcw, Zap, MapPin, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CaptureScreenProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export const CaptureScreen = ({ onCapture, onClose }: CaptureScreenProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateCapture = () => {
    // Simulate capture with a placeholder
    setCapturedImage("captured");
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      onCapture(capturedImage || "simulated");
    }, 2000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold">Report Issue</h2>
        <Badge variant="ai" className="text-xs">
          <Zap className="w-3 h-3 mr-1" />
          AI Ready
        </Badge>
      </div>

      {/* Camera Area */}
      <div className="flex-1 relative bg-muted">
        {capturedImage ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {capturedImage === "captured" ? (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Image className="w-16 h-16 mx-auto text-muted-foreground/50" />
                  <p className="text-muted-foreground">Image Captured</p>
                </div>
              </div>
            ) : (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            )}
            
            {/* AI Analysis Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">AI Analyzing...</p>
                    <p className="text-sm text-muted-foreground">Detecting waste type & severity</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="ai">Scanning Image</Badge>
                    <Badge variant="secondary">Detecting Objects</Badge>
                    <Badge variant="outline">Locating GPS</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
            {/* Camera Viewfinder */}
            <div className="relative">
              <div className="w-64 h-64 border-2 border-dashed border-primary/50 rounded-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center ai-pulse">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Capture Waste</p>
                    <p className="text-sm text-muted-foreground">Point camera at the issue</p>
                  </div>
                </div>
              </div>
              
              {/* Corner Markers */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
            </div>
            
            {/* Location Indicator */}
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-md">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm">Location will be auto-detected</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-card border-t border-border">
        {capturedImage ? (
          <div className="flex gap-4">
            <Button variant="outline" size="lg" className="flex-1" onClick={handleRetake} disabled={isAnalyzing}>
              <RotateCcw className="w-5 h-5" />
              Retake
            </Button>
            <Button variant="hero" size="lg" className="flex-1" onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button variant="hero" size="xl" className="flex-1" onClick={handleSimulateCapture}>
                <Camera className="w-5 h-5" />
                Capture Photo
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <Button variant="outline" size="lg" className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-5 h-5" />
              Upload from Gallery
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptureScreen;
