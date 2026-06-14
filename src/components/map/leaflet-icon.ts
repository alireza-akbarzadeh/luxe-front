import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let configured = false;

/** Fixes broken default marker assets when bundling Leaflet with Next.js. */
export function configureLeafletIcons() {
  if (configured || typeof window === 'undefined') return;

  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src
  });

  configured = true;
}
