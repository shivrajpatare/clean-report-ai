import { useState, useEffect } from "react";
import { Menu, X, Map, User, LayoutDashboard, Compass, Sparkles } from "lucide-react";

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
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <div
        className={`transition-all duration-500 ease-out ${
          isScrolled
            ? "w-full max-w-4xl bg-white/70 backdrop-blur-2xl border border-white/50 shadow-soft rounded-2xl px-6"
            : "bg-foreground/80 backdrop-blur-2xl border border-white/10 shadow-lg rounded-full px-4"
        }`}
      >
        <div className={`flex items-center justify-center gap-1 transition-all duration-500 ${
          isScrolled ? "h-14" : "h-12"
        }`}>
          {/* Collapsed dock mode - icons only */}
          {!isScrolled ? (
            <>
              {/* Logo */}
              <DockIcon onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="Home">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/90" />
                </div>
              </DockIcon>
              
              <div className="w-px h-6 bg-white/20 mx-1" />
              
              <DockIcon href="#pulse" label="How it Works">
                <Compass className="w-5 h-5 text-white/80" />
              </DockIcon>
              
              <DockIcon href="#impact" label="Impact">
                <Sparkles className="w-5 h-5 text-white/80" />
              </DockIcon>
              
              <div className="w-px h-6 bg-white/20 mx-1" />
              
              <DockIcon onClick={onMapView} label="Live Map">
                <Map className="w-5 h-5 text-white/80" />
              </DockIcon>
              
              <DockIcon onClick={onTrackReports} label="Track">
                <User className="w-5 h-5 text-white/80" />
              </DockIcon>
              
              <DockIcon onClick={onAdminDashboard} label="Admin">
                <LayoutDashboard className="w-5 h-5 text-white/80" />
              </DockIcon>
            </>
          ) : (
            /* Expanded mode - full navigation */
            <div className="flex items-center justify-between w-full">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-80" />
                  <div className="absolute inset-1 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-secondary animate-breath" />
                  </div>
                </div>
                <span className="text-lg font-medium tracking-wide text-foreground/90">
                  Aura
                </span>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <NavLink href="#pulse">How it Works</NavLink>
                <NavLink href="#impact">Impact</NavLink>
                <button
                  onClick={onMapView}
                  className="text-muted-foreground hover:text-foreground font-light transition-colors duration-300 flex items-center gap-1.5"
                >
                  <Map className="w-4 h-4" />
                  Map
                </button>
                <button
                  onClick={onTrackReports}
                  className="text-muted-foreground hover:text-foreground font-light transition-colors duration-300 flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  Track
                </button>
                <button
                  onClick={onAdminDashboard}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 
                           text-foreground/80 font-medium transition-all duration-300
                           hover:from-primary/20 hover:to-secondary/20 flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground/80" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground/80" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu - only in expanded mode */}
        {isScrolled && isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-muted/30 pt-4">
            <MobileNavLink href="#pulse" onClick={() => setIsMobileMenuOpen(false)}>
              How it Works
            </MobileNavLink>
            <MobileNavLink href="#impact" onClick={() => setIsMobileMenuOpen(false)}>
              Impact
            </MobileNavLink>
            <button
              onClick={() => { onMapView(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full py-2 text-foreground/80 font-light"
            >
              <Map className="w-4 h-4" /> Live Map
            </button>
            <button
              onClick={() => { onTrackReports(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full py-2 text-foreground/80 font-light"
            >
              <User className="w-4 h-4" /> Track Reports
            </button>
            <button
              onClick={() => { onAdminDashboard(); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 
                       text-foreground/80 font-medium justify-center mt-2"
            >
              <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

/* Dock Icon Component */
const DockIcon = ({ 
  children, 
  onClick, 
  href, 
  label 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  href?: string;
  label: string;
}) => {
  const baseClasses = "group relative p-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-110";
  
  const content = (
    <>
      {children}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium 
                       bg-foreground/90 text-white rounded-md opacity-0 group-hover:opacity-100 
                       transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </>
  );

  if (href) {
    return <a href={href} className={baseClasses}>{content}</a>;
  }
  
  return <button onClick={onClick} className={baseClasses}>{content}</button>;
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
    className="block py-2 text-foreground/80 font-light"
  >
    {children}
  </a>
);

export default AuraNavbar;
