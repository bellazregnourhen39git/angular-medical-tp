export interface Consultation {
  id: string;
  patientId: string;
  patientNom: string;
  medecinId: string;
  medecinNom: string;
  date: Date;
  type: 'visite' | 'suivi' | 'urgence' | 'consultation à distance';
  statut: 'planifiée' | 'en cours' | 'complétée' | 'annulée';
  diagnostic?: string;
  observations?: string;
  ordonnance?: string;
  duree?: number; // en minutes
  lieu?: string;
}
