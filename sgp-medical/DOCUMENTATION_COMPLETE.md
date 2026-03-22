# 🏥 SGP Medical - Système de Gestion de Patients

## 📋 Description
SGP Medical est une application Angular 21 complète pour la gestion administrative et médicale des patients. Elle couvre les 9 modules du workshop Angular 101 avec une architecture production-ready axée sur la sécurité et la conformité HDS/RGPD.

## ✅ Modules Implémentés

### **Module 1: HTML/CSS Fondateurs**
- Templates Angel responsive avec SCSS
- Design mobile-first avec média queries
- Composants stylisés (cards, forms, badges, alerts)

### **Module 2: TypeScript Avancé**
- Classes et interfaces strictes
- Types génériques et unions
- Pattern RxJS avec Observables/BehaviorSubjects

### **Module 3: Directives personnalisées (Module 5)**
- `SensitiveDataDirective`: Masquage de données sensibles (INS, email)
- `AffichageRoleDirective`: Affichage conditionnel par rôle
- `RoleBadgeDirective`: Badges colorés pour les rôles utilisateur

### **Module 4: Pipes personnalisés**
- `AgePipe`: Calcule l'âge depuis la date de naissance
- `InsFormatPipe`: Formate les numéros INS (13 chiffres)
- `Cim10Pipe`: Traduit les codes CIM-10 (60+ codes médicaux)

### **Module 5: Directives & Pipes** ✅
- SensitiveDataDirective avec toggle affichage
- AffichageRoleDirective pour RBAC
- Cim10Pipe avec recherche par mots-clés

### **Module 6: Services & Dépendances Avancées** ✅
#### **AuthService**
- Gestion session utilisateur avec JWT (simulation)
- Timeout inactivité (15 minutes)
- Role-based access control (admin, médecin, infirmier, réceptionniste)
- Token persistence en localStorage

#### **AuditService**
- Logging HDS/RGPD compliant
- Enregistre: action, userId, patientId, timestamp, statut
- Export JSON des logs
- Max 100 logs conservés en mémoire

#### **NotificationService**
- Multi-type notifications (info, success, warning, erreur, urgence)
- Auto-dismiss configurable
- Intégration NotificationToastComponent
- Action callbacks support

#### **PatientService**
- CRUD sur patients avec Observables
- Fixtures de 5 patients demo
- Calcul urgence et constantes vitales

#### **ConsultationService**
- Gestion consultations avec statuts (programmée, en cours, terminée, annulée)
- Lien patient-consultation
- Fixtures de 3 consultations demo

#### **OrdonnanceService**
- Gestion prescriptions avec Medicament interface
- Statuts: en attente, validée, exécutée, annulée
- Fixtures de 3 ordonnances demo
- changerStatutOrdonnance() method

#### **PatientApiService**
- Intégration FHIR R4 REST API
- Méthodes: rechercherPatients(), getDossierPatient(), getConstantesVitales(), creerPatient(), mettreAJourPatient()
- Mock mode pour développement
- Conversion FHIR ↔ Patient bidirectionnelle

### **Module 7: Routing & Gardes** ✅
#### **Routes**
- Lazy-loading des modules (patients, consultations, ordonnances, tableau-de-bord)
- Parameterized routes: `/patients/:id`, `/patients/:id/modifier`
- Query params: `/patients/:id?onglet=consultations`
- Wildcard route: `**` → `/404`

#### **Gardes (Guards)**
- `authGuard`: Vérifie authentification avant accès
- `roleGuard`: RBAC - vérifie rôles requis
- `dejaCnxGuard`: Redirige si déjà authentifié (logout prevention)

#### **Components**
- **PatientDetailComponent**: Vue complète dossier patient avec onglets
- **ConnexionComponent**: Login avec email/password validé
- **InscriptionComponent**: Registration avec validation FormBuilder
- **WelcomeComponent**: Landing page avec info marketing
- **PageNotFoundComponent**: 404 friendly

### **Module 8: Formulaires Réactifs** ✅
#### **PatientFormComponent**
- FormBuilder avec FormGroup + FormArray pour allergies/antécédents
- Validateurs personnalisés: validateurDatePassee()
- Patterns: INS (13 chiffres), phone (10-11 chiffres), email
- Mode créer/modifier détecté via ActivatedRoute
- Sections organisées: Identité, Coordonnées, Adresse, Données Médicales, Antécédents, Allergies

#### **ConnexionComponent**
- FormBuilder email + password
- Validation email format, minLength(3)

#### **InscriptionComponent**
- FormGroup avec FormArray pour spécialités
- Password match validator custom à niveau form group
- RxJS subscription avec takeUntil pattern

### **Module 9: HTTP & Intercepteurs** ✅
#### **AuthInterceptor**
- Injection automatique Bearer token à tous les requests
- Gestion 401 (session expirée) → redirige /connexion
- Gestion 403 (forbidden) → affiche notification erreur
- Intégré dans appConfig

#### **AuditInterceptor**
- Logs tous les requests HTTP (GET, POST, PUT, PATCH)
- Extraction patientId depuis URL
- Enregistrement timing + status
- Trigger audit.log() via AuditService

#### **HttpClient Setup**
- `provideHttpClient()` dans appConfig
- Enregistrement des 2 intercepteurs via HTTP_INTERCEPTORS

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- npm 9+
- Angular CLI 21

### Installation
```bash
cd sgp-medical
npm install
ng serve
```

Accédez à `http://localhost:4200/`

### Test Login
```
Email: medecin@hospital.fr (ou admin@hospital.fr)
Mot de passe: password (ou admin123)
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts (authGuard, roleGuard, dejaCnxGuard)
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── audit.interceptor.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts (JWT, session timeout)
│   │   │   ├── audit.service.ts (HDS/RGPD logs)
│   │   │   └── notification.service.ts (multi-type notifications)
│   │   └── models/
│   │       └── utilisateur.model.ts
│   ├── features/
│   │   ├── patients/
│   │   │   ├── components/
│   │   │   │   ├── patient-list/ (searchable, filterable)
│   │   │   │   ├── patient-card/ (reusable card with urgency)
│   │   │   │   ├── patient-form/ (ReactiveFormsModule, FormArray)
│   │   │   │   └── patient-detail/ (tabbed interface)
│   │   │   ├── services/
│   │   │   │   ├── patient.ts (CRUD, fixtures)
│   │   │   │   └── patient-api.ts (FHIR R4 integration)
│   │   │   └── models/
│   │   │       └── patient.model.ts
│   │   ├── consultations/
│   │   │   ├── components/
│   │   │   │   └── consultation-list/ (statut filters)
│   │   │   ├── services/
│   │   │   │   └── consultation.service.ts (fixtures)
│   │   │   └── models/
│   │   │       └── consultation.model.ts
│   │   ├── ordonnances/
│   │   │   ├── components/
│   │   │   │   └── ordonnance-list/ (Medicament management)
│   │   │   ├── services/
│   │   │   │   └── ordonnance.service.ts (fixtures)
│   │   │   └── models/
│   │   │       └── ordonnance.model.ts
│   │   └── tableau-de-bord/
│   │       └── components/
│   │           └── dashboard/ (KPIs, charts, alerts)
│   ├── shared/
│   │   ├── components/
│   │   │   ├── navbar/ (sticky, responsive)
│   │   │   └── notification-toast/ (floating notifications)
│   │   ├── directives/
│   │   │   └── medical.directive.ts (3 directives)
│   │   └── pipes/
│   │       ├── age-pipe.ts
│   │       ├── ins-format-pipe.ts
│   │       └── cim10.pipe.ts (60+ medical codes)
│   ├── pages/
│   │   ├── connexion/ (login page)
│   │   ├── inscription/ (registration page)
│   │   ├── welcome/ (landing page)
│   │   └── page-not-found/ (404 page)
│   ├── app.routes.ts (lazy-loading, guards, catch-all)
│   ├── app.config.ts (HTTP, interceptors)
│   ├── app.ts (root component)
│   └── app.scss (global styles, CSS variables)
└── index.html
```

## 🔒 Sécurité & Conformité

### HDS/RGPD
- ✅ Audit logging de tous les accès (AuditService)
- ✅ JWT token-based authentication
- ✅ Session timeout (15 min inactivité)
- ✅ Role-Based Access Control
- ✅ Masquage données sensibles (INS, email)

### Validation
- ✅ FormBuilder avec Validators (minLength, pattern, required)
- ✅ Custom validators (validateurDatePassee, passwordMatch)
- ✅ HTTP error handling (401, 403, 404, 422)
- ✅ FHIR R4 compliance checks

## 📊 Features Démontratives

### PatientCard
- Affiche patient avec urgence color-coded (rouge, orange, jaune, vert)
- Âge calculé via AgePipe
- Initiales badge
- Données sensibles masquables (SensitiveDataDirective)
- Click → Navigation vers détail patient

### PatientForm
- ReactiveFormsModule complet
- Sections: Identité, Coordonnées, Adresse, Medical, Antécédents, Allergies
- FormArray pour dynamique ajout/suppression
- Validation: INS 13 chiffres, phone, email, date in past
- Mode auto-détecté (create vs edit)

### Dashboard (Admin only)
- KPIs: Total patients, Urgences rouges/oranges, occupations des services
- Graphiques: Taux occupation, distribution urgences
- Alertes urgentes avec badges colorés
- Responsive grid layout

### Consultation & Ordonnance Lists
- Searchable par patient/motif
- Filtrable par statut
- Status badge color-coded
- Detail buttons + edit + change statut dropdown

## 🛠️ Technologie Stack

| Couche | Tech |
|--------|------|
| **Framework** | Angular 21 (standalone components) |
| **Langage** | TypeScript 5+ (strict mode) |
| **Styling** | SCSS avec variables CSS |
| **Forms** | ReactiveFormsModule (FormBuilder, FormArray) |
| **HTTP** | HttpClient avec 2 interceptors |
| **Reactive** | RxJS 7 (Observables, BehaviorSubject, takeUntil) |
| **Routing** | Lazy-loading, parameterized routes, guards |
| **Storage** | localStorage (tokens, utilisateur) |
| **API** | FHIR R4 (simulation + ready for real endpoint) |

## 📝 Données de Test

**Utilisateurs** (simulation):
- `medecin@hospital.fr` / `password` → Accès médecin
- `admin@hospital.fr` / `admin123` → Accès admin

**Patients** (fixtures auto-chargées):
1. DUPONT Jean - INS 185061207504710 - URGENCE ROUGE
2. MARTIN Marie - INS 264011801234567 - URGENCE ORANGE  
3. BERNARD Paul - INS 385021205601234 - Normal

**Consultations**: 3 fixtures (programmée, en cours, terminée)
**Ordonnances**: 3 fixtures (en attente, validée, exécutée)

## 🎯 Objectifs Workshop Couverts

✅ **Module 1**: HTML/CSS boilerplate + responsive design
✅ **Module 2**: TypeScript classes, interfaces, types génériques
✅ **Module 3**: Angular basics + component lifecycle
✅ **Module 4**: Pipes personnalisés (age, insFormat, cim10)
✅ **Module 5**: Directives (SensitiveData, AffichageRole, RoleBadge)
✅ **Module 6**: Services (Auth, Audit, Notification, PatientApi)
✅ **Module 7**: Routing (lazy-loading, gardes, parameterized), landing page
✅ **Module 8**: Formulaires Réactifs (FormBuilder, FormArray, validators)
✅ **Module 9**: HTTP (interceptors, FHIR, error handling)

## 📚 Ressources Supplémentaires

- [Angular 21 Documentation](https://angular.io)
- [RxJS Pattern](https://rxjs.dev)
- [FHIR R4 Standard](https://www.hl7.org/fhir/R4)
- [HDS Certification](https://www.anssi.gouv.fr)

---

**Créé pour le Workshop Angular 101 - 2026** 🎓