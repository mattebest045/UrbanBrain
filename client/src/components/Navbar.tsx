
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Calendar, Home, LogIn, UserPlus, User, Activity, Zap } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/weather', label: 'Weather', icon: Cloud },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const authItems = [
    { path: '/login', label: 'Login', icon: LogIn },
    { path: '/signup', label: 'Sign Up', icon: UserPlus },
  ];

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

          {/* Auth Links */}
          <div className="flex items-center space-x-2">
            {authItems.map((item) => {
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/10">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
