import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { ArrowLeft, MapPin, AlertCircle, Clock, CheckCircle, Truck, Filter, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface IssuesMapProps {
  onBack: () => void;
}

// Fix for default marker icons in Leaflet with Vite
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

// Mock data - Bengaluru area reports
const mockReports = [
  {
    id: "CSA-2024-00847",
    location: "MG Road, Ward 76",
    type: "Street Garbage",
    status: "pending",
    date: "Today, 10:30 AM",
    lat: 12.9758,
    lng: 77.6045,
    severity: "high",
  },
  {
    id: "CSA-2024-00832",
    location: "Koramangala 5th Block",
    type: "Construction Debris",
    status: "progress",
    date: "Yesterday",
    lat: 12.9352,
    lng: 77.6245,
    severity: "medium",
  },
  {
    id: "CSA-2024-00798",
    location: "Indiranagar 100ft Road",
    type: "Organic Waste",
    status: "resolved",
    date: "2 days ago",
    lat: 12.9784,
    lng: 77.6408,
    severity: "low",
  },
  {
    id: "CSA-2024-00815",
    location: "HSR Layout Sector 2",
    type: "Street Garbage",
    status: "pending",
    date: "Today, 8:15 AM",
    lat: 12.9116,
    lng: 77.6389,
    severity: "high",
  },
  {
    id: "CSA-2024-00820",
    location: "Whitefield Main Road",
    type: "Construction Debris",
    status: "progress",
    date: "Yesterday",
    lat: 12.9698,
    lng: 77.7500,
    severity: "medium",
  },
  {
    id: "CSA-2024-00788",
    location: "Jayanagar 4th Block",
    type: "Organic Waste",
    status: "resolved",
    date: "3 days ago",
    lat: 12.9299,
    lng: 77.5826,
    severity: "low",
  },
  {
    id: "CSA-2024-00795",
    location: "BTM Layout 2nd Stage",
    type: "Street Garbage",
    status: "pending",
    date: "Today, 9:00 AM",
    lat: 12.9166,
    lng: 77.6101,
    severity: "high",
  },
  {
    id: "CSA-2024-00810",
    location: "Electronic City Phase 1",
    type: "Construction Debris",
    status: "progress",
    date: "2 days ago",
    lat: 12.8456,
    lng: 77.6603,
    severity: "medium",
  },
  {
    id: "CSA-2024-00778",
    location: "Marathahalli Bridge",
    type: "Street Garbage",
    status: "resolved",
    date: "4 days ago",
    lat: 12.9591,
    lng: 77.6974,
    severity: "high",
  },
  {
    id: "CSA-2024-00825",
    location: "Banashankari 3rd Stage",
    type: "Organic Waste",
    status: "pending",
    date: "Today, 7:45 AM",
    lat: 12.9255,
    lng: 77.5468,
    severity: "low",
  },
  {
    id: "CSA-2024-00830",
    location: "Yelahanka New Town",
    type: "Construction Debris",
    status: "progress",
    date: "Yesterday",
    lat: 13.1007,
    lng: 77.5963,
    severity: "medium",
  },
  {
    id: "CSA-2024-00785",
    location: "Rajajinagar 1st Block",
    type: "Street Garbage",
    status: "resolved",
    date: "5 days ago",
    lat: 12.9900,
    lng: 77.5500,
    severity: "high",
  },
];

type StatusFilter = "all" | "pending" | "progress" | "resolved";

export const IssuesMap = ({ onBack }: IssuesMapProps) => {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

  const filteredReports = filter === "all" 
    ? mockReports 
    : mockReports.filter(r => r.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="pending">Pending</Badge>;
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
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "progress":
        return <Truck className="w-4 h-4 text-secondary" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const statusCounts = {
    all: mockReports.length,
    pending: mockReports.filter(r => r.status === "pending").length,
    progress: mockReports.filter(r => r.status === "progress").length,
    resolved: mockReports.filter(r => r.status === "resolved").length,
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-background/95 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">Issues Map</h2>
          <p className="text-sm text-muted-foreground">{filteredReports.length} reports in Bengaluru</p>
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
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              let size = "small";
              if (count > 10) size = "medium";
              if (count > 25) size = "large";
              
              const sizeMap = { small: 40, medium: 50, large: 60 };
              const dimension = sizeMap[size as keyof typeof sizeMap];
              
              return L.divIcon({
                html: `<div style="
                  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)));
                  width: ${dimension}px;
                  height: ${dimension}px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: ${dimension / 3}px;
                  border: 3px solid white;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                ">${count}</div>`,
                className: "custom-cluster-icon",
                iconSize: L.point(dimension, dimension),
              });
            }}
          >
            {filteredReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.lat, report.lng]}
                icon={statusIcons[report.status as keyof typeof statusIcons]}
                eventHandlers={{
                  click: () => setSelectedReport(report),
                }}
              >
                <Popup>
                  <div className="min-w-[200px] p-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono text-xs text-muted-foreground">{report.id}</span>
                      {getStatusBadge(report.status)}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{report.type}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {report.location}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{report.date}</span>
                      <Badge 
                        variant={report.severity === "high" ? "destructive" : report.severity === "medium" ? "warning" : "outline"}
                        className="text-[10px] px-1.5"
                      >
                        {report.severity}
                      </Badge>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>

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
