import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient.model';
import { PeutDesactiver } from '../../../../core/guards/auth.guard';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.scss',
})
export class PatientFormComponent implements OnInit, OnDestroy, PeutDesactiver {
  patientForm!: FormGroup;
  modeEdition = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.initialiserFormulaire();
    
    // Mode édition: charger les données du patient
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const patient = this.patientService.getPatientById(id);
      if (patient) {
        this.modeEdition = true;
        this.chargerPatient(patient);
      }
    }
  }

  private initialiserFormulaire(): void {
    this.patientForm = this.fb.group({
      // Identité
      nom: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: [null, [Validators.required, this.validateurDatePassee.bind(this)]],
      sexe: ['M', Validators.required],
      ins: ['', [Validators.required, Validators.pattern(/^[12][0-9]{12}$/)]],
      
      // Coordonnées
      telephone: ['', [Validators.required, Validators.pattern(/^0[1-9](\s?\d{2}){4}$/)]],
      email: ['', [Validators.email]],
      
      // Adresse
      adresse: this.fb.group({
        ligne1: ['', Validators.required],
        ligne2: [''],
        codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        ville: ['', Validators.required],
        pays: ['France', Validators.required],
      }),
      
      // Medical
      groupeSanguin: [''],
      medecinTraitantId: ['', Validators.required],
      statut: ['actif', Validators.required],
      niveauUrgence: ['vert'],
      antecedents: this.fb.array([]),
      allergies: this.fb.array([]),
    });
  }

  private chargerPatient(patient: Patient): void {
    this.patientForm.patchValue({
      nom: patient.nom,
      prenom: patient.prenom,
      dateNaissance: patient.dateNaissance,
      sexe: patient.sexe,
      ins: patient.ins,
      telephone: patient.telephone,
      email: patient.email,
      adresse: patient.adresse,
      groupeSanguin: patient.groupeSanguin,
      medecinTraitantId: patient.medecinTraitantId,
      statut: patient.statut,
      niveauUrgence: patient.niveauUrgence,
    });

    // Remplir les antécédents
    patient.antecedents.forEach(a => this.ajouterAntecedent(a));
    
    // Remplir les allergies
    patient.allergies.forEach(allergie => this.ajouterAllergie(allergie));
  }

  // FormArrays
  get antecedents(): FormArray {
    return this.patientForm.get('antecedents') as FormArray;
  }

  get allergies(): FormArray {
    return this.patientForm.get('allergies') as FormArray;
  }

  ajouterAntecedent(valeur = ''): void {
    this.antecedents.push(this.fb.control(valeur, Validators.required));
  }

  supprimerAntecedent(index: number): void {
    this.antecedents.removeAt(index);
  }

  ajouterAllergie(allergie?: any): void {
    this.allergies.push(
      this.fb.group({
        substance: [allergie?.substance ?? '', Validators.required],
        reaction: [allergie?.reaction ?? '', Validators.required],
        severite: [allergie?.severite ?? 'moderee', Validators.required],
        dateDeclaration: [allergie?.dateDeclaration ?? new Date(), Validators.required],
      })
    );
  }

  supprimerAllergie(index: number): void {
    this.allergies.removeAt(index);
  }

  // Validateur personnalisé: date dans le passé
  private validateurDatePassee(ctrl: AbstractControl) {
    if (!ctrl.value) return null;
    const dateValeur = new Date(ctrl.value);
    const dateAujourd = new Date();
    return dateValeur < dateAujourd ? null : { dateAvenir: true };
  }

  onSoumettre(): void {
    if (this.patientForm.valid) {
      const donneesPatient = this.patientForm.getRawValue();
      
      if (this.modeEdition) {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          const patientActuel = this.patientService.getPatientById(id);
          if (patientActuel) {
            this.patientService.mettreAJourPatient({
              ...patientActuel,
              ...donneesPatient
            });
          }
        }
      } else {
        this.patientService.ajouterPatient(donneesPatient);
      }
      
      this.router.navigate(['/patients']);
    } else {
      this.patientForm.markAllAsTouched();
    }
  }

  annuler(): void {
    this.router.navigate(['/patients']);
  }

  /**
   * Module 7 — CanDeactivate Guard
   * Retourne false si le formulaire a des modifications non sauvegardées
   */
  peutDesactiver(): boolean {
    return !this.patientForm?.dirty;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
