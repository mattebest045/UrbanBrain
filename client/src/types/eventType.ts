export interface EventType {
  id: number;
  titolo: string;
  categoria: string;
  organizzatore: string;
  emailOrganizzatore: string;
  luogo: string;
  prezzo: string;
  filename: string;
  path: string;
  postiDisponibili: number;
  descrizione: string;
  data: string;
  stato: number;
  imageUrl: string;
  mediaRating: number;
}

export interface EditableEventData {
  titolo: string;
  descrizione: string;
  categoria: string;
  data: string;
  luogo: string;
  prezzo: string;
  postiDisponibili: number;
  organizzatore: string;
  emailOrganizzatore: string;
}

export interface createEventData {
  titolo: string;
  categoria: string;
  organizzatore: string;
  emailOrganizzatore: string;
  luogo: string;
  prezzo: string;
  file: string;
  postiDisponibili: number;
  descrizione: string;
  data: string;
  stato: number;
}

// Utilizzo in PersonalEvents
export interface PersonalEventType {
  id: number;
  titolo: string;
  categoria: string;
  organizzatore: string;
  emailOrganizzatore: string;
  luogo: string;
  prezzo: string;
  filename: string;
  path: string;
  postiDisponibili: number;
  descrizione: string;
  data: string;
  stato: number;
  imageUrl: string;
  mediaRating: number;
  star?: number;
  recensione?: string;
}

export interface EditablePersonalEventData {
  recensione?: string;
  star: number;
}
