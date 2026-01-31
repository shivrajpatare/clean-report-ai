import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ImpactSection } from "@/components/ImpactSection";
import { Footer } from "@/components/Footer";
import { CaptureScreen } from "@/components/CaptureScreen";
import { AIAnalysisResult } from "@/components/AIAnalysisResult";
import { ConfirmationScreen } from "@/components/ConfirmationScreen";
import { ReportTracking } from "@/components/ReportTracking";
import { AdminDashboard } from "@/components/AdminDashboard";
import { IssuesMap } from "@/components/IssuesMap";

type Screen = "home" | "capture" | "analysis" | "confirmation" | "tracking" | "admin" | "map";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  const handleStartReport = () => setCurrentScreen("capture");
  const handleCapture = () => setCurrentScreen("analysis");
  const handleSubmit = () => setCurrentScreen("confirmation");
  const handleGoHome = () => setCurrentScreen("home");
  const handleTrackReports = () => setCurrentScreen("tracking");
  const handleAdminDashboard = () => setCurrentScreen("admin");
  const handleMapView = () => setCurrentScreen("map");

  // Render overlay screens
  if (currentScreen === "capture") {
    return <CaptureScreen onCapture={handleCapture} onClose={handleGoHome} />;
  }

  if (currentScreen === "analysis") {
    return <AIAnalysisResult onSubmit={handleSubmit} onBack={() => setCurrentScreen("capture")} />;
  }

  if (currentScreen === "confirmation") {
    return <ConfirmationScreen onGoHome={handleGoHome} onTrackReport={handleTrackReports} />;
  }

  if (currentScreen === "tracking") {
    return <ReportTracking onBack={handleGoHome} />;
  }

  if (currentScreen === "admin") {
    return <AdminDashboard onBack={handleGoHome} />;
  }

  if (currentScreen === "map") {
    return <IssuesMap onBack={handleGoHome} />;
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-background">
      <Navbar onTrackReports={handleTrackReports} onAdminDashboard={handleAdminDashboard} onMapView={handleMapView} />
      <main>
        <HeroSection onStartReport={handleStartReport} />
        <section id="features">
          <FeaturesSection onStartReport={handleStartReport} />
        </section>
        <ImpactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
