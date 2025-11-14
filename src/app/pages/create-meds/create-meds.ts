import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MedForm} from './med-form/med-form';
import {MedTables} from './med-tables/med-tables';
import {DoctorFormComponent} from './doctor-form/doctor-form.component';

@Component({
  selector: 'app-create-meds',
  standalone: true,
  imports: [ReactiveFormsModule, MedForm, MedTables, DoctorFormComponent],
  templateUrl: './create-meds.html',
  styleUrl: './create-meds.css'
})
export class CreateMeds {

}
