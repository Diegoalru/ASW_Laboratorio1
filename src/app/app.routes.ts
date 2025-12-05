import { Routes } from '@angular/router';
import { CreateMeds } from "./pages/create-meds/create-meds";
import {ListMeds} from './pages/list-meds/list-meds';
import {Locations} from './pages/locations/locations';
import {CssShowcase} from './pages/css-showcase/css-showcase';
import { Doctors } from './pages/doctors/doctors';

export const routes: Routes = [
  { path: 'create-meds', component: CreateMeds, title: 'Crear Medicamentos' },
  { path: 'list-meds', component: ListMeds, title: 'Lista Medicamentos'},
  { path: 'locations', component: Locations, title: 'Ubicaciones'},
  { path: 'css-showcase', component: CssShowcase, title: 'Consejos de Salud'},
  { path: 'doctors', component: Doctors, title: 'Doctores'},
  { path: '**', component: CreateMeds }
];
