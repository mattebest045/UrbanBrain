import React, { useState } from 'react';
import { Calendar, MapPin, Users, ArrowLeft, UserPlus, X } from 'lucide-react';
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
import { createEventData } from '@/types/eventType';
import { formatDateTimeLocal } from '@/lib/formatLocalDate';
import api from '@/api';
import config from '@/lib/config';

function CreateEvent() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createEvent, setCreateEvent] = useState<createEventData>({
    categoria: '',
    titolo: '',
    organizzatore: '',
    emailOrganizzatore: '',
    luogo: '',
    prezzo: '',
    file: '',
    postiDisponibili: 0,
    descrizione: '',
    data: '',
    stato: 0,
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputCange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setCreateEvent({
      ...createEvent,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // ✅ Se è un input di tipo file
    if (e.target instanceof HTMLInputElement && e.target.type === 'file' && e.target.files?.[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setCreateEvent((prev) => ({
        ...prev,
        file: file.name, // <-- salva il nome nel campo "file"
        imageUrl: imageUrl, // <-- per anteprima
      }));

      setImageFile(file); // <-- utile per l’invio con FormData
      return;
    }

    // ✅ Se è un campo numerico, converti
    const parsedValue =
      name === 'prezzo' || name === 'postiDisponibili' ? parseFloat(value) : value;

    // ✅ Aggiorna lo stato normalmente
    setCreateEvent((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImageUrl(preview); // ✅ usato per anteprima <img>
      setImageFile(file); // ✅ usato per upload vero via FormData
    }
  };

  const handleBackToList = () => {
    navigate('/events');
  };

  const newEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();

    // Aggiungi file vero solo se presente
    if (imageFile) {
      formData.append('file', imageFile); // ✅ multer lo aspetta così
    }

    // Aggiungi i campi testuali
    formData.append('titolo', createEvent.titolo);
    formData.append('categoria', createEvent.categoria);
    formData.append('organizzatore', createEvent.organizzatore);
    formData.append('emailOrganizzatore', createEvent.emailOrganizzatore);
    formData.append('luogo', createEvent.luogo);
    formData.append('prezzo', String(createEvent.prezzo));
    formData.append('postiDisponibili', String(createEvent.postiDisponibili));
    formData.append('descrizione', createEvent.descrizione);
    formData.append('data', createEvent.data);
    formData.append('stato', String(createEvent.stato));

    // DEBUG
    //@ts-ignore
    for (const pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    // CONTINUA A DARE ERRORE NELL\'INSERIMENTO DI UN FILE

    try {
      const resp = await api.post('/event', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accessToken: token,
        },
      });
      console.log('respo :', resp);
      toast({
        title: `Evento ${createEvent.titolo} creato con successo`,
        description: 'Evento caricato con successo',
      });
      //   navigate('/events');
    } catch (error: any) {
      if (error.status === 400) {
        console.log(error.response.data);
        // const messages = error.response.data.data.map((err: any) => `• ${err.msg}`).join('\n');
        // console.log(messages);
        toast({
          title: 'Errore di validazione',
          description: (
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {error.response.data.data.map((err: any, idx: number) => (
                <li key={idx}>{err.msg}</li>
              ))}
            </ul>
          ),
          variant: 'destructive', // opzionale se usi un colore rosso per errori
        });
      } else {
        console.error('Errore nella richiesta:', error);
        toast({
          title: "Errore nella creazione dell'evento",
          description:
            error.response.data.message ||
            "Si è verificato un errore durante la creazione dell'evento.",
          variant: 'destructive',
        });
      }
    }
    //     const formData = new FormData();
    //     formData.append("image", imageFile); // se hai mantenuto lo stato con il File
    // formData.append("titolo", createEvent.titolo);
  };

  const CategoryIcon = getCategoryIcon(createEvent.categoria);
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
        <form className="space-y-6" onSubmit={newEvent}>
          {/* Form */}
          <div className="glass-morphism rounded-xl overflow-hidden">
            <div className="relative h-64 md:h-80">
              <img
                src={imageUrl || `${config.URL_SERVER}/uploads/events/default.png`}
                alt={createEvent.titolo}
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Prezzo sovrapposto */}
              <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                <span className="text-sm font-medium text-white">€ {createEvent.prezzo}</span>
              </div>

              {/* Bottone di caricamento immagine */}
              <label className="absolute bottom-4 left-4 bg-background/80 text-sm text-white px-3 py-1 rounded-md cursor-pointer shadow-md hover:bg-background transition-all">
                Cambia immagine
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center space-x-2 mb-4">
                {/* <CategoryIcon className="h-5 w-5 text-primary" /> */}
                <span className="text-primary font-medium capitalize">
                  <Select
                    value={createEvent.categoria}
                    onValueChange={(value) =>
                      setCreateEvent((prev) => ({
                        ...prev,
                        categoria: value,
                      }))
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
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                <input
                  type="text"
                  name="titolo"
                  value={createEvent?.titolo}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Data e Ora</p>
                      <input
                        type="datetime-local"
                        name="data"
                        value={
                          createEvent?.data ? formatDateTimeLocal(new Date(createEvent.data)) : ''
                        }
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Luogo</p>
                      <input
                        type="text"
                        name="luogo"
                        value={createEvent?.luogo}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Partecipanti</p>
                      <input
                        type="number"
                        name="postiDisponibili"
                        value={createEvent?.postiDisponibili}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Organizzatore</p>
                    <input
                      type="text"
                      name="organizzatore"
                      value={createEvent?.organizzatore}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                  </div>
                  <div>
                    <p className="font-medium mb-2">Email Organizzatore</p>
                    <input
                      type="text"
                      name="emailOrganizzatore"
                      value={createEvent?.emailOrganizzatore}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                  </div>
                  <div>
                    <p className="font-medium mb-2">Prezzo</p>
                    <input
                      type="number"
                      name="prezzo"
                      value={createEvent?.prezzo}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-3">Descrizione</h3>
                <input
                  type="text"
                  name="descrizione"
                  value={createEvent?.descrizione}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 bg-background/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                />
              </div>

              {/* {createEvent.descrizione && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Dettagli aggiuntivi</h3>
                  <p className="text-muted-foreground leading-relaxed">{createEvent.dettagli}</p>
                </div>
              )} */}

              <div className="flex-1">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Crea l'evento</span>
                </button>
              </div>

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
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
