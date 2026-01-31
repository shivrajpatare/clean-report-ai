import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Phone, 
  X, 
  ChevronRight, 
  Locate,
  AlertTriangle,
  CheckCircle,
  Car
} from 'lucide-react';

interface Report {
  id: string;
  location: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  lat: number;
  lng: number;
}

interface NavigationMapProps {
  reports: Report[];
  onClose?: () => void;
}

// Simulated driver/crew location (Bengaluru city center)
const CREW_LOCATION: [number, number] = [12.9716, 77.5946];

// Custom marker icons
const crewIcon = new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
      <circle fill="#3b82f6" cx="20" cy="20" r="18" stroke="white" stroke-width="3"/>
      <path fill="white" d="M20 12 L26 24 L20 21 L14 24 Z"/>
    </svg>
  `)}`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const createDestinationIcon = (severity: string) => {
  const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#22c55e';
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
        <path fill="${color}" stroke="white" stroke-width="2" d="M20 2C11.16 2 4 9.16 4 18c0 11.25 16 30 16 30s16-18.75 16-30c0-8.84-7.16-16-16-16z"/>
        <circle fill="white" cx="20" cy="18" r="8"/>
        <circle fill="${color}" cx="20" cy="18" r="4"/>
      </svg>
    `)}`,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

// Component to fit map bounds when route changes
const MapController = ({ selectedReport, crewLocation }: { selectedReport: Report | null; crewLocation: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedReport) {
      const bounds: LatLngExpression[] = [
        crewLocation,
        [selectedReport.lat, selectedReport.lng]
      ];
      map.fitBounds(bounds as any, { padding: [80, 80] });
    }
  }, [selectedReport, map, crewLocation]);
  
  return null;
};

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Estimate travel time (assuming 25 km/h average speed in city)
const estimateTime = (distanceKm: number): number => {
  return Math.ceil((distanceKm / 25) * 60); // minutes
};

// Generate a simple curved route between two points
const generateRoute = (start: [number, number], end: [number, number]): [number, number][] => {
  const points: [number, number][] = [];
  const steps = 20;
  
  // Add slight curve to make route look more realistic
  const midLat = (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 0.01;
  const midLng = (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 0.01;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier curve
    const lat = (1-t)*(1-t)*start[0] + 2*(1-t)*t*midLat + t*t*end[0];
    const lng = (1-t)*(1-t)*start[1] + 2*(1-t)*t*midLng + t*t*end[1];
    points.push([lat, lng]);
  }
  
  return points;
};

export const NavigationMap = ({ reports, onClose }: NavigationMapProps) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [crewLocation] = useState<[number, number]>(CREW_LOCATION);
  
  const distance = selectedReport 
    ? calculateDistance(crewLocation[0], crewLocation[1], selectedReport.lat, selectedReport.lng)
    : 0;
  const estimatedMinutes = estimateTime(distance);
  
  const route = selectedReport 
    ? generateRoute(crewLocation, [selectedReport.lat, selectedReport.lng])
    : [];

  const handleStartNavigation = () => {
    if (selectedReport) {
      setIsNavigating(true);
      // Open Google Maps for actual navigation
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${crewLocation[0]},${crewLocation[1]}&destination=${selectedReport.lat},${selectedReport.lng}&travelmode=driving`,
        '_blank'
      );
    }
  };

  const handleMarkComplete = () => {
    setSelectedReport(null);
    setIsNavigating(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-background">
      {/* Left Panel - Report List */}
      <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card overflow-auto">
        <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">Cleanup Tasks</h2>
              <p className="text-sm text-muted-foreground">{reports.length} pending reports</p>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`w-full p-4 text-left transition-colors hover:bg-muted/50 ${
                selectedReport?.id === report.id ? 'bg-primary/10 border-l-4 border-primary' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${
                  report.severity === 'high' ? 'bg-destructive animate-pulse' :
                  report.severity === 'medium' ? 'bg-warning' : 'bg-success'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{report.id}</span>
                    <Badge 
                      variant={
                        report.severity === 'high' ? 'destructive' :
                        report.severity === 'medium' ? 'warning' : 'success'
                      }
                      className="text-xs"
                    >
                      {report.severity}
                    </Badge>
                  </div>
                  <p className="font-medium truncate">{report.location}</p>
                  <p className="text-sm text-muted-foreground">{report.type} waste</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{report.time}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Map & Navigation */}
      <div className="flex-1 flex flex-col relative">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={crewLocation}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Crew/Driver marker */}
            <Marker position={crewLocation} icon={crewIcon}>
              <Popup>
                <div className="p-2">
                  <p className="font-semibold">Your Location</p>
                  <p className="text-sm text-muted-foreground">Cleanup Crew</p>
                </div>
              </Popup>
            </Marker>
            
            {/* Route line */}
            {selectedReport && route.length > 0 && (
              <Polyline
                positions={route}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 5,
                  opacity: 0.8,
                  dashArray: isNavigating ? undefined : '10, 10',
                }}
              />
            )}
            
            {/* Report markers */}
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.lat, report.lng]}
                icon={createDestinationIcon(report.severity)}
                eventHandlers={{
                  click: () => setSelectedReport(report),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[180px]">
                    <p className="font-mono text-xs text-muted-foreground">{report.id}</p>
                    <p className="font-semibold">{report.location}</p>
                    <p className="text-sm text-muted-foreground">{report.type} waste</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <MapController selectedReport={selectedReport} crewLocation={crewLocation} />
          </MapContainer>
          
          {/* Floating locate button */}
          <Button
            size="icon"
            className="absolute bottom-4 right-4 z-[1000] shadow-lg"
            variant="secondary"
          >
            <Locate className="w-5 h-5" />
          </Button>
        </div>

        {/* Bottom Navigation Card - Uber/Ola style */}
        {selectedReport && (
          <div className="bg-card border-t border-border p-4 space-y-4 animate-in slide-in-from-bottom duration-300">
            {/* Distance & Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{distance.toFixed(1)} km</p>
                  <p className="text-muted-foreground">~{estimatedMinutes} min away</p>
                </div>
              </div>
              <Badge 
                variant={
                  selectedReport.severity === 'high' ? 'destructive' :
                  selectedReport.severity === 'medium' ? 'warning' : 'success'
                }
                className="text-sm px-3 py-1"
              >
                {selectedReport.severity === 'high' && <AlertTriangle className="w-4 h-4 mr-1" />}
                {selectedReport.severity} priority
              </Badge>
            </div>
            
            {/* Destination Info */}
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{selectedReport.location}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedReport.type} waste • Reported {selectedReport.time}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isNavigating ? (
                <>
                  <Button 
                    className="flex-1 h-14 text-lg font-semibold"
                    onClick={handleStartNavigation}
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Start Navigation
                  </Button>
                  <Button variant="outline" size="icon" className="h-14 w-14">
                    <Phone className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    className="flex-1 h-14"
                    onClick={() => setIsNavigating(false)}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 h-14 text-lg font-semibold bg-success hover:bg-success/90"
                    onClick={handleMarkComplete}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Mark Complete
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!selectedReport && (
          <div className="bg-card border-t border-border p-6 text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">Select a cleanup task</p>
            <p className="text-sm text-muted-foreground">
              Choose a report from the list to see route and navigation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationMap;
