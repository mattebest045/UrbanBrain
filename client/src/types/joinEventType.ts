export interface JoinEvents {
  segnalazione?: string;
  star?: number;
  descrizione?: string;
  stato: number; // 0: Inactive, 1: Active, 2: Queue, 3: Banned
}
