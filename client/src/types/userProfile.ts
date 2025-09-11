export interface UserProfile {
  nome: string;
  cognome: string;
  luogo: string;
  email: string;
  tipo: 'cittadino' | 'operatore' | 'admin';
  createdAt: string; // ISO date string
  stato: 0 | 1 | 2 | 3; // 0: In attesa, 1: Attivo, 2: Sospeso, 3: Eliminato
  id: string; // ID dell'utente
}

export const UserStatusMap: Record<number, string> = {
  0: 'Inactive',
  1: 'Active',
  2: 'Warning',
  3: 'Banned',
};
