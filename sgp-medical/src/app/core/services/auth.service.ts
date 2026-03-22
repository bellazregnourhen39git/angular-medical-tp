import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'sgp_auth_token';
  private utilisateurKey = 'sgp_utilisateur';
  private utilisateurSubject = new BehaviorSubject<Utilisateur | null>(this.chargerUtilisateur());
  readonly utilisateur$ = this.utilisateurSubject.asObservable();

  // Pour la session
  private sessionTimeoutMs = 15 * 60 * 1000; // 15 minutes
  private sessionTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.demarrerSupervisionSession();
  }

  /**
   * Connexion avec email/password (simulation)
   */
  connexion(email: string, mdp: string): Observable<Utilisateur | null> {
    return new Observable(observer => {
      // SIMULATION: vérifier les identifiants
      if (email && mdp.length >= 3) {
        const nomLocal = email.split('@')[0];
        const utilisateur: Utilisateur = {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          prenom: email.includes('admin') ? 'Admin' : email.includes('med') ? 'Dr.' : 'Nurse',
          nom: nomLocal.charAt(0).toUpperCase() + nomLocal.slice(1),
          email,
          role: email.includes('admin') ? 'admin' : email.includes('med') ? 'medecin' : 'infirmier',
          hopital: 'Hôpital Saint-Louis',
        };

        // Générer un token JWT simulé
        const token = btoa(JSON.stringify({ ...utilisateur, exp: Date.now() + 3600000 }));
        
        // Sauvegarder
        this.sauvegarderSession(utilisateur, token);
        observer.next(utilisateur);
        observer.complete();
      } else {
        observer.error(new Error('Identifiants invalides'));
      }
    });
  }

  /**
   * Déconnexion
   */
  deconnecter(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.utilisateurKey);
    this.utilisateurSubject.next(null);
    this.arreterSupervisionSession();
  }

  /**
   * Alias pour déconnexion (French naming)
   */
  deconnexion(): void {
    this.deconnecter();
  }

  /**
   * Récupérer l'utilisateur connecté
   */
  getUtilisateurConnecte(): Utilisateur | null {
    return this.utilisateurSubject.getValue();
  }

  /**
   * Récupérer le rôle de l'utilisateur
   */
  getRole(): string {
    return this.getUtilisateurConnecte()?.role ?? 'anonymous';
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  estConnecte(): boolean {
    return this.getUtilisateurConnecte() !== null && !!this.getToken();
  }

  /**
   * Récupérer le token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  aRole(...roles: string[]): boolean {
    const roleActuel = this.getRole();
    return roles.includes(roleActuel);
  }

  /**
   * Vérifier si l'utilisateur peut voir des données sensibles
   */
  peutVoirDonneesSensibles(): boolean {
    return this.aRole('admin', 'medecin');
  }

  /**
   * Sauvegarder la session
   */
  private sauvegarderSession(utilisateur: Utilisateur, token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.utilisateurKey, JSON.stringify(utilisateur));
    this.utilisateurSubject.next(utilisateur);
    this.demarrerSupervisionSession();
  }

  /**
   * Charger l'utilisateur depuis localStorage
   */
  private chargerUtilisateur(): Utilisateur | null {
    try {
      const data = localStorage.getItem(this.utilisateurKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Démarrer la surveillance de la session (timeout d'inactivité)
   */
  private demarrerSupervisionSession(): void {
    this.arreterSupervisionSession();
    if (this.estConnecte()) {
      this.sessionTimer = setTimeout(() => {
        console.warn('Session expirée (inactivité)');
        this.deconnecter();
      }, this.sessionTimeoutMs);
    }
  }

  /**
   * Arrêter la surveillance de la session
   */
  private arreterSupervisionSession(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
  }

  /**
   * Réinitialiser le timer de session sur activité
   */
  rafraichirSession(): void {
    if (this.estConnecte()) {
      this.demarrerSupervisionSession();
    }
  }
}
