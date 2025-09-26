import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MedForm} from './med-form/med-form';
import {MedTables} from './med-tables/med-tables';

@Component({
  selector: 'app-create-meds',
  imports: [ReactiveFormsModule, MedForm, MedTables,],
  templateUrl: './create-meds.html',
  styleUrl: './create-meds.css'
})
export class CreateMeds {

}
