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
import { EventType, EditableEventData } from '@/types/eventType';
import { JoinEvents } from '@/types/joinEventType';
import { getStatusLabel } from '@/lib/statusUtils';
import { formatDateTimeLocal } from '@/lib/formatLocalDate';

const Events = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTypeUser] = useState(user?.tipo || 'not logged in');
  const [currentCity, setCurrentCity] = useState(user?.luogo || 'Parma');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditableEventData>();

  const eventStatusOptions = [
    { value: 0, label: 'Disattivato', icon: Ban, color: 'text-gray-500' },
    { value: 1, label: 'Attivo', icon: CheckCircle, color: 'text-green-500' },
    { value: 2, label: 'Warning', icon: AlertTriangle, color: 'text-yellow-500' },
    { value: 3, label: 'Bannato', icon: Ban, color: 'text-red-500' },
  ];

  const fetchEvents = async () => {
    try {
      const response = await api.get(`/event/city/${currentCity}`);
      if (response.data.success) {
        setEvents(response.data.data);
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
    const savedCity = localStorage.getItem('lastCity'); // Ricupera la città salvata nel localStorage
    if (user?.luogo) {
      setCurrentCity(user.luogo);
    } else if (savedCity) {
      setCurrentCity(savedCity);
    } else {
      setCurrentCity('Parma');
    }

    fetchEvents();
  }, [user]);

  const filteredEvents =
    selectedCategory === 'all'
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

  /** Codice aggiunto */
  const handleViewDetails = (event: EventType) => {
    setSelectedEvent(event);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setViewMode('list');
  };

  const handleEdit = () => {
    if (user?.tipo !== 'operatore' && user?.tipo !== 'admin') {
      toast({
        title: 'You are not logged in!',
        description: 'Before edit an event, please, go to log-in page',
        variant: 'destructive',
      });
      return;
    }
    setIsEditing(true);
    setEditData({
      titolo: selectedEvent?.titolo || '',
      descrizione: selectedEvent?.descrizione || '',
      categoria: selectedEvent?.categoria || '',
      data: selectedEvent?.data || '',
      luogo: editData?.luogo || '',
      prezzo: selectedEvent?.prezzo || '0',
      postiDisponibili: selectedEvent?.postiDisponibili || 0,
      organizzatore: selectedEvent?.organizzatore || '',
      emailOrganizzatore: selectedEvent?.emailOrganizzatore || '',
    });
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

  const handleSave = async () => {
    setIsEditing(false);
    // Add API call to save changes
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token mancante');
      console.log('editData: ', editData);
      await api.put(`/event/modify/${selectedEvent?.id}`, editData, {
        headers: {
          accessToken: token,
        },
      });
      // Aggiorna lista eventi
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent?.id ? { ...event, ...editData } : event
        )
      );
      // Aggiorna evento selezionato
      setSelectedEvent((prev) =>
        prev && prev.id === selectedEvent?.id ? { ...prev, ...editData } : prev
      );
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (err: any) {
      console.error('Errore nel salvataggio del profilo:', err);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      titolo: selectedEvent?.titolo || '',
      descrizione: selectedEvent?.descrizione || '',
      categoria: selectedEvent?.categoria || '',
      data: selectedEvent?.data || '',
      luogo: selectedEvent?.luogo || '',
      prezzo: selectedEvent?.prezzo || '0',
      postiDisponibili: selectedEvent?.postiDisponibili || 0,
      organizzatore: selectedEvent?.organizzatore || '',
      emailOrganizzatore: selectedEvent?.emailOrganizzatore || '',
    });
    setIsEditing(false);
  };

  const handleJoinEvent = async (eventId: number) => {
    if (!user) {
      toast({
        title: 'Please log in to join events',
        description: 'You need to be logged in to join events.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.post<JoinEvents>(
        '/join-event/',
        {
          idEvento: eventId,
          segnalazione: '',
        },
        {
          headers: {
            accessToken: token,
          },
        }
      );

      if (response.status) {
        toast({
          title: 'Successfully joined the event!',
          description: 'You are now registered for this event.',
        });
      }
    } catch (error: any) {
      console.error('Error joining event:', error.response.data);
      toast({
        title: 'Error joining event',
        description:
          error.response.data.message ??
          'An unexpected error occurred while trying to join the event.',
        variant: 'destructive',
      });
    }
  };

  const handleWorkEvent = async (eventId: number) => {
    if (!user) {
      toast({
        title: 'Please log in to apply for work',
        description: 'You need to be logged in to apply for work at events.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const joinEvent: JoinEvents = {
        stato: 0, // Assuming 0 means "pending" or "not yet approved"
      };
      const response = await api.post(`/create-event/${eventId}`, joinEvent, {
        headers: {
          accessToken: token,
        },
      });

      if (response.status) {
        // Logica per arruolarsi per lavorare
        toast({
          title: 'Candidatura inviata!',
          description: 'La tua candidatura per lavorare a questo evento è stata inviata.',
        });
      }
    } catch (error: any) {
      console.error('Error applying for work:', error.response.data);
      toast({
        title: 'Error applying for work',
        description:
          error.response.data.message ??
          'An unexpected error occurred while trying to apply for work at this event.',
        variant: 'destructive',
      });
      return;
    }
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

  const getActionButton = (event: EventType) => {
    if (!user) {
      // Utente non loggato - mostra bottone cittadino
      return (
        <button
          onClick={() => handleJoinEvent(event.id)}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Iscriviti all'evento</span>
        </button>
      );
    }

    switch (user.tipo) {
      case 'cittadino':
        return (
          <button
            onClick={() => handleJoinEvent(event.id)}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Iscriviti all'evento</span>
          </button>
        );

      case 'operatore':
        return (
          <button
            onClick={() => handleWorkEvent(event.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Candidati per lavorare</span>
          </button>
        );

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

  if (viewMode === 'detail' && selectedEvent) {
    const CategoryIcon = getCategoryIcon(selectedEvent.categoria);
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
                  {isEditing ? (
                    <Select
                      value={editData?.categoria}
                      onValueChange={(value) =>
                        setEditData((prev) => {
                          if (prev) {
                            return { ...prev, categoria: value };
                          } else if (selectedEvent) {
                            return { ...selectedEvent, categoria: value }; // fallback completo
                          } else {
                            return undefined;
                          }
                        })
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => {
                          const Icon = getCategoryIcon(cat.label);
                          return (
                            <SelectItem
                              key={cat.id}
                              value={cat.label}
                              className="flex items-center gap-2"
                            >
                              <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              {cat.label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-primary font-medium capitalize flex items-center gap-2">
                      {CategoryIcon && <CategoryIcon className="h-5 w-5" />}
                      {selectedEvent.categoria}
                    </span>
                  )}
                </span>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    name="titolo"
                    value={editData?.titolo}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                ) : (
                  selectedEvent.titolo
                )}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Data e Ora</p>
                      {isEditing ? (
                        <input
                          type="datetime-local"
                          name="data"
                          value={editData?.data ? formatDateTimeLocal(new Date(editData.data)) : ''}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          {new Date(selectedEvent.data).toLocaleDateString()} alle{' '}
                          {new Date(selectedEvent.data).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Luogo</p>
                      {isEditing ? (
                        <input
                          type="text"
                          name="luogo"
                          value={editData?.luogo}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        />
                      ) : (
                        <p className="text-muted-foreground">{selectedEvent.luogo}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Partecipanti</p>
                      {isEditing ? (
                        <input
                          type="number"
                          name="postiDisponibili"
                          value={editData?.postiDisponibili}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        />
                      ) : (
                        <p className="text-muted-foreground">
                          {selectedEvent.postiDisponibili} posti disponibili
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Organizzatore</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="organizzatore"
                        value={editData?.organizzatore}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <p className="text-muted-foreground">{selectedEvent.organizzatore}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium mb-2">Email Organizzatore</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="emailOrganizzatore"
                        value={editData?.emailOrganizzatore}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <p className="text-muted-foreground">{selectedEvent.emailOrganizzatore}</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium mb-2">Prezzo</p>
                    {isEditing ? (
                      <input
                        type="number"
                        name="prezzo"
                        value={editData?.prezzo}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    ) : (
                      <p className="text-2xl font-bold text-primary">
                        {Number(selectedEvent.prezzo) === 0
                          ? 'Gratuito'
                          : `€ ${selectedEvent.prezzo}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">Descrizione</h3>
                {isEditing ? (
                  <input
                    type="text"
                    name="descrizione"
                    value={editData?.descrizione}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedEvent.descrizione}
                  </p>
                )}
              </div>

              {/* {selectedEvent.descrizione && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Dettagli aggiuntivi</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedEvent.dettagli}</p>
                </div>
              )} */}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <button
                  onClick={handleBackToList}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Torna agli eventi</span>
                </button>

                <div className="flex-1">{getActionButton(selectedEvent)}</div>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">City Events</h1>
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
                  value={currentCity}
                  onChange={(e) => setCurrentCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter city name..."
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>
            </div>
            <button onClick={handleSearch} className="btn-primary flex items-center space-x-2">
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
            {/* Create Event Button for Operatore and Admin */}
            {user && (user.tipo === 'operatore' || user.tipo === 'admin') && (
              <button
                onClick={handleCreateEvent}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Crea Evento</span>
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const CategoryIcon = getCategoryIcon(event.categoria);
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
                    onClick={() => handleViewDetails(event)}
                    className="w-full btn-primary flex items-center justify-center space-x-2 group"
                  >
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
