import { CanActivateFn, CanDeactivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';

/**
 * Garde: Vérifier l'authentification (Module 7)
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auditService = inject(AuditService);

  if (authService.estConnecte()) {
    return true;
  }

  // Non authentifié - rediriger vers connexion
  auditService.log('ACCES_REFUSE', undefined, `Tentative accès non authentifié: ${state.url}`, 'refusé');
  router.navigate(['/connexion'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Garde: Vérifier le rôle (RBAC — Role-Based Access Control) (Module 7)
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auditService = inject(AuditService);

  const rolesRequis: string[] = route.data?.['rolesRequis'] ?? [];
  const roleUtilisateur = authService.getRole();

  // Si pas de rôles requis, autoriser
  if (rolesRequis.length === 0) {
    return true;
  }

  // Vérifier si le rôle correspond
  if (rolesRequis.includes(roleUtilisateur)) {
    return true;
  }

  // Accès refusé — journaliser la tentative
  auditService.log(
    'ACCES_REFUSE',
    undefined,
    `Route: ${state.url}, Role: ${roleUtilisateur}, Requis: ${rolesRequis.join(',')}`,
    'refusé'
  );

  router.navigate(['/connexion']);
  return false;
};

/**
 * Garde: Vérifier si déjà connecté (pour page connexion/inscription)
 */
export const dejaCnxGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estConnecte()) {
    // Déjà connecté, rediriger vers la liste patients
    router.navigate(['/patients']);
    return false;
  }

  return true;
};

/**
 * Interface pour les composants protégés par le guard CanDeactivate (Module 7)
 */
export interface PeutDesactiver {
  peutDesactiver(): boolean;
}

/**
 * Garde: Protéger les formulaires non sauvegardés avant de quitter (Module 7 — CanDeactivate)
 * S'utilise avec `canDeactivate: [formulaireNonSauvegardeGuard]` sur la route
 */
export const formulaireNonSauvegardeGuard: CanDeactivateFn<PeutDesactiver> = (component: PeutDesactiver) => {
  if (component && typeof component.peutDesactiver === 'function') {
    if (!component.peutDesactiver()) {
      return confirm(
        'Des modifications non sauvegardées seront perdues. Continuer quand même ?'
      );
    }
  }
  return true;
};
