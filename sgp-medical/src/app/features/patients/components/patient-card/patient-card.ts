import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { SensitiveDataDirective } from '../../../../shared/directives/medical.directive';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [CommonModule, RouterModule, SensitiveDataDirective],
  templateUrl: './patient-card.html',
  styleUrl: './patient-card.scss',
})
export class PatientCardComponent implements OnInit, OnDestroy {
  @Input() patient!: Patient;
  @Input() showSensitiveData = false;
  @Output() patientSelected = new EventEmitter<Patient>();
  @Output() urgenceSignalee = new EventEmitter<{ patient: Patient; motif: string }>();

  private destroy$ = new Subject<void>();

  get age(): number {
    const now = new Date();
    const birth = new Date(this.patient.dateNaissance);
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  get initiales(): string {
    return `${this.patient.prenom[0]}${this.patient.nom[0]}`.toUpperCase();
  }

  ngOnInit(): void {
    console.log('Fiche patient initialisée :', this.patient.ins);
  }

  signalerUrgence(motif: string): void {
    this.urgenceSignalee.emit({ patient: this.patient, motif });
  }

  onPatientClick(): void {
    this.patientSelected.emit(this.patient);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
