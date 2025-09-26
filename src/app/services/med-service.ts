import {Injectable} from '@angular/core';
import {Med} from '../models/med';

@Injectable({
  providedIn: 'root'
})
export class MedService {

  private meds: Med[] = [];

  /**
   * Save a medication
   * @param med - Medication to save
   */
  saveMed(med: Med): void {
    const newId = this.generateId();
    const medToSave = {...med, id: newId};
    this.meds.push(medToSave);
  }

  /**
   * Get all medications
   * @returns - All medications
   */
  getAllMeds(): Med[] {
    // Return a new array reference to ensure reactive updates in computed signals
    return [...this.meds];
  }

  /**
   * Get a medication by id
   * @param id - Medication id
   * @returns - Medication
   */
  getMedById(id: number): Med | undefined {
    return this.meds.find(med => med.id === id);
  }

  /**
   * Update a medication
   * @param med - Medication to update
   */
  updateMed(med: Med): void {
    const index = this.meds.findIndex(m => m.id === med.id);
    if (index !== -1) {
      this.meds[index] = med;
    }
  }

  /**
   * Delete a medication
   * @param id - Medication id
   */
  deleteMed(id: number): void {
    this.meds = this.meds.filter(med => med.id !== id);
  }

  /**
   * Generate a new id for a new medication
   * @returns - New id
   */
  generateId(): number {
    return this.meds.length > 0 ? Math.max(...this.meds.map(med => med.id || 0)) + 1 : 1;
  }
}
