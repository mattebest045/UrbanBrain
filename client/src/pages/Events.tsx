
import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  Filter,
  Star,
  Music,
  Utensils,
  Gamepad2,
  Briefcase,
  Heart,
  ArrowRight
} from 'lucide-react';

const Events = () => {
  const [searchCity, setSearchCity] = useState('New York');
  const [currentCity, setCurrentCity] = useState('New York');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Events', icon: Calendar },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'food', label: 'Food & Drink', icon: Utensils },
    { id: 'sports', label: 'Sports', icon: Gamepad2 },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'community', label: 'Community', icon: Heart },
  ];

  const events = [
    {
      id: 1,
      title: 'Summer Music Festival 2024',
      category: 'music',
      date: '2024-07-15',
      time: '18:00',
      venue: 'Central Park Amphitheater',
      attendees: 2500,
      price: 'Free',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      description: 'Join us for an evening of incredible live music featuring local and international artists.'
    },
    {
      id: 2,
      title: 'Food Truck Rally',
      category: 'food',
      date: '2024-07-20',
      time: '11:00',
      venue: 'Downtown Plaza',
      attendees: 1200,
      price: '$15',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400',
      description: 'Taste the best street food from over 30 local food trucks and vendors.'
    },
    {
      id: 3,
      title: 'Smart City Conference',
      category: 'business',
      date: '2024-07-25',
      time: '09:00',
      venue: 'Convention Center',
      attendees: 800,
      price: '$99',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      description: 'Explore the future of urban technology and sustainable city development.'
    },
    {
      id: 4,
      title: 'Community Garden Workshop',
      category: 'community',
      date: '2024-07-18',
      time: '14:00',
      venue: 'Riverside Community Garden',
      attendees: 45,
      price: 'Free',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      description: 'Learn sustainable gardening techniques and help beautify our neighborhood.'
    },
    {
      id: 5,
      title: 'City Marathon',
      category: 'sports',
      date: '2024-08-05',
      time: '07:00',
      venue: 'City Center',
      attendees: 5000,
      price: '$45',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      description: 'Join thousands of runners in our annual city marathon through scenic routes.'
    },
    {
      id: 6,
      title: 'Tech Startup Meetup',
      category: 'business',
      date: '2024-07-22',
      time: '19:00',
      venue: 'Innovation Hub',
      attendees: 150,
      price: 'Free',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
      description: 'Network with entrepreneurs and discover the latest in urban technology innovations.'
    }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const handleSearch = () => {
    setCurrentCity(searchCity);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryItem = categories.find(cat => cat.id === category);
    return categoryItem ? categoryItem.icon : Calendar;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            City Events
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and participate in local events happening in your city
          </p>
        </div>

        {/* Search Bar */}
        <div className="glass-morphism p-6 rounded-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter city name..."
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search Events</span>
            </button>
          </div>
        </div>

        {/* City Header */}
        <div className="flex items-center space-x-3 mb-8">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Events in {currentCity}</h2>
          <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
            {filteredEvents.length} events found
          </div>
        </div>

        {/* Category Filter */}
        <div className="glass-morphism p-4 rounded-xl mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <span className="font-medium">Filter by Category</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/50 hover:bg-background/70 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const CategoryIcon = getCategoryIcon(event.category);
            return (
              <div
                key={event.id}
                className="glass-morphism rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-sm font-medium text-white">{event.price}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <CategoryIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary font-medium capitalize">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees.toLocaleString()} attending</span>
                    </div>
                  </div>

                  <button className="w-full btn-primary flex items-center justify-center space-x-2 group">
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search for a different city.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
