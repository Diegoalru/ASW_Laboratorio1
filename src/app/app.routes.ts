import { Routes } from '@angular/router';
import { CreateMeds } from "./pages/create-meds/create-meds";
import {ListMeds} from './pages/list-meds/list-meds';
import {Locations} from './pages/locations/locations';

export const routes: Routes = [
  { path: 'create-meds', component: CreateMeds, title: 'Crear Medicamentos' },
  { path: 'list-meds', component: ListMeds, title: 'Lista Medicamentos'},
  { path: 'locations', component: Locations, title: 'Ubicaciones'},
  { path: '**', component: CreateMeds }
];
