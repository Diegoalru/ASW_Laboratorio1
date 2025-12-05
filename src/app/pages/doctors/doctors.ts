import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../services/doctor-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors.html',
  styleUrls: ['./doctors.css']
})
export class Doctors implements OnInit, OnDestroy {
  allDoctors: Doctor[] = [];
  availableDoctors: Doctor[] = [];
  selectedDoctors: Doctor[] = [];
  draggedDoctor: Doctor | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Load doctors from DoctorService (includes JSON data + dynamically created doctors)
   */
  loadDoctors(): void {
    this.isLoading = true;
    this.error = null;

    // Subscribe to doctor changes
    this.subscription = this.doctorService.doctors$.subscribe({
      next: (doctors) => {
        if (doctors.length > 0) {
          this.allDoctors = doctors;
          // Keep currently selected doctors, update an available list
          const selectedIds = this.selectedDoctors.map(d => d.id);
          this.availableDoctors = doctors.filter(d => !selectedIds.includes(d.id));
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
        this.error = 'Error al cargar la lista de doctores. Por favor, recargue la página.';
        this.isLoading = false;
      }
    });

    // Initial load with a small delay to allow service to load JSON
    setTimeout(() => {
      const doctors = this.doctorService.getAllDoctors();
      if (doctors.length > 0) {
        this.allDoctors = doctors;
        this.availableDoctors = [...doctors];
        this.isLoading = false;
      }
    }, 100);
  }

  /**
   * Handle drag start event
   */
  onDragStart(event: DragEvent, doctor: Doctor): void {
    this.draggedDoctor = doctor;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify(doctor));
    }
  }

  /**
   * Handle drag over event to allow drop
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  /**
   * Handle drop event for selected doctors section
   */
  onDropSelected(event: DragEvent): void {
    event.preventDefault();

    if (!this.draggedDoctor) return;

    // Check if doctor is already selected
    if (this.selectedDoctors.some(d => d.id === this.draggedDoctor!.id)) {
      this.draggedDoctor = null;
      return;
    }

    // Find the complete doctor object from allDoctors to ensure we have latest data
    const doctorToAdd = this.allDoctors.find(d => d.id === this.draggedDoctor!.id);
    if (doctorToAdd) {
      // Add to selected
      this.selectedDoctors.push(doctorToAdd);

      // Remove from available
      this.availableDoctors = this.availableDoctors.filter(
        d => d.id !== this.draggedDoctor!.id
      );
    }

    this.draggedDoctor = null;
  }

  /**
   * Handle drop event for available doctors section
   */
  onDropAvailable(event: DragEvent): void {
    event.preventDefault();

    if (!this.draggedDoctor) return;

    // Check if doctor is already available
    if (this.availableDoctors.some(d => d.id === this.draggedDoctor!.id)) {
      this.draggedDoctor = null;
      return;
    }

    // Find the complete doctor object from allDoctors to ensure we have latest data
    const doctorToAdd = this.allDoctors.find(d => d.id === this.draggedDoctor!.id);
    if (doctorToAdd) {
      // Add to available
      this.availableDoctors.push(doctorToAdd);

      // Remove from selected
      this.selectedDoctors = this.selectedDoctors.filter(
        d => d.id !== this.draggedDoctor!.id
      );
    }

    this.draggedDoctor = null;
  }

  /**
   * Remove doctor from selected team via button
   */
  removeDoctorFromSelection(doctor: Doctor): void {
    this.selectedDoctors = this.selectedDoctors.filter(d => d.id !== doctor.id);

    // Find the complete doctor object from allDoctors
    const doctorToAdd = this.allDoctors.find(d => d.id === doctor.id);
    if (doctorToAdd && !this.availableDoctors.some(d => d.id === doctor.id)) {
      this.availableDoctors.push(doctorToAdd);
      this.availableDoctors.sort((a, b) => a.id - b.id);
    }
  }

  /**
   * Clear all selected doctors
   */
  clearSelection(): void {
    // Reset to show all doctors from allDoctors
    this.availableDoctors = [...this.allDoctors];
    this.availableDoctors.sort((a, b) => a.id - b.id);
    this.selectedDoctors = [];
  }

  /**
   * Calculate average experience of selected doctors
   */
  getAverageExperience(): number {
    if (this.selectedDoctors.length === 0) return 0;
    const total = this.selectedDoctors.reduce((sum, doctor) => sum + doctor.experiencia, 0);
    return Math.round(total / this.selectedDoctors.length * 10) / 10;
  }
}

