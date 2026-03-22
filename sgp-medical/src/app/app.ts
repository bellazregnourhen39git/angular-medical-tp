import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationToastComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Système de Gestion de Patients');
}
