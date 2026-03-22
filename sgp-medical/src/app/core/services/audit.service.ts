import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export type AuditAction =
  | 'CONSULTATION_DOSSIER'
  | 'MODIFICATION_PATIENT'
  | 'CREATION_PATIENT'
  | 'SUPPRESSION_PATIENT'
  | 'CREATION_ORDONNANCE'
  | 'CREATION_CONSULTATION'
  | 'EXPORT_DONNEES'
  | 'VIEW_SENSITIVE'
  | 'ACCES_REFUSE'
  | 'CONNEXION'
  | 'DECONNEXION';

export interface EntreeAudit {
  timestamp: string;
  utilisateurId: string;
  utilisateurRole: string;
  action: AuditAction;
  patientId?: string;
  details?: string;
  adresseIP: string;
  statut: 'succès' | 'erreur' | 'refusé';
}

/**
 * Service d'audit obligatoire pour la conformité HDS/RGPD
 * Journalise tous les accès aux données patients
 */
@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditLogs: EntreeAudit[] = [];
  private readonly maxLogsLocaux = 100; // Garder les 100 derniers logs en mémoire

  constructor(private authService: AuthService) {
    // Simulation: charger les logs depuis localStorage
    this.chargerLogsDepuisLocalStorage();
  }

  /**
   * Enregistrer une action audit
   */
  log(
    action: AuditAction,
    patientId?: string,
    details?: string,
    statut: 'succès' | 'erreur' | 'refusé' = 'succès'
  ): void {
    const entree: EntreeAudit = {
      timestamp: new Date().toISOString(),
      utilisateurId: this.authService.getUtilisateurConnecte()?.id ?? 'anonyme',
      utilisateurRole: this.authService.getRole(),
      action,
      patientId,
      details,
      adresseIP: 'client-side', // L'IP réelle est enregistrée côté serveur
      statut,
    };

    // Ajouter au log local
    this.auditLogs.push(entree);
    
    // Garder seulement les derniers logs
    if (this.auditLogs.length > this.maxLogsLocaux) {
      this.auditLogs = this.auditLogs.slice(-this.maxLogsLocaux);
    }

    // Sauvegarder en localStorage (pour la démo)
    this.sauvegarderLogsEnLocalStorage();

    // En production: envoyer au serveur SANS bloquer
    this.envoyerAuServeur(entree).catch(err => {
      console.error('[AuditService] Erreur envoi audit:', err);
      // L'audit local reste conservé même si l'envoi échoue
    });

    // Log console en développement
    console.log(`[AUDIT] ${action} | ${patientId || 'N/A'} | ${this.authService.getUtilisateurConnecte()?.prenom} ${this.authService.getUtilisateurConnecte()?.nom}`);
  }

  /**
   * Récupérer les logs d'audit (pour l'admin)
   */
  obtenirLogs(filtres?: { action?: AuditAction; patientId?: string }): EntreeAudit[] {
    let logs = [...this.auditLogs];

    if (filtres?.action) {
      logs = logs.filter(l => l.action === filtres.action);
    }

    if (filtres?.patientId) {
      logs = logs.filter(l => l.patientId === filtres.patientId);
    }

    return logs;
  }

  /**
   * Exporter les logs en JSON
   */
  exporterLogs(): string {
    return JSON.stringify(this.auditLogs, null, 2);
  }

  /**
   * Nettoyer les logs (DANGER - usage admin uniquement)
   */
  nettoyerLogs(): void {
    if (!this.authService.aRole('admin')) {
      this.log('ACCES_REFUSE', undefined, 'Tentative nettoyage logs sans droits admin', 'refusé');
      throw new Error('Seul l\'admin peut nettoyer les logs');
    }
    this.auditLogs = [];
    localStorage.removeItem('sgp_audit_logs');
    this.log('MODIFICATION_PATIENT', undefined, 'Nettoyage des logs d\'audit', 'succès');
  }

  /**
   * Envoyer les logs au serveur (simulation)
   */
  private envoyerAuServeur(entree: EntreeAudit): Promise<void> {
    return new Promise((resolve, reject) => {
      // Simulation: envoyer à /api/audit via HTTP
      // setTimeout(() => resolve(), 500);
      
      // En production, ce serait:
      // return this.http.post('/api/audit', entree).toPromise()
      
      resolve();
    });
  }

  /**
   * Sauvegarder les logs localement
   */
  private sauvegarderLogsEnLocalStorage(): void {
    try {
      localStorage.setItem('sgp_audit_logs', JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn('[AuditService] Pas de place localStorage pour les logs');
    }
  }

  /**
   * Charger les logs depuis localStorage
   */
  private chargerLogsDepuisLocalStorage(): void {
    try {
      const data = localStorage.getItem('sgp_audit_logs');
      if (data) {
        this.auditLogs = JSON.parse(data);
      }
    } catch (e) {
      console.warn('[AuditService] Erreur chargement logs depuis localStorage');
    }
  }
}
