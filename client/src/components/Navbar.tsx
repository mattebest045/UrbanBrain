import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Calendar, Home, LogIn, LogOut, UserPlus, User, Activity, Zap } from 'lucide-react';
import { AuthProvider, useAuth } from '@/hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/weather', label: 'Weather', icon: Cloud },
    { path: '/events', label: 'Events', icon: Calendar },
    // { path: '/profile', label: 'Profile', icon: User },
  ];

  // Items per utenti non autenticati
  const authItems: NavItem[] = [
    { path: '/login', label: 'Login', icon: LogIn },
    { path: '/signup', label: 'Sign Up', icon: UserPlus },
  ];

  // Items per utenti autenticati
  const userItems: NavItem[] = [{ path: '/profile', label: user?.nome || 'Profilo', icon: User }];

  const handleLogout = () => {
    logout();
    // Opzionale: redirect alla home o login
    toast({
      title: 'Logout effettuato',
      description: 'Sei stato disconnesso con successo.',
    });
    navigate('/');
  };

  return (
    <nav className="glass-morphism border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Zap className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 text-primary animate-glow opacity-50" />
            </div>
            <div className="flex flex-col">
              <span className="gradient-text text-xl font-bold">UrbanBrain</span>
              <span className="text-xs text-muted-foreground">v2.0.0</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'text-muted-foreground hover:text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* User Menu */}
                {userItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium hidden sm:block">{item.label}</span>
                    </Link>
                  );
                })}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 bg-destructive hover:bg-destructive/80 text-destructive-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              // Login/Signup per utenti non autenticati
              authItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium hidden sm:block">{item.label}</span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
