import L from 'leaflet';

let deliveryMapIcon: L.DivIcon | null = null;

const DELIVERY_MARKER_HTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44" aria-hidden="true">
  <path
    fill="var(--accent)"
    stroke="color-mix(in oklab, var(--accent) 70%, black)"
    stroke-width="1.5"
    d="M16 1.5C9.1 1.5 3.5 7.1 3.5 14c0 10.2 12.5 27.5 12.5 27.5S28.5 24.2 28.5 14C28.5 7.1 22.9 1.5 16 1.5z"
  />
  <circle cx="16" cy="14" r="5.5" fill="var(--background)" />
  <circle cx="16" cy="14" r="2.75" fill="var(--accent)" />
</svg>
`.trim();

/** Pin icon with anchor at the tip so clicks and drags align with the map point. */
export function createDeliveryMapIcon(): L.DivIcon {
  if (deliveryMapIcon) return deliveryMapIcon;

  deliveryMapIcon = L.divIcon({
    className: 'delivery-map-marker',
    html: DELIVERY_MARKER_HTML,
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -44]
  });

  return deliveryMapIcon;
}

/** Kept for compatibility; delivery picker uses createDeliveryMapIcon instead. */
export function configureLeafletIcons() {
  if (typeof window === 'undefined') return;
}
