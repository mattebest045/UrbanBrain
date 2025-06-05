
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Cloud, 
  Calendar, 
  Users, 
  Zap, 
  Wifi, 
  Shield, 
  TreePine,
  ArrowRight,
  BarChart3,
  Globe,
  Lightbulb
} from 'lucide-react';

const HomePage = () => {
  const metrics = [
    { 
      label: 'Air Quality Index', 
      value: '42', 
      unit: 'AQI',
      status: 'Good',
      icon: TreePine,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    { 
      label: 'Energy Consumption', 
      value: '8.2', 
      unit: 'MW',
      status: 'Normal',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    { 
      label: 'Network Status', 
      value: '99.8', 
      unit: '%',
      status: 'Online',
      icon: Wifi,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    { 
      label: 'Active Citizens', 
      value: '24.7K', 
      unit: '',
      status: 'Connected',
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
  ];

  const features = [
    {
      title: 'Real-time Weather Monitoring',
      description: 'Advanced meteorological data integration with predictive analytics for better city planning.',
      icon: Cloud,
      link: '/weather'
    },
    {
      title: 'Smart Event Management',
      description: 'Centralized event coordination with citizen engagement and resource optimization.',
      icon: Calendar,
      link: '/events'
    },
    {
      title: 'Citizen Dashboard',
      description: 'Personalized profiles for citizens, operators, and administrators with role-based access.',
      icon: Shield,
      link: '/profile'
    },
    {
      title: 'Analytics & Insights',
      description: 'Data-driven insights for smart decision making and urban optimization.',
      icon: BarChart3,
      link: '/weather'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 city-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-green-600/20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">UrbanBrain</span>
              <span className="block text-3xl md:text-5xl text-muted-foreground mt-2">v2.0.0</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              The next generation of smart city management. Monitor, analyze, and optimize urban infrastructure 
              with real-time data integration and citizen-centric solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                to="/weather" 
                className="btn-primary flex items-center space-x-2 group"
              >
                <Cloud className="h-5 w-5" />
                <span>Explore Weather Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
                to="/events" 
                className="btn-secondary flex items-center space-x-2 group"
              >
                <Calendar className="h-5 w-5" />
                <span>View City Events</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Metrics */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Live City Metrics
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real-time monitoring of critical urban infrastructure and citizen engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={metric.label}
                  className="metric-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <Activity className="h-4 w-4 text-green-400 animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{metric.label}</h3>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-primary">{metric.value}</span>
                      <span className="text-muted-foreground">{metric.unit}</span>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${metric.bgColor} ${metric.color}`}>
                      {metric.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Smart City Solutions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools for modern urban management and citizen engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className="metric-card group hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-primary/20">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-primary font-medium">
                        <span>Learn more</span>
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="h-16 w-16 text-primary mx-auto mb-8 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Smart City Revolution
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Experience the future of urban living with UrbanBrain v2.0.0. 
            Connect with your city like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary">
              Get Started Today
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
