export type StatutOrdonnance = 'en attente' | 'validée' | 'exécutée' | 'annulée';

export interface Medicament {
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
  notes?: string;
}

export interface Ordonnance {
  id: string;
  patientId: string;
  medecinId: string;
  dateOrdonnance: Date;
  statut: StatutOrdonnance;
  medicaments: Medicament[];
  observations: string;
  dureeValidite: number; // en jours
  dateCreation: Date;
  dateDerniereModification: Date;
}
