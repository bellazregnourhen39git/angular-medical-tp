import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';
import { NotificationService } from '../services/notification.service';

/**
 * Intercepteur d'authentification JWT — Forme FONCTIONNELLE (Angular 17+)
 * - Injecte le token JWT dans les headers Authorization
 * - Gère les erreurs 401 (session expirée) et 403 (accès refusé)
 */
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const auditService = inject(AuditService);
  const notificationService = inject(NotificationService);

  const token = authService.getToken();
  const utilisateur = authService.getUtilisateurConnecte();

  // Injecter le token JWT et les headers d'identification
  let reqAvecToken = req;
  if (token) {
    reqAvecToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-Utilisateur-Id': utilisateur?.id ?? 'unknown',
        'X-Utilisateur-Role': utilisateur?.role ?? 'anonymous',
      }
    });
  }

  return next(reqAvecToken).pipe(
    catchError(erreur => {
      if (erreur instanceof HttpErrorResponse) {
        if (erreur.status === 401) {
          // Session expirée
          notificationService.warning('Session expirée', 'Veuillez vous reconnecter');
          authService.deconnecter();
          router.navigate(['/connexion']);
        } else if (erreur.status === 403) {
          // Accès refusé
          auditService.log(
            'ACCES_REFUSE',
            undefined,
            `HTTP 403: ${reqAvecToken.url}`,
            'refusé'
          );
          notificationService.erreur('Accès refusé', "Vous n'avez pas les droits nécessaires");
          router.navigate(['/']);
        }
      }
      return throwError(() => erreur);
    })
  );
};

/**
 * Intercepteur d'authentification JWT — Forme CLASS (rétro-compat si besoin)
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private auditService: AuditService,
    private notificationService: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const utilisateur = this.authService.getUtilisateurConnecte();

    let reqAvecToken = req;
    if (token) {
      reqAvecToken = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Utilisateur-Id': utilisateur?.id ?? 'unknown',
          'X-Utilisateur-Role': utilisateur?.role ?? 'anonymous',
        }
      });
    }

    return next.handle(reqAvecToken).pipe(
      catchError(erreur => {
        if (erreur instanceof HttpErrorResponse) {
          if (erreur.status === 401) {
            this.notificationService.warning('Session expirée', 'Veuillez vous reconnecter');
            this.authService.deconnecter();
            this.router.navigate(['/connexion']);
          } else if (erreur.status === 403) {
            this.auditService.log('ACCES_REFUSE', undefined, `HTTP 403: ${reqAvecToken.url}`, 'refusé');
            this.notificationService.erreur('Accès refusé', "Vous n'avez pas les droits nécessaires");
            this.router.navigate(['/']);
          }
        }
        return throwError(() => erreur);
      })
    );
  }
}
