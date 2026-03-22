import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient';
import { AuditService } from '../../../../core/services/audit.service';
import { PatientApiService } from '../../services/patient-api.service';
import { PatientCardComponent } from '../patient-card/patient-card';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PatientCardComponent],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.scss',
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  patient?: Patient;
  ongletActif = 'dossier';
  enChargementConstantes = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private auditService: AuditService,
    private patientApiService: PatientApiService   // Module 9: FHIR API
  ) {}

  ngOnInit(): void {
    // Module 7: Lire les paramètres de la route (:id)
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');

        if (id) {
          this.patient = this.patientService.getPatientById(id);

          if (this.patient) {
            // Module 6 / HDS — Journalisation OBLIGATOIRE de chaque consultation
            this.auditService.log(
              'CONSULTATION_DOSSIER',
              id,
              `Accès dossier patient: ${this.patient.nom} ${this.patient.prenom}`
            );

            // Définir comme patient courant dans le service
            this.patientService.definirPatientCourant(this.patient);

            // Module 9: Charger les constantes vitales depuis l'API FHIR (mode démo = []
            this.enChargementConstantes = true;
            this.patientApiService.getConstantesVitales(id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: constantes => {
                  this.enChargementConstantes = false;
                  // En mode démo, les constantes FHIR sont vides — on utilise dernieresConstantes du patient local
                  console.log('[FHIR] Constantes vitales reçues:', constantes);
                },
                error: err => {
                  this.enChargementConstantes = false;
                  console.warn('[FHIR] API indisponible (mode démo):', err.message);
                }
              });
          } else {
            // Patient introuvable
            this.auditService.log('ACCES_REFUSE', id, 'Patient non trouvé', 'refusé');
            this.router.navigate(['/patients']);
          }
        }
      });

    // Module 7: Lire les query params pour l'onglet actif
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(q => {
        this.ongletActif = q.get('onglet') ?? 'dossier';
      });
  }

  /**
   * Module 7: Changer d'onglet en mettant à jour les query params
   */
  changerOnglet(onglet: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { onglet },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Modifier le patient — navigation vers le formulaire d'édition
   */
  modifierPatient(): void {
    if (this.patient) {
      this.router.navigate(['/patients', this.patient.id, 'modifier']);
    }
  }

  /**
   * Revenir à la liste des patients
   */
  retourner(): void {
    this.router.navigate(['/patients']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
