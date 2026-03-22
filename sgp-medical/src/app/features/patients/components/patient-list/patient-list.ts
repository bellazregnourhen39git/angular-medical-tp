import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient';
import { PatientCardComponent } from '../patient-card/patient-card';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PatientCardComponent],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss',
})
export class PatientListComponent implements OnInit, OnDestroy {
  patients: Patient[] = [];
  patientsFiltres: Patient[] = [];
  recherche = '';
  filtreUrgence = '';
  currentUser = { role: 'medecin' }; // Simulation

  private destroy$ = new Subject<void>();

  constructor(private router: Router, private patientService: PatientService) {}

  creerNouveauPatient(): void {
    this.router.navigate(['/patients','nouveau']);
  }

  ngOnInit(): void {
    // Charger les données fictives pour la démo
    this.chargerDonneesFictives();

    // S'abonner aux changements de patients
    this.patientService.patients$
      .pipe(takeUntil(this.destroy$))
      .subscribe((patients: Patient[]) => {
        this.patients = patients;
        this.appliquerFiltres();
      });
  }

  private chargerDonneesFictives(): void {
    const patientsFictifs: Omit<Patient, 'id' | 'dateCreation' | 'dateDerniereModification'>[] = [
      {
        ins: '185061207504712',
        nom: 'DUPONT',
        prenom: 'Jean',
        dateNaissance: new Date('1985-06-12'),
        sexe: 'M',
        groupeSanguin: 'A+',
        adresse: {
          ligne1: '15 rue de la Santé',
          codePostal: '75001',
          ville: 'Paris',
          pays: 'France'
        },
        telephone: '0612345678',
        email: 'jean.dupont@email.com',
        medecinTraitantId: 'med001',
        statut: 'actif',
        niveauUrgence: 'vert',
        allergies: [
          {
            substance: 'Penicilline',
            reaction: 'Urticaire',
            severite: 'moderee',
            dateDeclaration: new Date('2020-03-15')
          }
        ],
        antecedents: ['Hypertension artérielle'],
        traitementEnCours: ['Lisinopril 10mg'],
        dernieresConstantes: {
          tensionSystolique: 140,
          tensionDiastolique: 85,
          frequenceCardiaque: 72,
          temperature: 36.8,
          saturationO2: 98,
          poids: 75,
          taille: 175,
          dateMesure: new Date()
        }
      },
      {
        ins: '285071308504813',
        nom: 'MARTIN',
        prenom: 'Marie',
        dateNaissance: new Date('1975-07-13'),
        sexe: 'F',
        groupeSanguin: 'O-',
        adresse: {
          ligne1: '25 avenue des Hôpitaux',
          codePostal: '69000',
          ville: 'Lyon',
          pays: 'France'
        },
        telephone: '0712345678',
        email: 'marie.martin@email.com',
        medecinTraitantId: 'med002',
        statut: 'actif',
        niveauUrgence: 'orange',
        allergies: [],
        antecedents: ['Diabète type 2'],
        traitementEnCours: ['Metformine 500mg'],
        dernieresConstantes: {
          tensionSystolique: 160,
          tensionDiastolique: 95,
          frequenceCardiaque: 85,
          temperature: 37.2,
          saturationO2: 95,
          poids: 68,
          taille: 165,
          dateMesure: new Date()
        }
      }
    ];

    patientsFictifs.forEach(patient => this.patientService.ajouterPatient(patient));
  }

  appliquerFiltres(): void {
    let filtres = [...this.patients];

    // Filtre de recherche
    if (this.recherche) {
      const rechercheLower = this.recherche.toLowerCase();
      filtres = filtres.filter(p =>
        p.nom.toLowerCase().includes(rechercheLower) ||
        p.prenom.toLowerCase().includes(rechercheLower) ||
        p.ins.includes(this.recherche)
      );
    }

    // Filtre d'urgence
    if (this.filtreUrgence) {
      filtres = filtres.filter(p => p.niveauUrgence === this.filtreUrgence);
    }

    this.patientsFiltres = filtres;
  }

  onRechercheChange(): void {
    this.appliquerFiltres();
  }

  onFiltreUrgenceChange(): void {
    this.appliquerFiltres();
  }

  onPatientSelectionne(patient: Patient): void {
    this.router.navigate(['/patients', patient.id]);
  }

  onUrgence(data: { patient: Patient; motif: string }): void {
    console.log('URGENCE signalée:', data);
    // Logique de gestion d'urgence
  }

  trackByPatientId(index: number, patient: Patient): string {
    return patient.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
