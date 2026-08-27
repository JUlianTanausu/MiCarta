import { DivIcon } from 'leaflet'
import './MapMarker.css'

export function createMarkerIcon(isActive: boolean): DivIcon {
  return new DivIcon({
    html: `
      <div class="map-marker${isActive ? ' map-marker--active' : ''}">
        <div class="map-marker__dot"></div>
        <div class="map-marker__pulse"></div>
        <div class="map-marker__pulse-2"></div>
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  })
}
