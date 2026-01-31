import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation, Clock } from 'lucide-react';

interface Report {
  id: string;
  location: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  lat: number;
  lng: number;
}

interface ReportsMapProps {
  reports: Report[];
}

// Custom marker icons based on severity
const createIcon = (severity: string) => {
  const color = severity === 'high' ? '#ef4444' : severity === 'medium' ? '#f59e0b' : '#22c55e';
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle fill="white" cx="12" cy="9" r="3"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export const ReportsMap = ({ reports }: ReportsMapProps) => {
  // Center on Bengaluru
  const center: [number, number] = [12.9716, 77.5946];

  const handleNavigate = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="h-[400px] rounded-xl overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={createIcon(report.severity)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-muted-foreground">{report.id}</span>
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
                <h4 className="font-semibold text-foreground">{report.location}</h4>
                <p className="text-sm text-muted-foreground mt-1">{report.type} waste</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Clock className="w-3 h-3" />
                  <span>{report.time}</span>
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => handleNavigate(report.lat, report.lng)}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ReportsMap;
