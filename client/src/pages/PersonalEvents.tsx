import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Filter,
  Star,
  ArrowRight,
  ArrowLeft,
  Plus,
  UserPlus,
  Settings,
  Ban,
  CheckCircle,
  AlertTriangle,
  Edit3,
  Save,
  X,
  Send,
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { categories, getCategoryIcon } from '@/lib/getCategoryIcon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthContext';
import api from '@/api';
import { PersonalEventType, EditablePersonalEventData } from '@/types/eventType';
import { JoinEvents } from '@/types/joinEventType';
import { getStatusLabel } from '@/lib/statusUtils';
import { formatDateTimeLocal } from '@/lib/formatLocalDate';

const PersonalEvents = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTypeUser] = useState(user?.tipo || 'not logged in');
  const [currentCity, setCurrentCity] = useState(user?.luogo || 'Parma');
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [events, setEvents] = useState<PersonalEventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PersonalEventType | null>(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditablePersonalEventData>({
    recensione: '',
    star: 0,
  });

  const eventStatusOptions = [
    { value: 0, label: 'Disattivato', icon: Ban, color: 'text-gray-500' },
    { value: 1, label: 'Attivo', icon: CheckCircle, color: 'text-green-500' },
    { value: 2, label: 'Warning', icon: AlertTriangle, color: 'text-yellow-500' },
    { value: 3, label: 'Bannato', icon: Ban, color: 'text-red-500' },
  ];

  const fetchEvents = async () => {
    try {
      const response = await api.get(`/event/listed`, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        },
      });
      console.log('Dati ricevuti: ', response.data.data);

      if (response.data.success) {
        setEvents(response.data.data);
        console.log('events after setEvents: ', events);
      } else {
        toast({
          title: 'Error fetching events',
          description: response.data.message || 'Unable to fetch events for this city',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error fetching events',
        description: 'An unexpected error occurred while fetching events.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken'); // Ricupera la città salvata nel localStorage
    if (!accessToken) {
      toast({
        title: 'Reserved Area',
        description: 'Please, log-in before continue',
        variant: 'destructive',
      });
      navigate('/login');
    }

    fetchEvents();

    console.log(events);
  }, []);

  const filteredEvents =
    selectedCategory === 'All Events'
      ? events
      : events.filter((event) => event.categoria === selectedCategory);

  const handleSearch = () => {
    setCurrentCity(currentCity.trim());
    localStorage.setItem('lastCity', currentCity);
    fetchEvents();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Conversione per i campi numerici
    const parsedValue =
      name === 'prezzo' || name === 'postiDisponibili' ? parseFloat(value) : value;

    setEditData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: parsedValue,
      };
    });
  };

  const handleRateEvent = (event: PersonalEventType) => {
    setSelectedEvent(event);
    // ✅ Se c'è una recensione già fatta, impostala
    if (event.recensione) {
      setEditData((prev) => ({
        ...prev,
        recensione: event.recensione,
      }));
    }

    // ✅ Se c'è un valore star salvato, impostalo
    if (event.star) {
      setEditData((prev: any) => ({
        ...prev,
        star: event.star,
      }));
    }
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setEditData({
      recensione: '',
      star: 0,
    });
    setViewMode('list');
  };

  const handleCreateEvent = () => {
    if (!user) {
      toast({
        title: 'Please log in to create events',
        description: 'You need to be logged in to create new events.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    if (!['operatore', 'admin'].includes(currentTypeUser)) {
      toast({
        title: 'Access Denied',
        description: 'Only organizers or admin can create new events.',
        variant: 'destructive',
      });
      return;
    }
    // Logica per creare un nuovo evento
    toast({
      title: 'Creazione evento',
      description: 'Reindirizzamento alla pagina di creazione evento...',
    });
    navigate('/create-event');
  };

  const handleStatusChange = (eventId: number, newStatus: number) => {
    if (!user) {
      toast({
        title: 'Please log in to change event status',
        description: 'You need to be logged in to change the status of events.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      api.put(
        `/event/${eventId}/status`,
        { stato: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            accessToken: accessToken,
          },
        }
      );
    } catch (error) {
      console.error('Error changing event status:', error);
      toast({
        title: 'Error changing event status',
        description: 'An unexpected error occurred while trying to change the event status.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Stato aggiornato!',
      description: `Lo stato dell'evento è stato cambiato a: ${getStatusLabel(newStatus)}`,
    });

    // Aggiorna lo stato nell'array degli eventi
    setEvents(
      events.map((event) => (event.id === eventId ? { ...event, stato: newStatus } : event))
    );

    // Aggiorna anche l'evento selezionato se è quello corrente
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent({ ...selectedEvent, stato: newStatus });
    }
  };

  const getActionButton = (event: PersonalEventType) => {
    switch (user?.tipo) {
      case 'admin':
        const currentStatus = eventStatusOptions.find((s) => s.value === event.stato);
        const Icon = currentStatus?.icon;
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">Stato attuale:</span>
              {currentStatus && Icon ? (
                <div className={`flex items-center space-x-1 ${currentStatus.color}`}>
                  <Icon className="h-4 w-4" />
                  <span>{currentStatus.label}</span>
                </div>
              ) : (
                <div className="italic text-muted-foreground">Stato non riconosciuto</div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {eventStatusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(event.id, status.value)}
                  className={`p-2 rounded-lg border-2 transition-all text-sm flex items-center space-x-1 ${
                    event.stato === status.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <status.icon className={`h-4 w-4 ${status.color}`} />
                  <span>{status.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmitRecensione = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('recensione: ', editData.recensione);
    try {
      if (!selectedEvent?.id) {
        toast({
          title: 'Something went wrong...',
          description: 'No event found, please, try later',
          variant: 'destructive',
        });
        return;
      }

      const recensione = await api.put(
        `/join-event/rate/${selectedEvent?.id}`,
        {
          recensione: editData.recensione,
          star: editData.star,
        },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        }
      );

      if (recensione.status) {
        toast({
          title: 'Recensione inserita con successo!',
          description: `Hai valutato ${selectedEvent?.titolo} con ${editData.star} stelle`,
        });
      }
    } catch (err: any) {
      console.error('Error fetching events:', err);
      toast({
        title: 'Error fetching events',
        description:
          err.response.data.message ?? 'An unexpected error occurred while fetching events.',
        variant: 'destructive',
      });
    }
  };

  const handleStarClick = (value: number) => {
    setEditData((prev) => ({
      ...prev,
      star: value,
    }));
  };

  // Permette di mostrare a monitor le stelle
  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      return (
        <button
          key={starValue}
          type="button"
          onClick={() => handleStarClick(starValue)}
          className="text-yellow-400 hover:scale-110 transition-transform"
        >
          <Star fill={starValue <= editData?.star ? 'currentColor' : 'none'} className="w-6 h-6" />
        </button>
      );
    });
  };

  if (viewMode === 'detail' && selectedEvent) {
    const CategoryIcon = getCategoryIcon(selectedEvent.categoria);

    console.log(selectedEvent);
    console.log(editData);
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="mb-6 flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Torna agli eventi</span>
          </button>

          {/* Event Detail */}
          <div className="glass-morphism rounded-xl overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.titolo}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                <span className="text-sm font-medium text-white">€ {selectedEvent.prezzo}</span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-4">
                {/* <CategoryIcon className="h-5 w-5 text-primary" /> */}
                <span className="text-primary font-medium capitalize">
                  <span className="text-primary font-medium capitalize flex items-center gap-2">
                    {CategoryIcon && <CategoryIcon className="h-5 w-5" />}
                    {selectedEvent.categoria}
                  </span>
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">selectedEvent.titolo</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Data e Ora</p>
                      <p className="text-muted-foreground">
                        {new Date(selectedEvent.data).toLocaleDateString()} alle{' '}
                        {new Date(selectedEvent.data).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Luogo</p>
                      <p className="text-muted-foreground">{selectedEvent.luogo}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Partecipanti</p>
                      <p className="text-muted-foreground">
                        {selectedEvent.postiDisponibili} posti disponibili
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Organizzatore</p>
                    <p className="text-muted-foreground">{selectedEvent.organizzatore}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Email Organizzatore</p>
                    <p className="text-muted-foreground">{selectedEvent.emailOrganizzatore}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Prezzo</p>
                    <p className="text-2xl font-bold text-primary">
                      {Number(selectedEvent.prezzo) === 0
                        ? 'Gratuito'
                        : `€ ${selectedEvent.prezzo}`}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-medium mb-3">Descrizione</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedEvent.descrizione}</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmitRecensione}>
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Valutazione Evento</h3>
                  <div className="flex space-x-2">{renderStars()}</div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Recensione Evento</h3>
                  <input
                    type="text"
                    name="recensione"
                    value={editData?.recensione || ''}
                    onChange={handleInputChange}
                    placeholder="Scrivi la tua recensione..."
                    className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                </div>

                <button type="submit" className="btn-primary mt-2 flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Invia Recensione</span>
                </button>
              </form>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  onClick={handleBackToList}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Torna agli eventi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* City Header */}
        <div className="flex items-center space-x-3 mb-8">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Your Listed Events</h2>
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
                  onClick={() => setSelectedCategory(category.label)}
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
            const CategoryIcon = getCategoryIcon(event.categoria);
            console.log(event);
            return (
              <div
                key={event.id}
                className="glass-morphism rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.titolo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {/* <Star className="w-4 h-4 text-yellow-500" /> */}
                        {Math.floor((event.mediaRating ?? 0) * 10) / 10}/5
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-sm font-medium text-white">€ {event.prezzo}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <CategoryIcon className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary font-medium capitalize">
                      {event.categoria}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {event.titolo}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {event.descrizione || 'No description available for this event.'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.data).toLocaleDateString()}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{new Date(event.data).toLocaleTimeString()}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.luogo}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.postiDisponibili} attending</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRateEvent(event)}
                    className="w-full btn-primary flex items-center justify-center space-x-2 group"
                  >
                    <span>Rate Event</span>
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

export default PersonalEvents;
