import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export type StatutOrdonnance = 'en attente' | 'validée' | 'exécutée' | 'annulée';

export interface Medicament {
  nom: string;
  dosage: string;
  frequence: string;
  duree: string;
  notes?: string;
}

export interface Ordonnance {
  id: string;
  patientId: string;
  medecinId: string;
  dateOrdonnance: Date;
  statut: StatutOrdonnance;
  medicaments: Medicament[];
  observations: string;
  dureeValidite: number; // en jours
  dateCreation: Date;
  dateDerniereModification: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdonnanceService {
  private ordonnancesSubject = new BehaviorSubject<Ordonnance[]>([]);
  private ordonnanceCouranteSubject = new BehaviorSubject<Ordonnance | null>(null);

  readonly ordonnances$ = this.ordonnancesSubject.asObservable();
  readonly ordonnanceCourante$ = this.ordonnanceCouranteSubject.asObservable();

  constructor() {
    this.initialiserDonneesFictives();
  }

  private initialiserDonneesFictives(): void {
    const ordonnancesFictives: Ordonnance[] = [
      {
        id: 'ord_001',
        patientId: 'pat_001',
        medecinId: 'med_001',
        dateOrdonnance: new Date(2026, 2, 20),
        statut: 'validée',
        medicaments: [
          { nom: 'Lisinopril', dosage: '10mg', frequence: '1x/jour', duree: '3 mois', notes: 'Matin' },
          { nom: 'Hydrochlorothiazide', dosage: '25mg', frequence: '1x/jour', duree: '3 mois', notes: 'Matin' }
        ],
        observations: 'Suivi TA chaque semaine',
        dureeValidite: 90,
        dateCreation: new Date(2026, 2, 20),
        dateDerniereModification: new Date(2026, 2, 20)
      },
      {
        id: 'ord_002',
        patientId: 'pat_002',
        medecinId: 'med_001',
        dateOrdonnance: new Date(2026, 2, 1),
        statut: 'exécutée',
        medicaments: [
          { nom: 'Metformine', dosage: '500mg', frequence: '2x/jour', duree: '6 mois', notes: 'Avec les repas' }
        ],
        observations: 'Diabète type 2 équilibré',
        dureeValidite: 180,
        dateCreation: new Date(2026, 1, 15),
        dateDerniereModification: new Date(2026, 2, 1)
      },
      {
        id: 'ord_003',
        patientId: 'pat_003',
        medecinId: 'med_002',
        dateOrdonnance: new Date(2026, 2, 22),
        statut: 'en attente',
        medicaments: [
          { nom: 'Crème hydratante', dosage: '50ml', frequence: '2x/jour', duree: '4 semaines', notes: 'Matin et soir' }
        ],
        observations: 'Dermatite sèche',
        dureeValidite: 30,
        dateCreation: new Date(2026, 2, 22),
        dateDerniereModification: new Date(2026, 2, 22)
      }
    ];

    this.ordonnancesSubject.next(ordonnancesFictives);
  }

  readonly ordonnancesParPatient$ = (patientId: string): Observable<Ordonnance[]> => {
    return this.ordonnances$.pipe(
      map(o => o.filter(ord => ord.patientId === patientId)),
      distinctUntilChanged()
    );
  };

  getOrdonnances(): Ordonnance[] {
    return [...this.ordonnancesSubject.getValue()];
  }

  getOrdonnanceById(id: string): Ordonnance | undefined {
    return this.ordonnancesSubject.getValue().find(o => o.id === id);
  }

  getOrdonnancesPatient(patientId: string): Ordonnance[] {
    return this.ordonnancesSubject.getValue().filter(o => o.patientId === patientId);
  }

  definirOrdonnanceCourante(ordonnance: Ordonnance | null): void {
    this.ordonnanceCouranteSubject.next(ordonnance);
  }

  ajouterOrdonnance(ordonnance: Omit<Ordonnance, 'id' | 'dateCreation' | 'dateDerniereModification'>): void {
    const nouvelle: Ordonnance = {
      ...ordonnance,
      id: 'ord_' + crypto.randomUUID(),
      dateCreation: new Date(),
      dateDerniereModification: new Date()
    };
    const current = this.ordonnancesSubject.getValue();
    this.ordonnancesSubject.next([...current, nouvelle]);
  }

  mettreAJourOrdonnance(updated: Ordonnance): void {
    const ordonnances = this.ordonnancesSubject.getValue().map(
      o => o.id === updated.id ? { ...updated, dateDerniereModification: new Date() } : o
    );
    this.ordonnancesSubject.next(ordonnances);
    if (this.ordonnanceCouranteSubject.getValue()?.id === updated.id) {
      this.ordonnanceCouranteSubject.next(updated);
    }
  }

  supprimerOrdonnance(id: string): void {
    const ordonnances = this.ordonnancesSubject.getValue().filter(o => o.id !== id);
    this.ordonnancesSubject.next(ordonnances);
  }

  changerStatutOrdonnance(id: string, statut: StatutOrdonnance): void {
    const ordonnance = this.getOrdonnanceById(id);
    if (ordonnance) {
      this.mettreAJourOrdonnance({ ...ordonnance, statut });
    }
  }
}
