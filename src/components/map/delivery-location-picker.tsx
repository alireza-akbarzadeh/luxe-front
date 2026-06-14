'use client';

import 'leaflet/dist/leaflet.css';

import { IconCurrentLocation, IconMapPin, IconSearch } from '@tabler/icons-react';
import type { LatLngExpression } from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getCurrentCoordinates,
  reverseGeocode,
  searchAddress
} from '@/lib/geocoding/geocoding-client';
import type { GeocodedAddress, GeoCoordinates } from '@/lib/geocoding/types';
import { cn } from '@/lib/utils';

import { configureLeafletIcons } from './leaflet-icon';

const DEFAULT_CENTER: GeoCoordinates = {
  latitude: 40.7128,
  longitude: -74.006
};

const DEFAULT_ZOOM = 13;
const SELECTED_ZOOM = 16;

interface DeliveryLocationPickerProps {
  value?: GeoCoordinates | null;
  onChange: (coords: GeoCoordinates) => void;
  onAddressResolved?: (address: GeocodedAddress) => void;
  className?: string;
}

function MapFlyTo({
  center,
  zoom,
  onComplete
}: {
  center: LatLngExpression;
  zoom: number;
  onComplete?: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });

    if (!onComplete) return;

    const handleMoveEnd = () => {
      onComplete();
    };

    map.once('moveend', handleMoveEnd);
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [center, map, onComplete, zoom]);

  return null;
}

function MapClickHandler({ onSelect }: { onSelect: (coords: GeoCoordinates) => void }) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      });
    }
  });

  return null;
}

function InitialGeocodeResolver({
  coords,
  onResolved,
  onResolvingChange
}: {
  coords: GeoCoordinates;
  onResolved: (address: GeocodedAddress) => void;
  onResolvingChange: (resolving: boolean) => void;
}) {
  const map = useMap();
  const hasResolved = useRef(false);

  useEffect(() => {
    if (hasResolved.current) return;

    let cancelled = false;

    map.whenReady(() => {
      void (async () => {
        onResolvingChange(true);
        try {
          const address = await reverseGeocode(coords);
          if (cancelled || hasResolved.current) return;
          hasResolved.current = true;
          onResolved(address);
        } catch (error) {
          if (cancelled) return;
          const message =
            error instanceof Error ? error.message : 'Could not resolve this location';
          toast.error(message);
        } finally {
          if (!cancelled) onResolvingChange(false);
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [coords, map, onResolved, onResolvingChange]);

  return null;
}

/**
 * Interactive OpenStreetMap picker for choosing a delivery location.
 * Uses free OSM tiles + Nominatim geocoding via `/api/geocoding`.
 */
export function DeliveryLocationPicker({
  value,
  onChange,
  onAddressResolved,
  className
}: DeliveryLocationPickerProps) {
  const [position, setPosition] = useState<GeoCoordinates>(value ?? DEFAULT_CENTER);
  const [resolvedAddress, setResolvedAddress] = useState<GeocodedAddress | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedAddress[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [flyTarget, setFlyTarget] = useState<GeoCoordinates | null>(null);

  useEffect(() => {
    configureLeafletIcons();
  }, []);

  const markerPosition = useMemo<LatLngExpression>(
    () => [position.latitude, position.longitude],
    [position.latitude, position.longitude]
  );

  const resolveLocation = async (coords: GeoCoordinates) => {
    setIsResolving(true);
    try {
      const address = await reverseGeocode(coords);
      setResolvedAddress(address);
      onAddressResolved?.(address);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not resolve this location';
      toast.error(message);
    } finally {
      setIsResolving(false);
    }
  };

  const updatePosition = (coords: GeoCoordinates) => {
    setPosition(coords);
    onChange(coords);
    void resolveLocation(coords);
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) return;

    setIsSearching(true);
    try {
      const results = await searchAddress(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        toast.message('No locations found', {
          description: 'Try a street name, city, or landmark.'
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Search failed';
      toast.error(message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: GeocodedAddress) => {
    const coords = { latitude: result.latitude, longitude: result.longitude };
    setSearchQuery(result.displayName);
    setSearchResults([]);
    setResolvedAddress(result);
    setPosition(coords);
    setFlyTarget(coords);
    onChange(coords);
    onAddressResolved?.(result);
  };

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const coords = await getCurrentCoordinates();
      setFlyTarget(coords);
      updatePosition(coords);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Location unavailable';
      toast.error(message);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className='flex flex-col gap-2 sm:flex-row'>
        <div className='relative flex-1'>
          <IconSearch className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void handleSearch();
              }
            }}
            placeholder='Search address, city, or landmark'
            className='rounded-full pl-9'
          />

          {searchResults.length > 0 && (
            <ul className='bg-popover absolute z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border shadow-lg'>
              {searchResults.map((result) => (
                <li key={`${result.latitude}-${result.longitude}-${result.displayName}`}>
                  <button
                    type='button'
                    className='hover:bg-muted w-full px-4 py-3 text-left text-sm transition-colors'
                    onClick={() => handleSelectSearchResult(result)}
                  >
                    {result.displayName}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='flex gap-2'>
          <Button
            type='button'
            variant='outline'
            className='rounded-full'
            onClick={() => void handleSearch()}
            disabled={isSearching || searchQuery.trim().length < 3}
          >
            {isSearching ? 'Searching…' : 'Search'}
          </Button>
          <Button
            type='button'
            variant='outline'
            className='rounded-full'
            onClick={() => void handleUseCurrentLocation()}
            disabled={isLocating}
          >
            <IconCurrentLocation className='h-4 w-4 sm:mr-2' />
            <span className='hidden sm:inline'>{isLocating ? 'Locating…' : 'Use my location'}</span>
          </Button>
        </div>
      </div>

      <div className='border-border relative overflow-hidden rounded-2xl border'>
        <MapContainer
          center={markerPosition}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          className='z-0 h-[min(52vh,420px)] min-h-[280px] w-full sm:min-h-[360px]'
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {flyTarget && (
            <MapFlyTo
              center={[flyTarget.latitude, flyTarget.longitude]}
              zoom={SELECTED_ZOOM}
              onComplete={() => setFlyTarget(null)}
            />
          )}
          <InitialGeocodeResolver
            coords={position}
            onResolved={(address) => {
              setResolvedAddress(address);
              onAddressResolved?.(address);
            }}
            onResolvingChange={setIsResolving}
          />
          <MapClickHandler onSelect={updatePosition} />
          <Marker
            draggable
            position={markerPosition}
            eventHandlers={{
              dragend(event) {
                const marker = event.target;
                const latLng = marker.getLatLng();
                updatePosition({
                  latitude: latLng.lat,
                  longitude: latLng.lng
                });
              }
            }}
          />
        </MapContainer>

        <div className='bg-background/90 absolute right-3 bottom-3 left-3 rounded-xl border px-3 py-2 backdrop-blur-sm'>
          <div className='flex items-start gap-2'>
            <IconMapPin className='text-accent mt-0.5 h-4 w-4 shrink-0' />
            <div className='min-w-0'>
              <p className='text-xs font-medium'>Selected delivery point</p>
              {isResolving ? (
                <Skeleton className='mt-1 h-4 w-full max-w-sm' />
              ) : (
                <p className='text-muted-foreground line-clamp-2 text-xs'>
                  {resolvedAddress?.displayName ??
                    `${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className='text-muted-foreground text-xs'>
        Tap the map or drag the pin to fine-tune your delivery location.
      </p>
    </div>
  );
}
