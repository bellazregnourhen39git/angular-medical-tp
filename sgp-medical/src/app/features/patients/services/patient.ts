import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { Patient, NiveauUrgence } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // État interne (mutable, privé)
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  private patientCourantSubject = new BehaviorSubject<Patient | null>(null);
  private chargementSubject = new BehaviorSubject<boolean>(false);

  // Observables publics (lecture seule)
  readonly patients$ = this.patientsSubject.asObservable();
  readonly patientCourant$ = this.patientCourantSubject.asObservable();
  readonly enChargement$ = this.chargementSubject.asObservable();

  // Flux dérivés avec opérateurs RxJS
  readonly patientsUrgents$ = this.patients$.pipe(
    map(pts => pts.filter(p => p.niveauUrgence === 'rouge' || p.niveauUrgence === 'orange')),
    distinctUntilChanged()
  );

  readonly statistiques$ = this.patients$.pipe(
    map(pts => ({
      total: pts.length,
      actifs: pts.filter(p => p.statut === 'actif').length,
      urgencesRouge: pts.filter(p => p.niveauUrgence === 'rouge').length,
      allergies: pts.filter(p => p.allergies.length > 0).length,
    }))
  );

  getPatients(): Patient[] {
    return [...this.patientsSubject.getValue()];
  }

  getPatientById(id: string): Patient | undefined {
    return this.patientsSubject.getValue().find(p => p.id === id);
  }

  definirPatientCourant(patient: Patient | null): void {
    this.patientCourantSubject.next(patient);
  }

  ajouterPatient(patient: Omit<Patient, 'id' | 'dateCreation' | 'dateDerniereModification'>): void {
    const nouveau: Patient = {
      ...patient,
      id: crypto.randomUUID(),
      dateCreation: new Date(),
      dateDerniereModification: new Date()
    };
    const current = this.patientsSubject.getValue();
    this.patientsSubject.next([...current, nouveau]);
  }

  mettreAJourPatient(updated: Patient): void {
    const patients = this.patientsSubject.getValue().map(
      p => p.id === updated.id ? { ...updated, dateDerniereModification: new Date() } : p
    );
    this.patientsSubject.next(patients);
    if (this.patientCourantSubject.getValue()?.id === updated.id) {
      this.patientCourantSubject.next(updated);
    }
  }

  modifierNiveauUrgence(id: string, niveau: NiveauUrgence): void {
    const patient = this.getPatientById(id);
    if (patient) this.mettreAJourPatient({ ...patient, niveauUrgence: niveau });
  }
}
