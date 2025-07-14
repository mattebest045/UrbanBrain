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
    <nav className="bg-background border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">UrbanBrain</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {/* Altri link di navigazione */}
          {/* ... */}
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
    </nav>
  );
};

export default Navbar;
