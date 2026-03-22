import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="connexion-page">
      <div class="connexion-container">
        <div class="connexion-card">
          <h1>🏥 SGP Medical</h1>
          <h2>Connexion</h2>

          <form [formGroup]="formulaireConnexion" (ngSubmit)="onConnexion()" class="connexion-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="medecin@hospital.fr"
                class="form-control"
                [class.is-invalid]="formulaireConnexion.get('email')?.invalid && formulaireConnexion.get('email')?.touched"
              />
              <small>Pour la démo: medecin@* → accès médecin, admin@* → accès admin</small>
            </div>

            <div class="form-group">
              <label for="motdepasse">Mot de passe</label>
              <input
                id="motdepasse"
                type="password"
                formControlName="motDePasse"
                placeholder="••••••••"
                class="form-control"
                [class.is-invalid]="formulaireConnexion.get('motDePasse')?.invalid && formulaireConnexion.get('motDePasse')?.touched"
              />
              <small>Minimum 3 caractères</small>
            </div>

            <button
              type="submit"
              class="btn-connexion"
              [disabled]="formulaireConnexion.invalid || enChargement"
            >
              {{ enChargement ? 'Connexion en cours...' : 'Se connecter' }}
            </button>
          </form>

          <div class="demo-info">
            <p><strong>Identifiants de démo:</strong></p>
            <ul>
              <li>medecin@hospital.fr / password → Accès médecin</li>
              <li>admin@hospital.fr / admin123 → Accès admin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .connexion-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .connexion-container {
      width: 100%;
      max-width: 400px;
      padding: 1rem;
    }

    .connexion-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);

      h1 {
        text-align: center;
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
      }

      h2 {
        text-align: center;
        color: #666;
        margin: 0 0 1.5rem 0;
        font-size: 1.3rem;
      }
    }

    .connexion-form {
      .form-group {
        margin-bottom: 1.5rem;

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;

          &:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          &.is-invalid {
            border-color: #e74c3c;
          }
        }

        small {
          display: block;
          margin-top: 0.25rem;
          color: #999;
          font-size: 0.85rem;
        }
      }
    }

    .btn-connexion {
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .demo-info {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f0f8ff;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      font-size: 0.9rem;
      color: #0d47a1;

      p {
        margin: 0 0 0.5rem 0;
        font-weight: 600;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin: 0.25rem 0;
          padding-left: 1.5rem;
          position: relative;

          &::before {
            content: '→';
            position: absolute;
            left: 0;
          }
        }
      }
    }
  `]
})
export class ConnexionComponent implements OnInit {
  formulaireConnexion!: FormGroup;
  enChargement = false;
  returnUrl = '/patients';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Rediriger si déjà connecté
    if (this.authService.estConnecte()) {
      this.router.navigate(['/patients']);
    }
  }

  ngOnInit(): void {
    this.formulaireConnexion = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/patients';
  }

  onConnexion(): void {
    if (this.formulaireConnexion.invalid) return;

    this.enChargement = true;
    const { email, motDePasse } = this.formulaireConnexion.value;

    this.authService.connexion(email, motDePasse).subscribe({
      next: () => {
        this.notificationService.success('Connexion réussie', `Bienvenue!`);
        this.router.navigate([this.returnUrl]);
      },
      error: () => {
        this.notificationService.erreur('Erreur de connexion', 'Email ou mot de passe incorrect');
        this.enChargement = false;
      }
    });
  }
}
