import {Component, computed, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule, DatePipe, JsonPipe} from '@angular/common';
import {MedService} from '../../../services/med-service';
import {CurrencyService} from '../../../services/currency-service';
import {LocationService} from '../../../services/location-service';
import {LocationInventory} from '../../../models/location-inventory';

@Component({
  selector: 'app-med-tables',
  standalone: true,
  imports: [DatePipe, JsonPipe, CommonModule],
  templateUrl: './med-tables.html',
  styleUrl: './med-tables.css'
})
export class MedTables implements OnInit, OnDestroy {

  private medicationAddedListener?: () => void;

  private refreshSignal = signal(0);

  medications = computed(() => {
    this.refreshSignal();
    return this.medService.getAllMeds();
  });

  constructor(private medService: MedService, private currencyService: CurrencyService, private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.medicationAddedListener = () => {
      this.refreshTables();
    };
    window.addEventListener('medicationAdded', this.medicationAddedListener);
  }

  ngOnDestroy(): void {
    if (this.medicationAddedListener) {
      window.removeEventListener('medicationAdded', this.medicationAddedListener);
    }
  }

  protected locationInventory = computed(() => {
    const meds = this.medications();
    const inventory: LocationInventory[] = [];

    const locations = this.locationService.getAllLocations();
    locations.forEach(location => {
      const locationMeds = meds.filter(med => med.location === location.id);
      const totalQuantity = locationMeds.reduce((sum, med) => sum + med.quantity, 0);
      const totalValue = locationMeds.reduce((sum, med) => sum + (med.cost * med.quantity), 0);

      let status: 'Available' | 'Low Stock' | 'Out of Stock' = 'Out of Stock';
      if (totalQuantity > 20) {
        status = 'Available';
      } else if (totalQuantity > 0) {
        status = 'Low Stock';
      }

      inventory.push({
        location, medications: locationMeds, totalQuantity, totalValue, status
      });
    });

    return inventory;
  });

  refreshTables(): void {
    this.refreshSignal.update(v => v + 1);
  }

  formatPrice(price: number): string {
    return this.currencyService.formatCRC(price);
  }

  getLocationName(locationId: number): string {
    const location = this.locationService.getLocationById(locationId);
    return location?.name ?? 'Desconocida';
  }

  isInventoryEmpty(): boolean {
    return this.locationInventory().every(inv => inv.totalQuantity === 0);
  }

  exportAsJson(): void {
    const meds = this.medService.getAllMeds();
    const jsonString = JSON.stringify(meds, null, 2);
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'medicamentos.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
