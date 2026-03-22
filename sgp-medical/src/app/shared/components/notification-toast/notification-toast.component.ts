import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notif of notifications"
        [class]="'notification notification-' + notif.type"
        [@fadeInOut]
      >
        <div class="notif-header">
          <span class="notif-titre">{{ notif.titre }}</span>
          <button class="notif-close" (click)="fermer(notif.id)" aria-label="Fermer">×</button>
        </div>
        <div class="notif-body">
          <p class="notif-message">{{ notif.message }}</p>
          <button
            *ngIf="notif.action"
            class="notif-action-btn"
            (click)="notif.action!.callback()"
          >
            {{ notif.action.label }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      pointer-events: none;
    }

    .notification {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 1rem;
      pointer-events: auto;
      border-left: 4px solid #999;
      animation: slideIn 0.3s ease;

      &.notification-info {border-left-color: #2196f3; background: #e3f2fd;}
      &.notification-success {border-left-color: #4caf50; background: #e8f5e9;}
      &.notification-warning {border-left-color: #ff9800; background: #fff3e0;}
      &.notification-error {border-left-color: #f44336; background: #ffebee;}
      &.notification-urgence {border-left-color: #e74c3c; background: #ffe6e6;}

      .notif-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .notif-titre {
          font-weight: 600;
          font-size: 1rem;
        }

        .notif-close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
          opacity: 0.7;

          &:hover {opacity: 1;}
        }
      }

      .notif-body {
        padding: 1rem;

        .notif-message {
          margin: 0 0 0.5rem 0;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .notif-action-btn {
          background: inherit;
          border: 1px solid currentColor;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: 0.5rem;

          &:hover {
            opacity: 0.7;
          }
        }
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    }
  `]
})
export class NotificationToastComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifs: Notification[]) => {
        this.notifications = notifs;
      });
  }

  fermer(id: string): void {
    this.notificationService.fermer(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
