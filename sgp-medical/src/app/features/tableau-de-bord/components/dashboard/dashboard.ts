import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../patients/services/patient';
import { ConsultationService, Consultation } from '../../../consultations/services/consultation.service';
import { OrdonnanceService, Ordonnance } from '../../../ordonnances/services/ordonnance.service';
import { Patient } from '../../../patients/models/patient.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  stats = {
    totalPatients: 0,
    urgencesRouges: 0,
    urgencesOranges: 0,
    medecinsActifs: 42,
    consultationsAujourdhui: 0,
    ordonnancesPendantes: 0,
    tauxOccupation: 0
  };

  recentActivities: any[] = [];

  constructor(
    private patientService: PatientService,
    private consultationService: ConsultationService,
    private ordonnanceService: OrdonnanceService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Patients
    this.patientService.patients$.subscribe((patients: Patient[]) => {
      this.stats.totalPatients = patients.length;
      this.stats.urgencesRouges = patients.filter((p: Patient) => p.niveauUrgence === 'rouge').length;
      this.stats.urgencesOranges = patients.filter((p: Patient) => p.niveauUrgence === 'orange').length;
      this.stats.tauxOccupation = this.stats.totalPatients > 0 ? 85 : 0;
    });

    // Consultations
    this.consultationService.consultations$.subscribe((consultations: Consultation[]) => {
      const aujourd = new Date().toDateString();
      this.stats.consultationsAujourdhui = consultations.filter(
        (c: Consultation) => new Date(c.dateConsultation).toDateString() === aujourd
      ).length;
    });

    // Ordonnances
    this.ordonnanceService.ordonnances$.subscribe((ordonnances: Ordonnance[]) => {
      this.stats.ordonnancesPendantes = ordonnances.filter(
        (o: Ordonnance) => o.statut === 'en attente'
      ).length;
    });
  }
}

