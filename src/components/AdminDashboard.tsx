import { BarChart3, Users, CheckCircle, Clock, MapPin, TrendingUp, AlertTriangle, Filter, Download, RefreshCw, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  onBack: () => void;
}

const stats = [
  { label: "Total Ripples", value: "1,247", change: "+12%", icon: BarChart3, gradient: "from-primary/20 to-secondary/20" },
  { label: "Awaiting", value: "48", change: "-5%", icon: Clock, gradient: "from-warning/20 to-orange-500/20" },
  { label: "In Flow", value: "156", change: "+8%", icon: TrendingUp, gradient: "from-secondary/20 to-blue-500/20" },
  { label: "Restored", value: "1,043", change: "+15%", icon: CheckCircle, gradient: "from-success/20 to-emerald-500/20" },
];

const recentReports = [
  { id: "AUR-847", location: "FC Road", type: "Friction", severity: "high", time: "10 min ago" },
  { id: "AUR-846", location: "Koregaon Park", type: "Residue", severity: "medium", time: "25 min ago" },
  { id: "AUR-845", location: "Kothrud", type: "Organic", severity: "low", time: "1 hr ago" },
  { id: "AUR-844", location: "Hinjewadi", type: "Friction", severity: "high", time: "2 hr ago" },
  { id: "AUR-843", location: "Viman Nagar", type: "Residue", severity: "medium", time: "3 hr ago" },
];

const wardPerformance = [
  { ward: "Ward 14", reports: 234, resolved: 218, rate: 93 },
  { ward: "Ward 21", reports: 189, resolved: 172, rate: 91 },
  { ward: "Ward 36", reports: 156, resolved: 138, rate: 88 },
  { ward: "Ward 8", reports: 201, resolved: 165, rate: 82 },
];

export const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-drift" style={{ animationDelay: "-5s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 px-4 pt-4">
        <div className="glass-panel rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="rounded-xl hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-medium text-lg text-foreground/90 tracking-wide">Keeper Dashboard</h1>
                <p className="text-xs text-foreground/50 font-light">Pune Municipal Flow • Updated 2 min ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white/10 text-foreground/60">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white/10 text-foreground/60">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="glass-panel p-5 rounded-2xl group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground/50 font-light">{stat.label}</p>
                  <p className="text-3xl font-light mt-2 text-foreground/90">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-foreground/60" />
                </div>
              </div>
              <p className={`text-sm mt-3 font-light ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change} from last cycle
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-medium text-foreground/80 tracking-wide">Recent Ripples</h2>
              <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white/10 text-foreground/50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="divide-y divide-white/5">
              {recentReports.map((report) => (
                <div key={report.id} className="p-5 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${
                    report.severity === 'high' ? 'bg-destructive animate-pulse' :
                    report.severity === 'medium' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-foreground/50">{report.id}</span>
                      <span className="px-3 py-1 rounded-full glass-card text-xs text-foreground/60">{report.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/40 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="font-light">{report.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-light ${
                      report.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                      report.severity === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                    }`}>
                      {report.severity}
                    </span>
                    <p className="text-xs text-foreground/40 mt-2 font-light">{report.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl hover:bg-white/10 text-foreground/50">
                    Assign
                  </Button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <Button variant="ghost" className="w-full rounded-xl hover:bg-white/10 text-foreground/50 font-light">
                View All Ripples
              </Button>
            </div>
          </div>

          {/* Ward Performance */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-medium text-foreground/80 tracking-wide">Ward Flow</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-xs font-light text-foreground/60">This Cycle</span>
              </div>
            </div>
            <div className="p-5 space-y-5">
              {wardPerformance.map((ward) => (
                <div key={ward.ward} className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-light text-foreground/70">{ward.ward}</span>
                    <span className={`font-light ${ward.rate >= 90 ? 'text-success' : ward.rate >= 85 ? 'text-warning' : 'text-destructive'}`}>
                      {ward.rate}% restored
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        ward.rate >= 90 ? 'bg-gradient-to-r from-success to-emerald-400' : 
                        ward.rate >= 85 ? 'bg-gradient-to-r from-warning to-orange-400' : 
                        'bg-gradient-to-r from-destructive to-red-400'
                      }`}
                      style={{ width: `${ward.rate}%` }}
                    />
                  </div>
                  <p className="text-xs text-foreground/40 font-light">
                    {ward.resolved} of {ward.reports} ripples restored
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-warning bg-gradient-to-r from-warning/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground/80">Priority Flow Alert</h3>
              <p className="text-sm text-foreground/50 font-light mt-1">
                3 high-urgency observations in Koregaon Park awaiting action for over 48 hours. Immediate attention needed.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-xl bg-warning/10 hover:bg-warning/20 text-warning shrink-0">
              Review Now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
