export interface User {
  id: string;
  nom: string;
  pseudo: string;
  statut: 'premium' | 'standard';
  budget: number;
}
