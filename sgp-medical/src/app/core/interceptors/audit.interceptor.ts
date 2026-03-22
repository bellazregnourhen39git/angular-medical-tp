import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuditService } from '../services/audit.service';

/**
 * Intercepteur d'audit — Forme FONCTIONNELLE (Angular 17+)
 * Journalise TOUTES les requêtes HTTP (obligation HDS/RGPD)
 */
export const auditInterceptorFn: HttpInterceptorFn = (req, next) => {
  const auditService = inject(AuditService);
  const startTime = Date.now();

  // Extraire l'ID patient de l'URL si présent
  const patientIdMatch = req.url.match(/\/patients\/([a-f0-9-]+)/);
  const patientId = patientIdMatch ? patientIdMatch[1] : undefined;

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;

          // Journaliser les accès aux dossiers patients
          if (req.method === 'GET' && req.url.includes('/patients/')) {
            auditService.log('CONSULTATION_DOSSIER', patientId, `GET ${req.url} (${duration}ms)`, 'succès');
          }

          // Journaliser les modifications
          if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.url.includes('/patients/')) {
            auditService.log('MODIFICATION_PATIENT', patientId, `${req.method} ${req.url} (${duration}ms)`, 'succès');
          }

          // Journaliser les exports
          if (req.url.includes('/export')) {
            auditService.log('EXPORT_DONNEES', patientId, `GET ${req.url} (${duration}ms)`, 'succès');
          }
        }
      },
      error: error => {
        if (error instanceof HttpErrorResponse) {
          const duration = Date.now() - startTime;
          if (error.status === 403) {
            auditService.log('ACCES_REFUSE', patientId, `${error.status} ${error.statusText}: ${req.url}`, 'refusé');
          } else if (error.status === 401) {
            auditService.log('ACCES_REFUSE', undefined, `${error.status} Unauthorized: ${req.url}`, 'refusé');
          } else if (error.status >= 400 && error.status < 500) {
            auditService.log('ACCES_REFUSE', patientId, `${error.status} ${error.statusText}: ${req.url}`, 'erreur');
          }
        }
      }
    })
  );
};

/**
 * Intercepteur d'audit — Forme CLASS (rétro-compat)
 */
@Injectable()
export class AuditInterceptor implements HttpInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    const patientIdMatch = req.url.match(/\/patients\/([a-f0-9-]+)/);
    const patientId = patientIdMatch ? patientIdMatch[1] : undefined;

    return next.handle(req).pipe(
      tap({
        next: event => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            if (req.method === 'GET' && req.url.includes('/patients/')) {
              this.auditService.log('CONSULTATION_DOSSIER', patientId, `GET ${req.url} (${duration}ms)`, 'succès');
            }
            if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.url.includes('/patients/')) {
              this.auditService.log('MODIFICATION_PATIENT', patientId, `${req.method} ${req.url} (${duration}ms)`, 'succès');
            }
          }
        },
        error: error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 403) {
              this.auditService.log('ACCES_REFUSE', patientId, `${error.status}: ${req.url}`, 'refusé');
            }
          }
        }
      })
    );
  }
}
