import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Patient, ConstantesVitales } from '../models/patient.model';

/**
 * Interface pour les bundles FHIR
 */
export interface FhirBundle<T> {
  resourceType: string;
  type: string;
  total?: number;
  entry?: Array<{
    resource: T;
  }>;
}

/**
 * Ressource FHIR Patient
 */
export interface FhirPatient {
  resourceType: string;
  id: string;
  identifier?: Array<{
    system: string;
    value: string;
  }>;
  name?: Array<{
    family: string;
    given: string[];
  }>;
  birthDate: string;
  gender: string;
  telecom?: Array<{
    system: string;
    value: string;
  }>;
  address?: Array<{
    line: string[];
    postalCode: string;
    city: string;
    country: string;
  }>;
}

/**
 * Ressource FHIR Observation (constantes vitales)
 */
export interface FhirObservation {
  resourceType: string;
  id: string;
  value?: {
    value: number;
    unit: string;
  };
  effectiveDateTime: string;
}

/**
 * Service d'intégration FHIR R4
 * Consomme des API REST conformes HL7 FHIR
 * En production: https://api.fhir.sante.gouv.fr/r4
 */
@Injectable({
  providedIn: 'root'
})
export class PatientApiService {
  private readonly fhirBaseUrl = 'https://api.fhir.sante.gouv.fr/r4';
  
  // Pour la démo, on simule les endpoints
  private readonly mockMode = true;

  constructor(private http: HttpClient) {}

  /**
   * Rechercher des patients (filtres FHIR)
   * GET /Patient?family=Dupont&given=Jean&birthdate=ge1950-01-01&_count=20
   */
  rechercherPatients(params: {
    nom?: string;
    prenom?: string;
    dateNaissance?: string;
    _count?: number;
  }): Observable<Patient[]> {
    if (this.mockMode) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    let httpParams = new HttpParams();
    if (params.nom) httpParams = httpParams.set('family', params.nom);
    if (params.prenom) httpParams = httpParams.set('given', params.prenom);
    if (params.dateNaissance) httpParams = httpParams.set('birthdate', params.dateNaissance);
    httpParams = httpParams.set('_count', params._count ?? 20);

    return this.http.get<FhirBundle<FhirPatient>>(`${this.fhirBaseUrl}/Patient`, { params: httpParams })
      .pipe(
        map(bundle => bundle.entry?.map(e => this.fhirVersPatient(e.resource)) ?? []),
        retry(2),
        catchError(err => this.gererErreur(err))
      );
  }

  /**
   * Récupérer un patient par ID
   * GET /Patient/:id
   */
  getDossierPatient(id: string): Observable<Patient> {
    if (this.mockMode) {
      return new Observable(observer => {
        observer.error(new Error('Mode démo: utiliser PatientService.getPatientById()'));
      });
    }

    return this.http.get<FhirPatient>(`${this.fhirBaseUrl}/Patient/${id}`)
      .pipe(
        map(fhir => this.fhirVersPatient(fhir)),
        catchError(err => this.gererErreur(err))
      );
  }

  /**
   * Récupérer les constantes vitales d'un patient
   * GET /Observation?patient=:id&category=vital-signs&_sort=-date&_count=10
   */
  getConstantesVitales(patientId: string): Observable<ConstantesVitales[]> {
    if (this.mockMode) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const params = new HttpParams()
      .set('patient', patientId)
      .set('category', 'vital-signs')
      .set('_sort', '-date')
      .set('_count', '10');

    return this.http.get<FhirBundle<FhirObservation>>(`${this.fhirBaseUrl}/Observation`, { params })
      .pipe(
        map(bundle => bundle.entry?.map(e => this.fhirVersConstantes(e.resource)) ?? []),
        catchError(err => this.gererErreur(err))
      );
  }

  /**
   * Créer un patient
   * POST /Patient
   */
  creerPatient(patient: Patient): Observable<Patient> {
    if (this.mockMode) {
      return new Observable(observer => {
        observer.next(patient);
        observer.complete();
      });
    }

    const fhirPatient = this.patientVersFhir(patient);
    return this.http.post<FhirPatient>(`${this.fhirBaseUrl}/Patient`, fhirPatient)
      .pipe(
        map(fhir => this.fhirVersPatient(fhir)),
        catchError(err => this.gererErreur(err))
      );
  }

  /**
   * Mettre à jour un patient
   * PUT /Patient/:id
   */
  mettreAJourPatient(patient: Patient): Observable<Patient> {
    if (this.mockMode) {
      return new Observable(observer => {
        observer.next(patient);
        observer.complete();
      });
    }

    const fhirPatient = this.patientVersFhir(patient);
    return this.http.put<FhirPatient>(`${this.fhirBaseUrl}/Patient/${patient.id}`, fhirPatient)
      .pipe(
        map(fhir => this.fhirVersPatient(fhir)),
        catchError(err => this.gererErreur(err))
      );
  }

  /**
   * Convertir FHIR Patient → Patient local
   */
  private fhirVersPatient(fhir: FhirPatient): Patient {
    return {
      id: fhir.id,
      ins: fhir.identifier?.find(i => i.system === 'urn:oid:1.2.250.1.213.1.4.8')?.value ?? '',
      nom: fhir.name?.[0]?.family ?? '',
      prenom: fhir.name?.[0]?.given?.[0] ?? '',
      dateNaissance: new Date(fhir.birthDate),
      sexe: (fhir.gender === 'male' ? 'M' : fhir.gender === 'female' ? 'F' : 'U') as any,
      adresse: {
        ligne1: fhir.address?.[0]?.line?.[0] ?? '',
        codePostal: fhir.address?.[0]?.postalCode ?? '',
        ville: fhir.address?.[0]?.city ?? '',
        pays: fhir.address?.[0]?.country ?? 'France',
      },
      telephone: fhir.telecom?.find(t => t.system === 'phone')?.value ?? '',
      email: fhir.telecom?.find(t => t.system === 'email')?.value,
      medecinTraitantId: '',
      statut: 'actif',
      allergies: [],
      antecedents: [],
      traitementEnCours: [],
      dateCreation: new Date(),
      dateDerniereModification: new Date(),
    } as Patient;
  }

  /**
   * Convertir Patient local → FHIR Patient
   */
  private patientVersFhir(patient: Patient): FhirPatient {
    return {
      resourceType: 'Patient',
      id: patient.id,
      identifier: [
        {
          system: 'urn:oid:1.2.250.1.213.1.4.8', // OID INS (Identité Nationale de Santé)
          value: patient.ins,
        }
      ],
      name: [
        {
          family: patient.nom,
          given: [patient.prenom],
        }
      ],
      birthDate: patient.dateNaissance instanceof Date
        ? patient.dateNaissance.toISOString().split('T')[0]
        : new Date(patient.dateNaissance).toISOString().split('T')[0],
      gender: patient.sexe === 'M' ? 'male' : patient.sexe === 'F' ? 'female' : 'unknown',
      telecom: [
        {
          system: 'phone',
          value: patient.telephone,
        },
        ...(patient.email
          ? [{
              system: 'email' as const,
              value: patient.email,
            }]
          : [])
      ],
      address: [
        {
          line: [patient.adresse.ligne1],
          postalCode: patient.adresse.codePostal,
          city: patient.adresse.ville,
          country: patient.adresse.pays,
        }
      ],
    };
  }

  /**
   * Convertir FHIR Observation → ConstantesVitales
   */
  private fhirVersConstantes(fhir: FhirObservation): ConstantesVitales {
    return {
      saturationO2: fhir.value?.value,
      dateMesure: new Date(fhir.effectiveDateTime),
    } as ConstantesVitales;
  }

  /**
   * Gestion centralisée des erreurs FHIR
   */
  private gererErreur(error: any): Observable<never> {
    let message = 'Erreur serveur inattendue';

    if (error.status === 0) {
      message = 'Connexion impossible au serveur FHIR';
    } else if (error.status === 400) {
      message = 'Requête invalide (paramètres FHIR mal formés)';
    } else if (error.status === 401) {
      message = 'Session expirée - reconnectez-vous';
    } else if (error.status === 403) {
      message = 'Accès refusé - droits insuffisants';
    } else if (error.status === 404) {
      message = 'Ressource FHIR introuvable';
    } else if (error.status === 422) {
      message = 'Données invalides pour la ressource FHIR';
    }

    console.error('[PatientApiService] FHIR Error:', error, message);
    return throwError(() => new Error(message));
  }
}
