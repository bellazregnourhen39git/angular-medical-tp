import { Directive, Input, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AuditService } from '../../core/services/audit.service';

/**
 * Directive: Masquer/afficher les données sensibles
 * Utilisation: <span [appSensitiveData]="true">{{ patient.ins }}</span>
 * 
 * En fonction du rôle utilisateur, masque ou affiche les données sensibles
 * Les médecins peuvent voir toutes les données
 * Les autres doivent cliquer pour afficher (et c'est journalisé)
 */
@Directive({
  selector: '[appSensitiveData]',
  standalone: true,
  providers: [AuthService, AuditService]
})
export class SensitiveDataDirective implements OnInit {
  @Input() appSensitiveData = true; // true = masquer par défaut
  @Input() maskChar = '*';

  private originalText = '';
  private isVisible = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    if (this.appSensitiveData && !this.authService.peutVoirDonneesSensibles()) {
      // L'utilisateur n'a pas le droit de voir, donc masquer
      this.originalText = this.el.nativeElement.textContent;
      this.masquer();
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
      this.renderer.addClass(this.el.nativeElement, 'donnee-sensible-masquee');
    }
  }

  @HostListener('click')
  toggleVisibilite(): void {
    // Si l'utilisateur peut déjà voir, pas besoin de cliquer
    if (this.authService.peutVoirDonneesSensibles()) {
      return;
    }

    // Sinon, on peut afficher/masquer au clic
    if (this.isVisible) {
      this.masquer();
    } else {
      this.afficher();
      // Journaliser l'accès à une donnée sensible
      this.auditService.log(
        'VIEW_SENSITIVE',
        this.el.nativeElement.dataset['patientId'],
        'Affichage donnée sensible'
      );
    }

    this.isVisible = !this.isVisible;
  }

  private masquer(): void {
    const masked = this.maskChar.repeat(Math.max(this.originalText.length, 10));
    this.renderer.setProperty(this.el.nativeElement, 'textContent', masked);
    this.renderer.addClass(this.el.nativeElement, 'donnee-masquee');
  }

  private afficher(): void {
    this.renderer.setProperty(this.el.nativeElement, 'textContent', this.originalText);
    this.renderer.removeClass(this.el.nativeElement, 'donnee-masquee');
  }
}

/**
 * Directive: Affichage contrôlé par rôle
 * Utilisation: <div *appAffichageRole="['medecin', 'admin']">Données confidentielles</div>
 */
@Directive({
  selector: '[appAffichageRole]',
  standalone: true,
  providers: [AuthService]
})
export class AffichageRoleDirective implements OnInit {
  @Input() appAffichageRole: string[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const roleUtilisateur = this.authService.getRole();
    const autorise = this.appAffichageRole.includes(roleUtilisateur);

    if (!autorise) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}

/**
 * Directive: Afficher un badge de rôle
 * Utilisation: <span appRoleBadge></span>
 */
@Directive({
  selector: '[appRoleBadge]',
  standalone: true,
  providers: [AuthService]
})
export class RoleBadgeDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const utilisateur = this.authService.getUtilisateurConnecte();
    const role = utilisateur?.role ?? 'anonymous';

    let badgeColor = '#999';
    let badgeText = role.toUpperCase();

    switch (role) {
      case 'admin':
        badgeColor = '#e74c3c';
        badgeText = '👤 ADMIN';
        break;
      case 'medecin':
        badgeColor = '#2196f3';
        badgeText = '👨‍⚕️ MÉDECIN';
        break;
      case 'infirmier':
        badgeColor = '#4caf50';
        badgeText = '👨‍⚕️ INFIRMIER';
        break;
      default:
        badgeColor = '#999';
        badgeText = role.toUpperCase();
    }

    this.renderer.setProperty(this.el.nativeElement, 'textContent', badgeText);
    this.renderer.setStyle(this.el.nativeElement, 'background-color', badgeColor);
    this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '4px 8px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '0.85rem');
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-block');
  }
}
