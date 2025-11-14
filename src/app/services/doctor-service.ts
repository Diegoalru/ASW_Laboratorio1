import {Injectable} from '@angular/core';
import {Doctor} from '../models/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private doctors: Doctor[] = [];

  /**
   * Save a doctor
   * @param doctor - Doctor to save
   */
  saveDoctor(doctor: Omit<Doctor, 'id'>): void {
    const newId = this.generateId();
    const doctorToSave: Doctor = {...doctor, id: newId};
    this.doctors.push(doctorToSave);
  }

  /**
   * Get all doctors
   * @returns - All doctors
   */
  getAllDoctors(): Doctor[] {
    // Return a new array reference to ensure reactive updates in computed signals
    return [...this.doctors];
  }

  /**
   * Get a doctor by id
   * @param id - Doctor id
   * @returns - Doctor
   */
  getDoctorById(id: number): Doctor | undefined {
    return this.doctors.find(doctor => doctor.id === id);
  }

  /**
   * Update a doctor
   * @param doctor - Doctor to update
   */
  updateDoctor(doctor: Doctor): void {
    const index = this.doctors.findIndex(d => d.id === doctor.id);
    if (index !== -1) {
      this.doctors[index] = doctor;
    }
  }

  /**
   * Delete a doctor
   * @param id - Doctor id
   */
  deleteDoctor(id: number): void {
    this.doctors = this.doctors.filter(doctor => doctor.id !== id);
  }

  /**
   * Generate a new id for a new doctor
   * @returns - New id
   */
  generateId(): number {
    return this.doctors.length > 0 ? Math.max(...this.doctors.map(doctor => doctor.id || 0)) + 1 : 1;
  }
}
