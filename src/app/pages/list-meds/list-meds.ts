import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MedService } from '../../services/med-service';
import { Med } from '../../models/med';

@Component({
  selector: 'app-list-meds',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './list-meds.html',
  styles: []
})
export class ListMeds {

  constructor(private medService: MedService) { }

  get allMeds(): Med[] {
    return this.medService.getAllMeds();
  }

  get topFiveByQuantity(): Med[] {
    return [...this.allMeds]
      .sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0))
      .slice(0, 5);
  }

  get recentFiveByDate(): Med[] {
    return [...this.allMeds]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }
}
