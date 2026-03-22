import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationService, Consultation } from '../../services/consultation.service';

@Component({
  selector: 'app-consultation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultation-list.html',
  styleUrl: './consultation-list.scss',
})
export class ConsultationListComponent implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  searchTerm = '';
  selectedStatut = '';

  constructor(private consultationService: ConsultationService) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.consultationService.consultations$.subscribe(consultations => {
      this.consultations = consultations;
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
    this.filteredConsultations = this.consultations.filter(consultation => {
      const matchSearch = consultation.motif.toLowerCase().includes(this.searchTerm);
      const matchStatut = !this.selectedStatut || consultation.statut === this.selectedStatut;
      return matchSearch && matchStatut;
    });
  }
}

