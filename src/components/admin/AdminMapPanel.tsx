import { useEffect, useRef } from "react";
import { MapPin, AlertTriangle, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

export interface MapReport {
  id: string;
  category: string;
  priority: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
  before_image_url?: string;
  ai_description?: string;
}

interface AdminMapPanelProps {
  reports: MapReport[];
  selectedReportId: string | null;
  onSelectReport: (report: MapReport) => void;
  showHighPriorityOnly: boolean;
  onToggleHighPriority: (value: boolean) => void;
}

// Custom marker icons with priority-based colors
const createPriorityIcon = (priority: string) => {
  const colors = {
    critical: { bg: "hsl(0, 84%, 60%)", glow: "hsl(0, 84%, 50%)" },
    high: { bg: "hsl(0, 84%, 60%)", glow: "hsl(0, 84%, 50%)" },
    medium: { bg: "hsl(38, 92%, 50%)", glow: "hsl(25, 95%, 53%)" },
    low: { bg: "hsl(48, 96%, 53%)", glow: "hsl(45, 93%, 47%)" },
  };

  const color = colors[priority as keyof typeof colors] || colors.low;

  return L.divIcon({
    className: "custom-admin-marker",
    html: `<div style="
      background: linear-gradient(135deg, ${color.bg}, ${color.glow});
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.95);
      box-shadow: 0 4px 20px ${color.bg}60, 0 0 30px ${color.bg}30;
      cursor: pointer;
      transition: transform 0.2s ease;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const selectedIcon = L.divIcon({
  className: "custom-admin-marker-selected",
  html: `<div style="
    background: linear-gradient(135deg, hsl(152, 76%, 36%), hsl(199, 89%, 48%));
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 4px solid white;
    box-shadow: 0 4px 30px hsl(152, 76%, 36%, 0.6), 0 0 50px hsl(152, 76%, 36%, 0.4);
    animation: pulse-selected 1.5s ease-in-out infinite;
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export const AdminMapPanel = ({
  reports,
  selectedReportId,
  onSelectReport,
  showHighPriorityOnly,
  onToggleHighPriority,
}: AdminMapPanelProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  const activeReports = reports.filter(r => r.status !== 'resolved');
  const displayReports = showHighPriorityOnly 
    ? activeReports.filter(r => r.priority === 'high' || r.priority === 'critical')
    : activeReports;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([18.5204, 73.8567], 12);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Use dark mode tile layer for control room feel
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when reports or filter changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    if (markersRef.current) {
      mapRef.current.removeLayer(markersRef.current);
    }
    markerMapRef.current.clear();

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count > 20 ? 56 : count > 10 ? 48 : 40;

        return L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, hsl(0, 0%, 20%), hsl(0, 0%, 30%));
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 500;
            font-size: ${size / 2.8}px;
            border: 3px solid rgba(255,255,255,0.3);
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            font-family: 'Plus Jakarta Sans', sans-serif;
          ">${count}</div>`,
          className: "custom-cluster-admin",
          iconSize: L.point(size, size),
        });
      },
    });

    displayReports.forEach((report) => {
      if (!report.latitude || !report.longitude) return;

      const isSelected = report.id === selectedReportId;
      const marker = L.marker([report.latitude, report.longitude], {
        icon: isSelected ? selectedIcon : createPriorityIcon(report.priority),
      });

      marker.on('click', () => onSelectReport(report));
      clusterGroup.addLayer(marker);
      markerMapRef.current.set(report.id, marker);
    });

    mapRef.current.addLayer(clusterGroup);
    markersRef.current = clusterGroup;
  }, [displayReports, selectedReportId, onSelectReport]);

  // Zoom to selected report
  useEffect(() => {
    if (!mapRef.current || !selectedReportId) return;

    const selectedReport = reports.find(r => r.id === selectedReportId);
    if (selectedReport?.latitude && selectedReport?.longitude) {
      mapRef.current.flyTo([selectedReport.latitude, selectedReport.longitude], 16, {
        duration: 0.8,
      });

      // Update marker icon to selected state
      const marker = markerMapRef.current.get(selectedReportId);
      if (marker) {
        marker.setIcon(selectedIcon);
      }
    }
  }, [selectedReportId, reports]);

  return (
    <div className="h-full flex flex-col glass-panel rounded-2xl overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground/90 tracking-wide">Live City Issue Map</h3>
            <p className="text-xs text-foreground/50 font-light">{displayReports.length} active issues</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
            <Sparkles className="w-3 h-3 text-success animate-pulse" />
            <span className="text-xs font-light text-foreground/60">Live</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 glass-panel rounded-xl p-3 z-[1000]">
          <h4 className="text-xs font-medium text-foreground/60 mb-2">Priority</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-destructive shadow-lg shadow-destructive/30" />
              <span className="text-foreground/60 font-light">High/Critical</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-warning shadow-lg shadow-warning/30" />
              <span className="text-foreground/60 font-light">Medium</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/30" />
              <span className="text-foreground/60 font-light">Low</span>
            </div>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="absolute top-4 right-4 glass-panel rounded-xl p-3 z-[1000]">
          <div className="flex items-center gap-2">
            <Switch
              id="high-priority-filter"
              checked={showHighPriorityOnly}
              onCheckedChange={onToggleHighPriority}
            />
            <Label htmlFor="high-priority-filter" className="text-xs text-foreground/60 font-light cursor-pointer">
              High Priority Only
            </Label>
          </div>
        </div>

        {/* Active Issues Counter */}
        <div className="absolute bottom-4 left-4 glass-panel rounded-xl px-4 py-2 z-[1000]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-foreground/80">
              {activeReports.filter(r => r.priority === 'high' || r.priority === 'critical').length}
            </span>
            <span className="text-xs text-foreground/50 font-light">critical issues</span>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style>{`
        @keyframes pulse-selected {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 30px hsl(152, 76%, 36%, 0.6); }
          50% { transform: scale(1.1); box-shadow: 0 4px 40px hsl(152, 76%, 36%, 0.8); }
        }
        .leaflet-container {
          background: hsl(222, 47%, 11%);
        }
      `}</style>
    </div>
  );
};

export default AdminMapPanel;
