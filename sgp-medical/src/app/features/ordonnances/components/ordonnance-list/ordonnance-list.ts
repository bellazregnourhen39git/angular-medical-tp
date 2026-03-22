import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdonnanceService, Ordonnance, StatutOrdonnance } from '../../services/ordonnance.service';

@Component({
  selector: 'app-ordonnance-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordonnance-list.html',
  styleUrl: './ordonnance-list.scss',
})
export class OrdonnanceListComponent implements OnInit {
  ordonnances: Ordonnance[] = [];
  filteredOrdonnances: Ordonnance[] = [];
  searchTerm = '';
  selectedStatut = '';

  constructor(private ordonnanceService: OrdonnanceService) {}

  ngOnInit(): void {
    this.loadOrdonnances();
  }

  loadOrdonnances(): void {
    this.ordonnanceService.ordonnances$.subscribe(ordonnances => {
      this.ordonnances = ordonnances;
      this.applyFilters();
    });
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  onStatutChange(event: Event): void {
    this.selectedStatut = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrdonnances = this.ordonnances.filter(ordonnance => {
      const matchSearch = ordonnance.patientId.toLowerCase().includes(this.searchTerm);
      const matchStatut = !this.selectedStatut || ordonnance.statut === this.selectedStatut;
      return matchSearch && matchStatut;
    });
  }

  changeStatut(ordonnanceId: string, event: Event): void {
    const newStatut = (event.target as HTMLSelectElement).value as StatutOrdonnance;
    this.ordonnanceService.changerStatutOrdonnance(ordonnanceId, newStatut);
  }
}

