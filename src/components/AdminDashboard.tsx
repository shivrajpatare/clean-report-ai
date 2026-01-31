import { useState, useEffect } from "react";
import { BarChart3, Users, CheckCircle, Clock, MapPin, TrendingUp, AlertTriangle, Filter, Download, RefreshCw, ArrowLeft, Sparkles, Flame, Droplets, LogIn, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface AdminDashboardProps {
  onBack: () => void;
}

interface Report {
  id: string;
  category: string;
  priority: string;
  status: string;
  address: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

const categoryLabels: Record<string, string> = {
  garbage_dump: "Garbage Dump",
  dustbin_not_cleaned: "Dustbin",
  burning_garbage: "Burning",
  open_manhole: "Manhole",
  stagnant_water: "Stagnant Water",
  dead_animal: "Dead Animal",
  sewage_overflow: "Sewage",
  sweeping_not_done: "Sweeping",
  other: "Other",
};

const priorityEmoji: Record<string, string> = {
  low: "🟡",
  medium: "🟠",
  high: "🔴",
  critical: "🚨",
};

export const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Check authentication and admin role
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          // Check if user has admin role
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();
          setIsAdmin(!!roles);
        } else {
          setIsAdmin(false);
        }
        setAuthLoading(false);
      });

      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .single();
        setIsAdmin(!!roles);
      }
      setAuthLoading(false);

      return () => subscription.unsubscribe();
    };
    checkAuth();
  }, []);

  const handleSignIn = async () => {
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const fetchData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      // Use public_reports view for reading (excludes PII)
      const { data: reportsData, error } = await supabase
        .from('public_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const allReports = (reportsData || []) as Report[];
      setReports(allReports.slice(0, 10)); // Recent 10 for display

      // Calculate stats
      const newStats = {
        total: allReports.length,
        pending: allReports.filter(r => r.status === 'pending').length,
        inProgress: allReports.filter(r => r.status === 'in_progress').length,
        resolved: allReports.filter(r => r.status === 'resolved').length,
      };
      setStats(newStats);

      // Calculate category breakdown
      const catStats: Record<string, number> = {};
      allReports.forEach(r => {
        catStats[r.category] = (catStats[r.category] || 0) + 1;
      });
      setCategoryStats(catStats);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Could not load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', reportId);

      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Report marked as ${newStatus.replace('_', ' ')}`,
      });
      
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const statsConfig = [
    { label: "Total Reports", value: stats.total, icon: BarChart3, gradient: "from-primary/20 to-secondary/20" },
    { label: "Pending", value: stats.pending, icon: Clock, gradient: "from-warning/20 to-orange-500/20" },
    { label: "In Progress", value: stats.inProgress, icon: TrendingUp, gradient: "from-secondary/20 to-blue-500/20" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle, gradient: "from-success/20 to-emerald-500/20" },
  ];

  const criticalReports = reports.filter(r => r.priority === 'critical' || r.priority === 'high');

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-secondary/10 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  // Show login form if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-secondary/10">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-drift" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-drift" style={{ animationDelay: "-5s" }} />
        </div>
        
        <header className="sticky top-0 z-10 px-4 pt-4">
          <div className="glass-panel rounded-2xl px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="rounded-xl hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-medium text-lg text-foreground/90 tracking-wide">Admin Access</h1>
                <p className="text-xs text-foreground/50 font-light">Authentication Required</p>
              </div>
            </div>
          </div>
        </header>

        <main className="relative px-4 py-12 flex items-center justify-center">
          <div className="glass-panel rounded-2xl p-8 max-w-md w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-medium text-foreground/90">Admin Login</h2>
              <p className="text-sm text-foreground/50 font-light">
                {user ? "You don't have admin privileges" : "Sign in to access the dashboard"}
              </p>
            </div>

            {user ? (
              <div className="space-y-4">
                <p className="text-center text-sm text-foreground/60">
                  Signed in as: {user.email}
                </p>
                <Button onClick={handleSignOut} variant="outline" className="w-full rounded-xl">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                    className="rounded-xl"
                  />
                </div>
                {authError && (
                  <p className="text-sm text-destructive text-center">{authError}</p>
                )}
                <Button onClick={handleSignIn} className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

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
                <h1 className="font-medium text-lg text-foreground/90 tracking-wide">Admin Dashboard</h1>
                <p className="text-xs text-foreground/50 font-light">Signed in as {user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl hover:bg-white/10 text-foreground/60"
                onClick={fetchData}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-xl hover:bg-white/10 text-foreground/60"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsConfig.map((stat, index) => (
            <div key={index} className="glass-panel p-5 rounded-2xl group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground/50 font-light">{stat.label}</p>
                  <p className="text-3xl font-light mt-2 text-foreground/90">
                    {loading ? '-' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-foreground/60" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-medium text-foreground/80 tracking-wide">Recent Reports</h2>
            </div>
            <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="p-10 flex justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                </div>
              ) : reports.length === 0 ? (
                <div className="p-10 text-center text-foreground/50">No reports yet</div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="p-5 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${
                      report.priority === 'critical' || report.priority === 'high' ? 'bg-destructive animate-pulse' :
                      report.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg">{priorityEmoji[report.priority] || '🟡'}</span>
                        <span className="px-3 py-1 rounded-full glass-card text-xs text-foreground/60">
                          {categoryLabels[report.category] || report.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/40 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span className="font-light truncate">{report.address}</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-light ${
                        report.status === 'resolved' ? 'bg-success/10 text-success' :
                        report.status === 'in_progress' ? 'bg-secondary/10 text-secondary' : 
                        'bg-warning/10 text-warning'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-foreground/40 font-light">{formatDate(report.created_at)}</p>
                    </div>
                    {report.status === 'pending' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl hover:bg-primary/10 text-primary"
                        onClick={() => handleUpdateStatus(report.id, 'in_progress')}
                      >
                        Assign
                      </Button>
                    )}
                    {report.status === 'in_progress' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-xl hover:bg-success/10 text-success"
                        onClick={() => handleUpdateStatus(report.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-medium text-foreground/80 tracking-wide">By Category</h2>
            </div>
            <div className="p-5 space-y-4">
              {Object.entries(categoryStats).length === 0 ? (
                <p className="text-foreground/50 text-sm text-center py-4">No data</p>
              ) : (
                Object.entries(categoryStats)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([category, count]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-light text-foreground/70">
                          {categoryLabels[category] || category}
                        </span>
                        <span className="font-light text-foreground/50">{count}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${Math.min(100, (count / stats.total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {criticalReports.length > 0 && (
          <div className="glass-panel p-5 rounded-2xl border-l-4 border-destructive bg-gradient-to-r from-destructive/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground/80">High Priority Alerts</h3>
                <p className="text-sm text-foreground/50 font-light mt-1">
                  {criticalReports.length} critical/high priority report{criticalReports.length > 1 ? 's' : ''} requiring immediate attention
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
