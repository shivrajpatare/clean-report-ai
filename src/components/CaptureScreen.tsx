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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-drift" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Close Button - Floating */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-20 p-3 rounded-2xl glass-card hover:bg-white/20 transition-all duration-300"
      >
        <X className="w-5 h-5 text-foreground/70" />
      </button>

      {/* Phone Mockup Frame */}
      <div className="relative animate-fade-in-up" style={{ perspective: '1000px' }}>
        <div className="relative w-[320px] md:w-[360px] transition-transform duration-500 ease-out" style={{ transformStyle: 'preserve-3d' }}>
          {/* Phone Frame - Titanium Style */}
          <div className="relative bg-gradient-to-b from-foreground/95 via-foreground/85 to-foreground/90 dark:from-foreground/80 dark:via-foreground/70 dark:to-foreground/75 rounded-[3rem] p-[3px] shadow-2xl">
            {/* Inner bezel */}
            <div className="relative bg-foreground/95 dark:bg-foreground/85 rounded-[2.85rem] p-2.5">
              {/* Side buttons - Volume */}
              <div className="absolute -left-[2px] top-24 w-[3px] h-8 bg-foreground/80 dark:bg-foreground/70 rounded-l-sm" />
              <div className="absolute -left-[2px] top-36 w-[3px] h-8 bg-foreground/80 dark:bg-foreground/70 rounded-l-sm" />
              {/* Side button - Power */}
              <div className="absolute -right-[2px] top-28 w-[3px] h-12 bg-foreground/80 dark:bg-foreground/70 rounded-r-sm" />
              
              {/* Phone Screen */}
              <div className="relative bg-background rounded-[2.3rem] overflow-hidden" style={{ aspectRatio: '9/19.5' }}>
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-foreground/95 dark:bg-foreground/90 rounded-full px-4 py-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/30 dark:bg-background/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                </div>
                
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm z-10 flex items-end justify-between px-6 pb-1">
                  <span className="text-[10px] font-medium text-foreground/70">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="flex gap-[2px]">
                      <div className="w-[3px] h-2 bg-foreground/60 rounded-sm" />
                      <div className="w-[3px] h-2.5 bg-foreground/60 rounded-sm" />
                      <div className="w-[3px] h-3 bg-foreground/60 rounded-sm" />
                      <div className="w-[3px] h-3.5 bg-foreground/40 rounded-sm" />
                    </div>
                    <div className="w-5 h-2.5 border border-foreground/50 rounded-sm ml-1 relative">
                      <div className="absolute inset-[1px] bg-primary rounded-[1px]" style={{ width: '70%' }} />
                      <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-foreground/50 rounded-r-sm" />
                    </div>
                  </div>
                </div>
                
                {/* App Content */}
                <div className="absolute inset-0 pt-14 pb-6 px-3 flex flex-col">
                  {/* App Header */}
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-[7px] font-bold text-white">A</span>
                      </div>
                      <div>
                        <p className="text-[8px] font-semibold text-foreground">Aura</p>
                        <p className="text-[6px] text-muted-foreground">Capture Moment</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse-glow" />
                      <span className="text-[7px] font-medium text-primary">Ready</span>
                    </div>
                  </div>
                  
                  {/* Camera Preview Area */}
                  <div className="flex-1 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50 relative overflow-hidden">
                    {capturedImage ? (
                      <>
                        {capturedImage === "captured" ? (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
                            <div className="text-center space-y-2">
                              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-breath">
                                <Image className="w-6 h-6 text-primary/60" />
                              </div>
                              <p className="text-[8px] text-foreground/60 font-light">Captured</p>
                            </div>
                          </div>
                        ) : (
                          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                        )}
                        
                        {/* AI Analysis Overlay */}
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-background/70 backdrop-blur-md flex items-center justify-center">
                            <div className="text-center space-y-3">
                              <div className="relative w-14 h-14 mx-auto">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-lg animate-pulse-glow" />
                                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-breath">
                                  <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" style={{ animationDuration: "2s" }} />
                                  <Sparkles className="absolute w-5 h-5 text-primary animate-pulse" />
                                </div>
                              </div>
                              <p className="text-[9px] font-light text-foreground/70">AI Analyzing...</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Empty Camera State */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="relative w-14 h-14 mx-auto">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl animate-pulse-glow" />
                              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center animate-breath">
                                <Camera className="w-7 h-7 text-primary/70" />
                              </div>
                            </div>
                            <p className="text-[8px] text-foreground/60">Frame the Issue</p>
                          </div>
                        </div>
                        
                        {/* Scan overlay corners */}
                        <div className="absolute inset-2 pointer-events-none">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-xl" />
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/40 rounded-bl-xl" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />
                        </div>
                        
                        {/* Scanning line animation */}
                        <div className="absolute left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-scan" />
                      </>
                    )}
                  </div>
                  
                  {/* Location Badge */}
                  <div className="mt-2 flex items-center gap-2 px-2 py-1.5 rounded-full glass-card mx-auto max-w-[90%]">
                    <MapPin className="w-3 h-3 text-primary/70 flex-shrink-0" />
                    <span className="text-[7px] text-foreground/60 font-light truncate">{address}</span>
                  </div>
                  
                  {/* Bottom Controls */}
                  <div className="mt-2 px-1">
                    {capturedImage ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleRetake}
                          disabled={isAnalyzing}
                          className="flex-1 h-9 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center gap-1 text-foreground/70 disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span className="text-[8px] font-light">Retake</span>
                        </button>
                        <button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="flex-1 h-9 rounded-xl bg-gradient-to-r from-primary/80 to-secondary/80 
                                   text-white flex items-center justify-center gap-1
                                   disabled:opacity-50 shadow-md shadow-primary/20"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span className="text-[8px] font-light">{isAnalyzing ? "Analyzing..." : "Analyze"}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        {/* Gallery */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-10 h-10 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center hover:bg-muted/80 transition-colors"
                        >
                          <Upload className="w-4 h-4 text-foreground/60" />
                        </button>
                        
                        {/* Capture Button */}
                        <button
                          onClick={handleSimulateCapture}
                          className="relative group"
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary to-secondary p-[3px] shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-shadow">
                            <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <div className="w-11 h-11 rounded-full bg-white/90 dark:bg-white/80 group-hover:scale-95 transition-transform" />
                            </div>
                          </div>
                        </button>
                        
                        {/* Placeholder for symmetry */}
                        <div className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-foreground/30 rounded-full" />
              </div>
            </div>
          </div>
          
          {/* Glow effect behind phone */}
          <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl -z-10 animate-breath" />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default CaptureScreen;
