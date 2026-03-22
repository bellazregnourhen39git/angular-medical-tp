import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export type StatutConsultation = 'programmée' | 'en cours' | 'terminée' | 'annulée';

export interface Consultation {
  id: string;
  patientId: string;
  medecinId: string;
  dateConsultation: Date;
  statut: StatutConsultation;
  motif: string;
  diagnostic: string;
  codesCIM10: string[];
  observations: string;
  traitements: string[];
  dateCreation: Date;
  dateDerniereModification: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private consultationsSubject = new BehaviorSubject<Consultation[]>([]);
  private consultationCouranteSubject = new BehaviorSubject<Consultation | null>(null);

  readonly consultations$ = this.consultationsSubject.asObservable();
  readonly consultationCourante$ = this.consultationCouranteSubject.asObservable();

  constructor() {
    this.initialiserDonneesFictives();
  }

  private initialiserDonneesFictives(): void {
    const consultationsFictives: Consultation[] = [
      {
        id: 'cons_001',
        patientId: 'pat_001',
        medecinId: 'med_001',
        dateConsultation: new Date(2026, 2, 20),
        statut: 'terminée',
        motif: 'Visite générale',
        diagnostic: 'Hypertension artérielle',
        codesCIM10: ['I10'],
        observations: 'Tension élevée, prescrire traitement',
        traitements: ['Lisinopril 10mg'],
        dateCreation: new Date(2026, 2, 1),
        dateDerniereModification: new Date(2026, 2, 20)
      },
      {
        id: 'cons_002',
        patientId: 'pat_002',
        medecinId: 'med_001',
        dateConsultation: new Date(2026, 2, 21),
        statut: 'en cours',
        motif: 'Suivi diabète',
        diagnostic: 'Diabète type 2 bien équilibré',
        codesCIM10: ['E11'],
        observations: 'Glycémie stable, continuer traitement',
        traitements: ['Metformine 500mg 2x/jour'],
        dateCreation: new Date(2026, 1, 15),
        dateDerniereModification: new Date(2026, 2, 21)
      },
      {
        id: 'cons_003',
        patientId: 'pat_003',
        medecinId: 'med_002',
        dateConsultation: new Date(2026, 2, 22),
        statut: 'programmée',
        motif: 'Consultation dermatologie',
        diagnostic: '',
        codesCIM10: [],
        observations: 'À faire',
        traitements: [],
        dateCreation: new Date(2026, 2, 10),
        dateDerniereModification: new Date(2026, 2, 10)
      }
    ];

    this.consultationsSubject.next(consultationsFictives);
  }

  readonly consultationsParPatient$ = (patientId: string): Observable<Consultation[]> => {
    return this.consultations$.pipe(
      map(c => c.filter(cons => cons.patientId === patientId)),
      distinctUntilChanged()
    );
  };

  getConsultations(): Consultation[] {
    return [...this.consultationsSubject.getValue()];
  }

  getConsultationById(id: string): Consultation | undefined {
    return this.consultationsSubject.getValue().find(c => c.id === id);
  }

  getConsultationsPatient(patientId: string): Consultation[] {
    return this.consultationsSubject.getValue().filter(c => c.patientId === patientId);
  }

  definirConsultationCourante(consultation: Consultation | null): void {
    this.consultationCouranteSubject.next(consultation);
  }

  ajouterConsultation(consultation: Omit<Consultation, 'id' | 'dateCreation' | 'dateDerniereModification'>): void {
    const nouvelle: Consultation = {
      ...consultation,
      id: 'cons_' + crypto.randomUUID(),
      dateCreation: new Date(),
      dateDerniereModification: new Date()
    };
    const current = this.consultationsSubject.getValue();
    this.consultationsSubject.next([...current, nouvelle]);
  }

  mettreAJourConsultation(updated: Consultation): void {
    const consultations = this.consultationsSubject.getValue().map(
      c => c.id === updated.id ? { ...updated, dateDerniereModification: new Date() } : c
    );
    this.consultationsSubject.next(consultations);
    if (this.consultationCouranteSubject.getValue()?.id === updated.id) {
      this.consultationCouranteSubject.next(updated);
    }
  }

  supprimerConsultation(id: string): void {
    const consultations = this.consultationsSubject.getValue().filter(c => c.id !== id);
    this.consultationsSubject.next(consultations);
  }
}
