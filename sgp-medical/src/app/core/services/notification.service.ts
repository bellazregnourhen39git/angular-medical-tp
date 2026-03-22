import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type TypeNotification = 'info' | 'success' | 'warning' | 'error' | 'urgence';

export interface Notification {
  id: string;
  type: TypeNotification;
  titre: string;
  message: string;
  timestamp: Date;
  duree?: number; // en ms, null = persistant
  action?: {
    label: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  private notificationId = 0;
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  /**
   * Afficher une notification info
   */
  info(titre: string, message: string, duree = 5000): void {
    this.ajouter('info', titre, message, duree);
  }

  /**
   * Afficher une notification succès
   */
  success(titre: string, message: string, duree = 5000): void {
    this.ajouter('success', titre, message, duree);
  }

  /**
   * Afficher une notification avertissement
   */
  warning(titre: string, message: string, duree = 7000): void {
    this.ajouter('warning', titre, message, duree);
  }

  /**
   * Afficher une notification erreur
   */
  erreur(titre: string, message: string, duree?: number): void {
    this.ajouter('error', titre, message, duree ?? 10000);
  }

  /**
   * Afficher une alerte urgence (reste visible)
   */
  urgence(titre: string, message: string, action?: { label: string; callback: () => void }): void {
    const id = String(++this.notificationId);
    const notification: Notification = {
      id,
      type: 'urgence',
      titre,
      message,
      timestamp: new Date(),
      duree: undefined, // Persistant jusqu'à fermeture manuelle
      action,
    };

    const notifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...notifications, notification]);

    // Log urgent en console
    console.error('🚨 URGENCE:', titre, message);
  }

  /**
   * Fermer une notification
   */
  fermer(id: string): void {
    const notifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next(notifications.filter(n => n.id !== id));

    // Arrêter le timer si existe
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  /**
   * Fermer toutes les notifications
   */
  fermerTous(): void {
    this.notificationsSubject.next([]);
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  /**
   * Récupérer les notifications actuelles
   */
  obtenirNotifications(): Notification[] {
    return this.notificationsSubject.getValue();
  }

  /**
   * Ajouter une notification
   */
  private ajouter(
    type: TypeNotification,
    titre: string,
    message: string,
    duree?: number,
    action?: { label: string; callback: () => void }
  ): void {
    const id = String(++this.notificationId);
    const notification: Notification = {
      id,
      type,
      titre,
      message,
      timestamp: new Date(),
      duree,
      action,
    };

    const notifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...notifications, notification]);

    // Auto-fermer après durée
    if (duree && duree > 0) {
      const timer = setTimeout(() => {
        this.fermer(id);
      }, duree);
      this.timers.set(id, timer);
    }
  }
}
