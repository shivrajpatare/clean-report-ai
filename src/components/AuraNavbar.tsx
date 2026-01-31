import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface AuraNavbarProps {
  onTrackReports: () => void;
  onAdminDashboard: () => void;
  onMapView: () => void;
}

export const AuraNavbar = ({ onTrackReports, onAdminDashboard, onMapView }: AuraNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-2xl border-b border-white/50 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-80" />
              <div className="absolute inset-1 rounded-full bg-white/90 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-secondary animate-breath" />
              </div>
            </div>
            <span className="text-xl font-medium tracking-wide text-foreground/90">
              Aura
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#pulse">How it Works</NavLink>
            <NavLink href="#impact">Impact</NavLink>
            <button
              onClick={onMapView}
              className="text-muted-foreground hover:text-foreground font-light transition-colors duration-300"
            >
              Live Map
            </button>
            <button
              onClick={onTrackReports}
              className="text-muted-foreground hover:text-foreground font-light transition-colors duration-300"
            >
              Track
            </button>
            <button
              onClick={onAdminDashboard}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 
                       text-foreground/80 font-medium transition-all duration-300
                       hover:from-primary/20 hover:to-secondary/20"
            >
              Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground/80" />
            ) : (
              <Menu className="w-6 h-6 text-foreground/80" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-2xl border-b border-white/50 shadow-soft">
            <div className="container py-6 space-y-4">
              <MobileNavLink href="#pulse" onClick={() => setIsMobileMenuOpen(false)}>
                How it Works
              </MobileNavLink>
              <MobileNavLink href="#impact" onClick={() => setIsMobileMenuOpen(false)}>
                Impact
              </MobileNavLink>
              <button
                onClick={() => {
                  onMapView();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 text-foreground/80 font-light"
              >
                Live Map
              </button>
              <button
                onClick={() => {
                  onTrackReports();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 text-foreground/80 font-light"
              >
                Track Reports
              </button>
              <button
                onClick={() => {
                  onAdminDashboard();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 
                         text-foreground/80 font-medium text-center"
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-muted-foreground hover:text-foreground font-light transition-colors duration-300 relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
  </a>
);

const MobileNavLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    onClick={onClick}
    className="block py-3 text-foreground/80 font-light border-b border-muted/50"
  >
    {children}
  </a>
);

export default AuraNavbar;
