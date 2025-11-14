import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DoctorService} from '../../../services/doctor-service';
import {Doctor} from '../../../models/doctor';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './doctor-form.component.html',
  styleUrl: './doctor-form.component.css'
})
export class DoctorFormComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.setNextId();
  }

  private setNextId(): void {
    this.doctorForm.controls.id.setValue(this.doctorService.generateId());
  }

  protected doctorForm = new FormGroup({
    id: new FormControl<number | null>(null),
    cedula: new FormControl<string | null>(null, {validators: [Validators.required]}),
    nombreCompleto: new FormControl<string | null>(null, {validators: [Validators.required]}),
    profesion: new FormControl<string | null>(null, {validators: [Validators.required]}),
    experiencia: new FormControl<number | null>(null, {validators: [Validators.required, Validators.min(0)]}),
    especialidad: new FormControl<string | null>(null, {validators: [Validators.required]}),
    universidad: new FormControl<string | null>(null, {validators: [Validators.required]})
  });

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const formValue = this.doctorForm.value;

    const doctor: Omit<Doctor, 'id'> = {
      cedula: formValue.cedula!,
      nombreCompleto: formValue.nombreCompleto!,
      profesion: formValue.profesion!,
      experiencia: formValue.experiencia!,
      especialidad: formValue.especialidad!,
      universidad: formValue.universidad!
    };

    this.doctorService.saveDoctor(doctor);

    window.dispatchEvent(new CustomEvent('doctorAdded'));
    this.onReset();
  }

  onReset(): void {
    this.doctorForm.reset();
    this.setNextId();
  }


  /**
   * Carga de JSON
   */
  loadExampleData(): void {
    this.http.get<Doctor>('/assets/mock-doctor.json').subscribe(doctor => {
      this.doctorForm.patchValue(doctor);
    });
  }
}
