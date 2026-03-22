export interface Utilisateur {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  specialite?: string;
  role: 'admin' | 'medecin' | 'infirmier' | 'receptionniste' | 'patient';
  dateInscription?: Date;
  actif?: boolean;
  hopital?: string;
}

export interface UtilisateurSession extends Utilisateur {
  token: string;
  exp: number; // Expiration timestamp
}
