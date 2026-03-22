import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2>Page non trouvée</h2>
        <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        
        <div class="error-illustration">
          🏥❌
        </div>

        <div class="actions">
          <a routerLink="/patients" class="btn-home">
            Retour à l'accueil
          </a>
          <button class="btn-back" (click)="goBack()">
            ← Retour
          </button>
        </div>

        <p class="hint">
          Si vous pensez que c'est une erreur, veuillez <a href="mailto:support@sgp-medical.fr">nous contacter</a>.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .not-found-content {
      background: white;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 400px;

      .error-code {
        font-size: 6rem;
        font-weight: 700;
        margin: 0;
        color: #667eea;
        line-height: 1;
      }

      h2 {
        font-size: 1.8rem;
        color: #333;
        margin: 1rem 0 0.5rem 0;
      }

      p {
        color: #666;
        margin-bottom: 1.5rem;
      }

      .error-illustration {
        font-size: 4rem;
        margin: 1.5rem 0;
      }

      .actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        margin: 2rem 0;

        a,
        button {
          padding: 0.875rem 1.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;

          &:hover {
            transform: translateY(-2px);
          }
        }

        .btn-home {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;

          &:hover {
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          }
        }

        .btn-back {
          background: #f0f0f0;
          color: #333;

          &:hover {
            background: #e0e0e0;
          }
        }
      }

      .hint {
        font-size: 0.9rem;
        color: #999;
        margin-top: 1rem;

        a {
          color: #667eea;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  `]
})
export class PageNotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}
