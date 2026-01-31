import { BarChart3, Users, CheckCircle, Clock, MapPin, TrendingUp, AlertTriangle, Filter, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminDashboardProps {
  onBack: () => void;
}

const stats = [
  { label: "Total Reports", value: "1,247", change: "+12%", icon: BarChart3, color: "text-primary" },
  { label: "Pending", value: "48", change: "-5%", icon: Clock, color: "text-warning" },
  { label: "In Progress", value: "156", change: "+8%", icon: TrendingUp, color: "text-secondary" },
  { label: "Resolved", value: "1,043", change: "+15%", icon: CheckCircle, color: "text-success" },
];

const recentReports = [
  { id: "CSA-847", location: "MG Road", type: "Garbage", severity: "high", time: "10 min ago" },
  { id: "CSA-846", location: "Koramangala", type: "Debris", severity: "medium", time: "25 min ago" },
  { id: "CSA-845", location: "Indiranagar", type: "Organic", severity: "low", time: "1 hr ago" },
  { id: "CSA-844", location: "Whitefield", type: "Garbage", severity: "high", time: "2 hr ago" },
  { id: "CSA-843", location: "HSR Layout", type: "Debris", severity: "medium", time: "3 hr ago" },
];

const wardPerformance = [
  { ward: "Ward 76", reports: 234, resolved: 218, rate: 93 },
  { ward: "Ward 85", reports: 189, resolved: 172, rate: 91 },
  { ward: "Ward 92", reports: 156, resolved: 138, rate: 88 },
  { ward: "Ward 64", reports: 201, resolved: 165, rate: 82 },
];

export const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>← Back</Button>
            <div>
              <h1 className="font-bold text-lg">Municipal Dashboard</h1>
              <p className="text-xs text-muted-foreground">Bengaluru Urban • Last updated: 2 min ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="civic-card p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change} from last week
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2 civic-card">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Recent Reports</h2>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
            <div className="divide-y divide-border">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    report.severity === 'high' ? 'bg-destructive' :
                    report.severity === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">{report.id}</span>
                      <Badge variant="outline" className="text-xs">{report.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{report.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      report.severity === 'high' ? 'destructive' :
                      report.severity === 'medium' ? 'warning' : 'success'
                    } className="text-xs">
                      {report.severity}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{report.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">Assign</Button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <Button variant="outline" className="w-full">View All Reports</Button>
            </div>
          </div>

          {/* Ward Performance */}
          <div className="civic-card">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Ward Performance</h2>
              <Badge variant="ai" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                This Week
              </Badge>
            </div>
            <div className="p-4 space-y-4">
              {wardPerformance.map((ward) => (
                <div key={ward.ward} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{ward.ward}</span>
                    <span className={ward.rate >= 90 ? 'text-success' : ward.rate >= 85 ? 'text-warning' : 'text-destructive'}>
                      {ward.rate}% resolved
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        ward.rate >= 90 ? 'bg-success' : ward.rate >= 85 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${ward.rate}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ward.resolved} of {ward.reports} reports resolved
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="civic-card p-4 border-l-4 border-warning bg-warning/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold">High Priority Alert</h3>
              <p className="text-sm text-muted-foreground">
                3 high-severity reports in Koramangala area pending for over 48 hours. Immediate attention required.
              </p>
            </div>
            <Button variant="outline" size="sm">Review Now</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
