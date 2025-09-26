import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MedService} from '../../../services/med-service';
import {Med} from '../../../models/med';
import {CurrencyService} from '../../../services/currency-service';
import {LocationService} from '../../../services/location-service';

@Component({
  selector: 'app-med-form',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './med-form.html',
  styleUrl: './med-form.css'
})
export class MedForm implements OnInit {
  constructor(private currencyService: CurrencyService, private medService: MedService, private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.setNextId();
  }

  private setNextId(): void {
    this.medForm.controls.id.setValue(this.medService.generateId());
  }

  protected get locations() {
    return this.locationService.getAllLocations();
  }

  protected medForm = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string | null>(null, {validators: [Validators.required]}),
    date: new FormControl<Date | null>(null, {validators: [Validators.required]}),
    cost: new FormControl<number | null>(null, {validators: [Validators.required, Validators.min(0)]}),
    quantity: new FormControl<number | null>(null, {validators: [Validators.required, Validators.min(1)]}),
    location: new FormControl<number | null>(null, {validators: [Validators.required]})
  });

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!value) {
      this.medForm.controls.date.setValue(null);
      return;
    }
    const [y, m, d] = value.split('-').map(Number);
    this.medForm.controls.date.setValue(new Date(y, m - 1, d));
  }

  onCostFocus(event: Event): void {
    const el = event.target as HTMLInputElement;
    const current = this.medForm.controls.cost.value;
    el.value = current == null ? '' : String(current);
  }

  onCostInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const parsed = this.currencyService.parseLocaleNumber(el.value);

    // Handle invalid input
    if (isNaN(parsed)) {
      this.medForm.controls.cost.setValue(null);
    } else {
      this.medForm.controls.cost.setValue(parsed);
    }
  }

  onCostBlur(event: Event): void {
    const el = event.target as HTMLInputElement;
    const current = this.medForm.controls.cost.value ?? 0;
    el.value = this.currencyService.formatCRC(current);
  }

  onSubmit(): void {
    if (this.medForm.invalid) {
      this.medForm.markAllAsTouched();
      return;
    }

    const formValue = this.medForm.value;

    // Remove ID since the service will generate it
    const med: Omit<Med, 'id'> = {
      name: formValue.name!,
      date: formValue.date!,
      cost: formValue.cost!,
      quantity: formValue.quantity!,
      location: formValue.location!
    };

    this.medService.saveMed(med);

    // Emit event through a more Angular-friendly approach
    window.dispatchEvent(new CustomEvent('medicationAdded'));
    this.onReset();
  }

  onReset(): void {
    this.medForm.reset();
    // Set the next generated ID after reset
    this.setNextId();
  }
}
