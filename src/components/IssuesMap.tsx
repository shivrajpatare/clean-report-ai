import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Filter, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

interface IssuesMapProps {
  onBack: () => void;
}

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const statusIcons = {
  pending: createCustomIcon("hsl(38, 92%, 50%)"),
  progress: createCustomIcon("hsl(199, 89%, 48%)"),
  resolved: createCustomIcon("hsl(142, 71%, 45%)"),
};

// Mock data - Pune area reports
const mockReports = [
  { id: "CSA-2024-00847", location: "FC Road, Shivajinagar", type: "Street Garbage", status: "pending", date: "Today, 10:30 AM", lat: 18.5285, lng: 73.8410, severity: "high" },
  { id: "CSA-2024-00832", location: "Koregaon Park", type: "Construction Debris", status: "progress", date: "Yesterday", lat: 18.5362, lng: 73.8939, severity: "medium" },
  { id: "CSA-2024-00798", location: "Kothrud, Paud Road", type: "Organic Waste", status: "resolved", date: "2 days ago", lat: 18.5074, lng: 73.8077, severity: "low" },
  { id: "CSA-2024-00815", location: "Viman Nagar", type: "Street Garbage", status: "pending", date: "Today, 8:15 AM", lat: 18.5679, lng: 73.9143, severity: "high" },
  { id: "CSA-2024-00820", location: "Hinjewadi Phase 1", type: "Construction Debris", status: "progress", date: "Yesterday", lat: 18.5912, lng: 73.7380, severity: "medium" },
  { id: "CSA-2024-00788", location: "Aundh, ITI Road", type: "Organic Waste", status: "resolved", date: "3 days ago", lat: 18.5590, lng: 73.8077, severity: "low" },
  { id: "CSA-2024-00795", location: "Hadapsar, Magarpatta", type: "Street Garbage", status: "pending", date: "Today, 9:00 AM", lat: 18.5089, lng: 73.9260, severity: "high" },
  { id: "CSA-2024-00810", location: "Baner Road", type: "Construction Debris", status: "progress", date: "2 days ago", lat: 18.5590, lng: 73.7868, severity: "medium" },
  { id: "CSA-2024-00778", location: "Kalyani Nagar", type: "Street Garbage", status: "resolved", date: "4 days ago", lat: 18.5463, lng: 73.9020, severity: "high" },
  { id: "CSA-2024-00825", location: "Sinhagad Road", type: "Organic Waste", status: "pending", date: "Today, 7:45 AM", lat: 18.4818, lng: 73.8223, severity: "low" },
  { id: "CSA-2024-00830", location: "Wakad", type: "Construction Debris", status: "progress", date: "Yesterday", lat: 18.5998, lng: 73.7603, severity: "medium" },
  { id: "CSA-2024-00785", location: "Camp, MG Road", type: "Street Garbage", status: "resolved", date: "5 days ago", lat: 18.5167, lng: 73.8803, severity: "high" },
];

type StatusFilter = "all" | "pending" | "progress" | "resolved";

export const IssuesMap = ({ onBack }: IssuesMapProps) => {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  const filteredReports = filter === "all" 
    ? mockReports 
    : mockReports.filter(r => r.status === filter);

  const statusCounts = {
    all: mockReports.length,
    pending: mockReports.filter(r => r.status === "pending").length,
    progress: mockReports.filter(r => r.status === "progress").length,
    resolved: mockReports.filter(r => r.status === "resolved").length,
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([18.5204, 73.8567], 12);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when filter changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing cluster group
    if (clusterGroupRef.current) {
      mapRef.current.removeLayer(clusterGroupRef.current);
    }

    // Create new cluster group
    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = 40;
        if (count > 10) size = 50;
        if (count > 25) size = 60;
        
        return L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, hsl(160, 84%, 39%), hsl(199, 89%, 48%));
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size / 3}px;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          ">${count}</div>`,
          className: "custom-cluster-icon",
          iconSize: L.point(size, size),
        });
      },
    });

    filteredReports.forEach((report) => {
      const marker = L.marker([report.lat, report.lng], {
        icon: statusIcons[report.status as keyof typeof statusIcons],
      });
      
      const popupContent = `
        <div style="min-width: 180px; padding: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-family: monospace; font-size: 11px; color: #666;">${report.id}</span>
            <span style="
              background: ${report.status === 'pending' ? '#f59e0b' : report.status === 'progress' ? '#0ea5e9' : '#22c55e'};
              color: white;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 500;
            ">${report.status === 'progress' ? 'In Progress' : report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span>
          </div>
          <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${report.type}</h3>
          <div style="display: flex; align-items: center; gap: 4px; color: #666; font-size: 12px; margin-bottom: 8px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${report.location}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <span style="color: #666;">${report.date}</span>
            <span style="
              background: ${report.severity === 'high' ? '#ef4444' : report.severity === 'medium' ? '#f59e0b' : '#22c55e'}20;
              color: ${report.severity === 'high' ? '#ef4444' : report.severity === 'medium' ? '#f59e0b' : '#22c55e'};
              padding: 2px 6px;
              border-radius: 4px;
              font-weight: 500;
            ">${report.severity}</span>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markers.addLayer(marker);
    });

    mapRef.current.addLayer(markers);
    clusterGroupRef.current = markers;

  }, [filteredReports]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">Issues Map</h2>
          <p className="text-sm text-muted-foreground">{filteredReports.length} reports in Pune</p>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 p-3 bg-muted/30 border-b border-border overflow-x-auto">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        {(["all", "pending", "progress", "resolved"] as StatusFilter[]).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className="shrink-0"
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1 text-xs opacity-70">({statusCounts[status]})</span>
          </Button>
        ))}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border z-[1000]">
          <h4 className="text-xs font-semibold mb-2">Legend</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span>Resolved</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border z-[1000]">
          <h4 className="text-xs font-semibold mb-2">Overview</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-bold text-lg text-warning">{statusCounts.pending}</div>
              <div className="text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="font-bold text-lg text-secondary">{statusCounts.progress}</div>
              <div className="text-muted-foreground">In Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesMap;
