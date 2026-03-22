import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Utilisateur } from '../../core/models/utilisateur.model';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="welcome-page">
      <div *ngIf="!utilisateurConnecte" class="welcome-content">
        <div class="hero-section">
          <h1>🏥 Système de Gestion de Patients</h1>
          <p class="subtitle">SGP Medical - La plateforme de gestion médicale du futur</p>
          
          <div class="features">
            <div class="feature">
              <span class="icon">👥</span>
              <h3>Gestion Patients</h3>
              <p>Accès complet aux dossiers patients avec historique médical</p>
            </div>
            <div class="feature">
              <span class="icon">📋</span>
              <h3>Consultations</h3>
              <p>Planification et suivi des consultations médicales</p>
            </div>
            <div class="feature">
              <span class="icon">💊</span>
              <h3>Ordonnances</h3>
              <p>Gestion intelligente des prescriptions et médicaments</p>
            </div>
            <div class="feature">
              <span class="icon">📊</span>
              <h3>Tableau de bord</h3>
              <p>Statistiques et indicateurs de performance en temps réel</p>
            </div>
          </div>

          <div class="cta-buttons">
            <a routerLink="/connexion" class="btn-primary">
              Se connecter
            </a>
            <a routerLink="/inscription" class="btn-secondary">
              S'inscrire
            </a>
          </div>
        </div>

        <div class="info-section">
          <h2>Caractéristiques principales</h2>
          <ul>
            <li>✓ Conformité HDS/RGPD avec audit complet</li>
            <li>✓ Sécurité renforcée avec authentification JWT</li>
            <li>✓ Interface intuitive et responsive</li>
            <li>✓ Intégration FHIR R4 pour l'interopérabilité</li>
            <li>✓ Système de notification en temps réel</li>
            <li>✓ Gestion des urgences avec indicateurs visuels</li>
          </ul>
        </div>
      </div>

      <div *ngIf="utilisateurConnecte" class="welcome-authenticated">
        <div class="greeting">
          <h1>Bienvenue, {{ utilisateurConnecte.prenom }} {{ utilisateurConnecte.nom }}!</h1>
          <p>Connecté en tant que <strong>{{ utilisateurConnecte.role | uppercase }}</strong></p>
        </div>

        <div class="quick-access">
          <h2>Accès rapide</h2>
          <div class="access-grid">
            <a routerLink="/patients" class="access-card">
              <span class="icon">👥</span>
              <span class="label">Patients</span>
            </a>
            <a routerLink="/consultations" class="access-card">
              <span class="icon">📋</span>
              <span class="label">Consultations</span>
            </a>
            <a routerLink="/ordonnances" class="access-card">
              <span class="icon">💊</span>
              <span class="label">Ordonnances</span>
            </a>
            <a *ngIf="utilisateurConnecte.role === 'admin'" routerLink="/tableau-de-bord" class="access-card">
              <span class="icon">📊</span>
              <span class="label">Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .welcome-content {
      max-width: 1200px;
      margin: 0 auto;
      color: white;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 3rem;
      padding: 3rem 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);

      h1 {
        font-size: 3rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      .subtitle {
        font-size: 1.3rem;
        opacity: 0.9;
        margin-bottom: 2rem;
      }
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin: 2rem 0;

      .feature {
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        color: #333;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        h3 {
          margin: 0 0 0.5rem 0;
          color: #667eea;
        }

        p {
          margin: 0;
          color: #666;
        }
      }
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
      flex-wrap: wrap;

      a {
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;

        &.btn-primary {
          background: white;
          color: #667eea;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }
        }

        &.btn-secondary {
          border: 2px solid white;
          color: white;
          background: transparent;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
          }
        }
      }
    }

    .info-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 12px;
      color: #333;

      h2 {
        color: #667eea;
        margin-bottom: 1.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;

        li {
          padding: 0.75rem;
          font-size: 1rem;
          line-height: 1.6;
          color: #555;
        }
      }
    }

    .welcome-authenticated {
      max-width: 1200px;
      margin: 0 auto;
      color: white;

      .greeting {
        background: rgba(255, 255, 255, 0.1);
        padding: 2rem;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        margin-bottom: 2rem;
        text-align: center;

        h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
        }

        p {
          margin: 0;
          opacity: 0.9;
        }
      }

      .quick-access {
        h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.8rem;
        }

        .access-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;

          .access-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 12px;
            text-decoration: none;
            color: #333;
            text-align: center;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;

            &:hover {
              transform: translateY(-10px);
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .icon {
              font-size: 2.5rem;
            }

            .label {
              font-weight: 600;
              color: #667eea;
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .welcome-page {
        padding: 1rem;
      }

      .hero-section {
        h1 {
          font-size: 2rem;
        }

        .subtitle {
          font-size: 1rem;
        }
      }

      .cta-buttons {
        flex-direction: column;
        a {
          width: 100%;
          text-align: center;
        }
      }
    }
  `]
})
export class WelcomeComponent implements OnInit {
  utilisateurConnecte: Utilisateur | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.utilisateurConnecte = this.authService.getUtilisateurConnecte();
  }
}
