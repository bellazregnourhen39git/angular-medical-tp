import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Utilisateur } from '../../../core/models/utilisateur.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <h1>🏥 SGP Medical</h1>
          <span class="subtitle">Système de Gestion de Patients</span>
        </div>

        <ul class="nav-menu" [class.active]="mobileMenuOpen">
          <li *ngIf="utilisateurConnecte">
            <a routerLink="/patients" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }">
              👥 Patients
            </a>
          </li>
          <li *ngIf="utilisateurConnecte">
            <a routerLink="/consultations" routerLinkActive="active">
              📋 Consultations
            </a>
          </li>
          <li *ngIf="utilisateurConnecte">
            <a routerLink="/ordonnances" routerLinkActive="active">
              💊 Ordonnances
            </a>
          </li>
          <li *ngIf="utilisateurConnecte && (utilisateurConnecte.role === 'admin')">
            <a routerLink="/tableau-de-bord" routerLinkActive="active">
              📊 Dashboard
            </a>
          </li>
        </ul>

        <div class="nav-right">
          <div *ngIf="utilisateurConnecte" class="user-info">
            <span class="user-name">{{ utilisateurConnecte.prenom }} {{ utilisateurConnecte.nom }}</span>
            <span class="role-badge" [class]="'role-' + utilisateurConnecte.role">
              {{ utilisateurConnecte.role | uppercase }}
            </span>
          </div>

          <div *ngIf="utilisateurConnecte" class="auth-actions">
            <button (click)="onDeconnexion()" class="btn-deconnexion">
              🚪 Déconnexion
            </button>
          </div>

          <div *ngIf="!utilisateurConnecte" class="auth-actions">
            <a routerLink="/connexion" class="btn-connexion">Connexion</a>
            <a routerLink="/inscription" class="btn-inscription">Inscription</a>
          </div>
        </div>

        <button class="hamburger" (click)="toggleMobileMenu()" [class.active]="mobileMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      flex-direction: column;
      flex: 0 0 auto;
      cursor: pointer;
      text-decoration: none;

      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .subtitle {
        font-size: 0.75rem;
        opacity: 0.9;
        font-weight: 300;
      }
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 0;
      margin: 0;
      padding: 0;
      flex: 1;
      justify-content: center;

      li {
        a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          display: block;
          transition: all 0.3s ease;
          border-radius: 4px;

          &:hover {
            color: white;
            background: rgba(255, 255, 255, 0.1);
          }

          &.active {
            color: white;
            background: rgba(255, 255, 255, 0.2);
            font-weight: 600;
          }
        }
      }
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex: 0 0 auto;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;

      .user-name {
        font-weight: 600;
      }

      .role-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;

        &.role-admin {
          background: rgba(255, 107, 107, 0.8);
        }

        &.role-medecin {
          background: rgba(107, 180, 255, 0.8);
        }

        &.role-infirmier {
          background: rgba(107, 255, 180, 0.8);
        }
      }
    }

    .auth-actions {
      display: flex;
      gap: 0.75rem;

      a,
      button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        white-space: nowrap;
      }

      .btn-connexion {
        color: white;
        background: transparent;
        border: 2px solid white;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }

      .btn-inscription {
        color: #667eea;
        background: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      }

      .btn-deconnexion {
        color: white;
        background: rgba(255, 255, 255, 0.2);

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .hamburger {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      gap: 5px;

      span {
        width: 25px;
        height: 3px;
        background: white;
        border-radius: 2px;
        transition: all 0.3s ease;
      }

      &.active {
        span:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }
        span:nth-child(2) {
          opacity: 0;
        }
        span:nth-child(3) {
          transform: rotate(-45deg) translate(8px, -8px);
        }
      }
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 1rem;
        gap: 1rem;
      }

      .navbar-brand {
        h1 {
          font-size: 1.2rem;
        }
        .subtitle {
          display: none;
        }
      }

      .nav-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(102, 126, 234, 0.95);
        flex-direction: column;
        width: 100%;
        padding: 1rem 0;

        &.active {
          display: flex;
        }

        li a {
          padding: 0.75rem 2rem;
        }
      }

      .nav-right {
        gap: 1rem;
      }

      .user-info {
        display: none;
      }

      .hamburger {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  utilisateurConnecte: Utilisateur | null = null;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.utilisateurConnecte = this.authService.getUtilisateurConnecte();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onDeconnexion(): void {
    this.authService.deconnexion();
    this.router.navigate(['/connexion']);
    this.mobileMenuOpen = false;
  }
}
