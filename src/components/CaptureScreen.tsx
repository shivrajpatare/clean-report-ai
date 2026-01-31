import { useState, useRef, useEffect } from "react";
import { Camera, X, RotateCcw, Sparkles, MapPin, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CaptureScreenProps {
  onCapture: (analysisData: AnalysisResult) => void;
  onClose: () => void;
}

export interface AnalysisResult {
  imageUrl: string;
  category: string;
  priority: string;
  confidence: number;
  description: string;
  severity_reason: string;
  latitude: number;
  longitude: number;
  address: string;
}

export const CaptureScreen = ({ onCapture, onClose }: CaptureScreenProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("Detecting location...");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          // Reverse geocode to get address (using a simple approach)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const addr = data.display_name?.split(',').slice(0, 3).join(', ') || 'Location detected';
            setAddress(addr);
          } catch {
            setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        },
        () => {
          setAddress("Location unavailable");
          // Default to Pune center
          setLocation({ lat: 18.5204, lng: 73.8567 });
        }
      );
    }
  }, []);

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
    // For demo, create a placeholder image
    setCapturedImage("captured");
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      let imageUrl = capturedImage;
      let base64Data = capturedImage;

      // If it's a real image (not simulated), upload to storage
      if (capturedImage !== "captured" && capturedImage.startsWith('data:')) {
        // Extract base64 data
        base64Data = capturedImage;
        
        // Upload to storage
        const fileName = `report_${Date.now()}.jpg`;
        const base64Content = capturedImage.split(',')[1];
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('report-images')
          .upload(fileName, blob);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload image');
        }

        const { data: urlData } = supabase.storage
          .from('report-images')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      // Call AI analysis edge function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-issue', {
        body: { imageBase64: base64Data }
      });

      if (analysisError) {
        console.error('Analysis error:', analysisError);
        throw new Error('Failed to analyze image');
      }

      // Pass results to parent
      onCapture({
        imageUrl,
        category: analysisData.category,
        priority: analysisData.priority,
        confidence: analysisData.confidence,
        description: analysisData.description,
        severity_reason: analysisData.severity_reason,
        latitude: location?.lat || 18.5204,
        longitude: location?.lng || 73.8567,
        address: address,
      });

    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-drift" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Header */}
      <div className="relative flex items-center justify-between p-4">
        <button
          onClick={onClose}
          className="p-3 rounded-2xl glass-card hover:bg-white/20 transition-all duration-300"
        >
          <X className="w-5 h-5 text-foreground/70" />
        </button>
        <h2 className="font-medium text-foreground/80 tracking-wide">Capture Moment</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
          <Sparkles className="w-4 h-4 text-primary animate-pulse-glow" />
          <span className="text-sm font-light text-foreground/70">Aura Ready</span>
        </div>
      </div>

      {/* Camera Area */}
      <div className="flex-1 relative m-4 rounded-3xl overflow-hidden glass-card">
        {capturedImage ? (
          <div className="absolute inset-0 flex items-center justify-center">
            {capturedImage === "captured" ? (
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-breath">
                    <Image className="w-10 h-10 text-primary/60" />
                  </div>
                  <p className="text-foreground/60 font-light">Moment Captured</p>
                </div>
              </div>
            ) : (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            )}
            
            {/* AI Analysis Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-xl flex items-center justify-center">
                <div className="text-center space-y-8">
                  {/* Pulsing orb */}
                  <div className="relative">
                    <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl animate-pulse-glow" />
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm flex items-center justify-center animate-breath">
                      <div className="w-24 h-24 rounded-full border-2 border-primary/30 border-t-primary animate-spin" style={{ animationDuration: "2s" }} />
                      <Sparkles className="absolute w-10 h-10 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-light tracking-wide text-foreground/80">AI Analyzing...</p>
                    <p className="text-sm text-foreground/50 font-light">Detecting issue type & priority</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <span className="px-4 py-2 rounded-full glass-card text-sm text-foreground/60 animate-fade-in">
                      🔍 Detecting
                    </span>
                    <span className="px-4 py-2 rounded-full glass-card text-sm text-foreground/60 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                      📊 Scoring
                    </span>
                    <span className="px-4 py-2 rounded-full glass-card text-sm text-foreground/60 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                      📍 Locating
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
            {/* Organic Viewfinder */}
            <div className="relative">
              <div className="w-72 h-72 rounded-[3rem] glass-panel flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl animate-pulse-glow" />
                    <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center animate-breath">
                      <Camera className="w-12 h-12 text-primary/70" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-light text-foreground/80">Frame the Issue</p>
                    <p className="text-sm text-foreground/50 font-light">
                      AI will auto-detect category & priority
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Organic corner accents */}
              <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
              <div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
              <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-primary/30 rounded-bl-3xl" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />
            </div>
            
            {/* Location Indicator */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-full glass-card max-w-xs">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-primary/70" />
              </div>
              <span className="text-sm text-foreground/60 font-light truncate">{address}</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative p-6">
        <div className="glass-panel p-6 rounded-3xl">
          {capturedImage ? (
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-14 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 font-light"
                onClick={handleRetake}
                disabled={isAnalyzing}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Recapture
              </Button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-primary/80 to-secondary/80 
                         text-white font-light flex items-center justify-center gap-2
                         hover:from-primary hover:to-secondary transition-all duration-500
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {isAnalyzing ? (
                  <>Analyzing...</>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    AI Analyze
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleSimulateCapture}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary/80 to-secondary/80 
                         text-white font-light flex items-center justify-center gap-3
                         hover:from-primary hover:to-secondary transition-all duration-500
                         shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30
                         hover:scale-[1.02] active:scale-[0.98]"
              >
                <Camera className="w-6 h-6" />
                Capture Photo
              </button>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                <span className="text-xs text-foreground/40 font-light">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-14 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 font-light"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose from Gallery
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
    </div>
  );
};

export default CaptureScreen;
