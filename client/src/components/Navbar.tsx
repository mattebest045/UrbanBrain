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
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">UrbanBrain</span>
        </div>

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

// const Navbar = () => {
//   const location = useLocation();
//   const { user, logout, isAuthenticated, isLoading } = useAuth();

//   const handleLogout = () => {
//     logout();
//     // Opzionale: redirect alla home
//     // navigate('/');
//   };

//   // Mostra loading spinner se sta verificando l'autenticazione
//   if (loading) {
//     return (
//       <nav className="bg-background border-b">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex justify-between items-center">
//             <div>UrbanBrain</div>
//             <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   const navItems = [
//     { path: '/', label: 'Home', icon: Home },
//     { path: '/weather', label: 'Weather', icon: Cloud },
//     { path: '/events', label: 'Events', icon: Calendar },
//     { path: '/profile', label: 'Profile', icon: User },
//   ];

//   const authItems = [
//     { path: '/login', label: 'Login', icon: LogIn },
//     { path: '/signup', label: 'Sign Up', icon: UserPlus },
//   ];

//   return (
//     <nav className="glass-morphism border-b border-white/10 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3 group">
//             <div className="relative">
//               <Zap className="h-8 w-8 text-primary animate-pulse" />
//               <div className="absolute inset-0 h-8 w-8 text-primary animate-glow opacity-50" />
//             </div>
//             <div className="flex flex-col">
//               <span className="gradient-text text-xl font-bold">UrbanBrain</span>
//               <span className="text-xs text-muted-foreground">v2.0.0</span>
//             </div>
//           </Link>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center space-x-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
//                     isActive
//                       ? 'bg-primary/20 text-primary border border-primary/30'
//                       : 'text-muted-foreground hover:text-primary hover:bg-white/5'
//                   }`}
//                 >
//                   <Icon className="h-4 w-4" />
//                   <span className="font-medium">{item.label}</span>
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Auth Links */}
//           <div className="flex items-center space-x-2">
//             {authItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
//                     isActive
//                       ? 'bg-primary text-primary-foreground'
//                       : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
//                   }`}
//                 >
//                   <Icon className="h-4 w-4" />
//                   <span className="font-medium hidden sm:block">{item.label}</span>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       <div className="md:hidden border-t border-white/10">
//         <div className="flex justify-around py-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
//                   isActive
//                     ? 'text-primary'
//                     : 'text-muted-foreground hover:text-primary'
//                 }`}
//               >
//                 <Icon className="h-5 w-5" />
//                 <span className="text-xs font-medium">{item.label}</span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </nav>
//   );
// };

export default Navbar;
