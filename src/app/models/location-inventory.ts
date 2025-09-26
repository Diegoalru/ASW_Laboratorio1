import {Location} from "./location";
import {Med} from "./med";

export interface LocationInventory {
  location: Location;
  medications: Med[];
  totalQuantity: number;
  totalValue: number;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
}
