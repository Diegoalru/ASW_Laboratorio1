import { Injectable } from '@angular/core';
import { Location } from '../models/location';
import { LOCATIONS } from '../constants/locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations: Location[] = [...LOCATIONS];

  /**
   * Get all locations
   */
  getAllLocations(): Location[] {
    // Return a new array to avoid accidental external mutation and help reactivity patterns
    return [...this.locations];
  }

  /**
   * Get a location by id
   */
  getLocationById(id: number): Location | undefined {
    return this.locations.find(l => l.id === id);
  }

  /**
   * Create a new location
   */
  saveLocation(location: Omit<Location, 'id'> & Partial<Pick<Location, 'id'>>): void {
    const newId = this.generateId();
    const toSave: Location = { ...location, id: newId } as Location;
    this.locations.push(toSave);
  }

  /**
   * Update an existing location
   */
  updateLocation(location: Location): void {
    const idx = this.locations.findIndex(l => l.id === location.id);
    if (idx !== -1) {
      this.locations[idx] = location;
    }
  }

  /**
   * Delete a location
   */
  deleteLocation(id: number): void {
    this.locations = this.locations.filter(l => l.id !== id);
  }

  /**
   * Generate incremental id
   */
  private generateId(): number {
    return this.locations.length > 0
      ? Math.max(...this.locations.map(l => l.id || 0)) + 1
      : 1;
  }
}
