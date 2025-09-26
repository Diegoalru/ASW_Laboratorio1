import {FormControl} from '@angular/forms';

export interface Med {
  id?: number;
  name: string;
  date: Date;
  cost: number;
  quantity: number;
  location: number;
}
