import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="inscription-page">
      <div class="inscription-container">
        <div class="inscription-card">
          <h1>🏥 SGP Medical</h1>
          <h2>Créer un compte</h2>

          <form [formGroup]="formulaireInscription" (ngSubmit)="onInscription()" class="inscription-form">
            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input
                id="prenom"
                type="text"
                formControlName="prenom"
                placeholder="Jean"
                class="form-control"
                [class.is-invalid]="isInvalid('prenom')"
              />
              <small *ngIf="hasError('prenom', 'required')">Le prénom est requis</small>
            </div>

            <div class="form-group">
              <label for="nom">Nom</label>
              <input
                id="nom"
                type="text"
                formControlName="nom"
                placeholder="Dupont"
                class="form-control"
                [class.is-invalid]="isInvalid('nom')"
              />
              <small *ngIf="hasError('nom', 'required')">Le nom est requis</small>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="medecin@hospital.fr"
                class="form-control"
                [class.is-invalid]="isInvalid('email')"
              />
              <small *ngIf="hasError('email', 'required')">L'email est requis</small>
              <small *ngIf="hasError('email', 'email')">Email invalide</small>
            </div>

            <div class="form-group">
              <label for="specialite">Spécialité</label>
              <select
                id="specialite"
                formControlName="specialite"
                class="form-control"
                [class.is-invalid]="isInvalid('specialite')"
              >
                <option value="">-- Sélectionner --</option>
                <option value="Médecine générale">Médecine générale</option>
                <option value="Cardiologie">Cardiologie</option>
                <option value="Dermatologie">Dermatologie</option>
                <option value="Pédiatrie">Pédiatrie</option>
                <option value="Psychiatrie">Psychiatrie</option>
                <option value="Chirurgie">Chirurgie</option>
              </select>
            </div>

            <div class="form-group">
              <label for="motdepasse">Mot de passe</label>
              <input
                id="motdepasse"
                type="password"
                formControlName="motDePasse"
                placeholder="••••••••"
                class="form-control"
                [class.is-invalid]="isInvalid('motDePasse')"
              />
              <small *ngIf="hasError('motDePasse', 'required')">Le mot de passe est requis</small>
              <small *ngIf="hasError('motDePasse', 'minlength')">Minimum 6 caractères</small>
            </div>

            <div class="form-group">
              <label for="confirmation">Confirmer le mot de passe</label>
              <input
                id="confirmation"
                type="password"
                formControlName="confirmationMotDePasse"
                placeholder="••••••••"
                class="form-control"
                [class.is-invalid]="isInvalid('confirmationMotDePasse')"
              />
              <small *ngIf="formulaireInscription.getError('passwordMismatch')">
                Les mots de passe ne correspondent pas
              </small>
            </div>

            <button
              type="submit"
              class="btn-inscription"
              [disabled]="formulaireInscription.invalid || enChargement"
            >
              {{ enChargement ? 'Inscription en cours...' : 'S\'inscrire' }}
            </button>
          </form>

          <div class="connexion-link">
            <p>Vous avez déjà un compte? <a routerLink="/connexion">Se connecter</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inscription-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .inscription-container {
      width: 100%;
      max-width: 450px;
      padding: 1rem;
    }

    .inscription-card {
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

    .inscription-form {
      .form-group {
        margin-bottom: 1rem;

        label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
        }

        input,
        select {
          width: 100%;
          padding: 0.675rem;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;

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
          color: #e74c3c;
          font-size: 0.8rem;

          &:not(.error) {
            color: #999;
          }
        }
      }
    }

    .btn-inscription {
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
      margin-top: 0.5rem;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .connexion-link {
      margin-top: 1.5rem;
      text-align: center;
      color: #666;

      a {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class InscriptionComponent implements OnInit {
  formulaireInscription!: FormGroup;
  enChargement = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Rediriger si déjà connecté
    if (this.authService.estConnecte()) {
      this.router.navigate(['/patients']);
    }
  }

  ngOnInit(): void {
    this.formulaireInscription = this.fb.group(
      {
        prenom: ['', [Validators.required, Validators.minLength(2)]],
        nom: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        specialite: ['', Validators.required],
        motDePasse: ['', [Validators.required, Validators.minLength(6)]],
        confirmationMotDePasse: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const motDePasse = control.get('motDePasse')?.value;
    const confirmationMotDePasse = control.get('confirmationMotDePasse')?.value;

    if (motDePasse === '' || confirmationMotDePasse === '') {
      return null;
    }

    return motDePasse === confirmationMotDePasse ? null : { passwordMismatch: true };
  }

  isInvalid(fieldName: string): boolean {
    const field = this.formulaireInscription.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.formulaireInscription.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  onInscription(): void {
    if (this.formulaireInscription.invalid) {
      this.notificationService.warning('Formulaire invalide', 'Veuillez corriger les erreurs');
      return;
    }

    this.enChargement = true;
    const donnees = this.formulaireInscription.value;

    setTimeout(() => {
      this.notificationService.success(
        'Inscription réussie',
        `Bienvenue Dr. ${donnees.prenom} ${donnees.nom}!`
      );
      this.router.navigate(['/connexion']);
    }, 1500);
  }
}
