import {Component, ViewChild} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import {LocationService} from '../../services/location-service';
import {Location} from '../../models/location';

@Component({
  selector: 'app-locations',
  imports: [
    GoogleMap,
    MapMarker,
    MapInfoWindow,
  ],
  templateUrl: './locations.html',
  styleUrl: './locations.css'
})
export class Locations {
  protected center = {lat: 9.933060, lng: -84.072878};
  protected zoom = 12;
  protected markerOptions = {draggable: false};

  protected mapOptions: google.maps.MapOptions = {
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    disableDoubleClickZoom: false
  };

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  protected selectedLocation?: Location;

  constructor(private locationService: LocationService) { }

  protected get locations() {
    return this.locationService.getAllLocations().map(location => ({
      id: location.id,
      name: location.name,
      description: location.description,
      position: {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng
      }
    }));
  }

  protected openInfoWindow(marker: MapMarker, location: { id: number; name: string; description: string }) {
    this.selectedLocation = this.locationService.getLocationById(location.id);
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }

  protected getLocations() {
    return this.locationService.getAllLocations();
  }
}
