'use client';

import 'leaflet/dist/leaflet.css';

import type { LatLngExpression } from 'leaflet';
import { useMemo } from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { createDeliveryMapIcon } from './leaflet-icon';

export interface OrderTrackingMapPoint {
  latitude: number;
  longitude: number;
  label: string;
}

export interface OrderTrackingMapInnerProps {
  destination: OrderTrackingMapPoint;
  hub?: OrderTrackingMapPoint | null;
  distanceMiles?: number;
  stopsRemaining?: number;
  estimatedArrival?: string;
  className?: string;
}

/** Leaflet map body — import via dynamic wrapper only (needs `window`). */
export function OrderTrackingMapInner({
  destination,
  hub,
  distanceMiles,
  stopsRemaining,
  estimatedArrival,
  className
}: OrderTrackingMapInnerProps) {
  const markerIcon = useMemo(() => createDeliveryMapIcon(), []);

  const destPos = useMemo<LatLngExpression>(
    () => [destination.latitude, destination.longitude],
    [destination.latitude, destination.longitude]
  );

  const hubPos = useMemo<LatLngExpression | null>(() => {
    if (!hub) return null;
    return [hub.latitude, hub.longitude];
  }, [hub]);

  const center = useMemo<LatLngExpression>(() => {
    if (!hub) return destPos;
    return [(hub.latitude + destination.latitude) / 2, (hub.longitude + destination.longitude) / 2];
  }, [hub, destination.latitude, destination.longitude, destPos]);

  const route = useMemo<LatLngExpression[]>(() => {
    if (!hubPos) return [destPos];
    return [hubPos, destPos];
  }, [hubPos, destPos]);

  return (
    <div className={cn('border-border relative overflow-hidden rounded-2xl border', className)}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className='delivery-location-map z-0 h-[280px] w-full sm:h-[320px]'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        />
        {route.length > 1 ? (
          <Polyline
            positions={route}
            pathOptions={{ color: '#c9a96e', weight: 3, opacity: 0.85 }}
          />
        ) : null}
        {hubPos ? <Marker position={hubPos} icon={markerIcon} /> : null}
        <Marker position={destPos} icon={markerIcon} />
      </MapContainer>

      <div className='bg-background/90 absolute inset-x-0 bottom-0 border-t px-4 py-3 backdrop-blur-sm'>
        <Flex
          direction='row'
          justify='between'
          gap={3}
          className='flex-wrap text-center sm:text-left'
        >
          <div className='min-w-0 flex-1'>
            <Typography.Subtle>Distance Left</Typography.Subtle>
            <Typography.Text weight='semibold' className='text-sm'>
              {distanceMiles != null ? `${distanceMiles.toFixed(1)} miles` : '—'}
            </Typography.Text>
          </div>
          <div className='min-w-0 flex-1'>
            <Typography.Subtle>Stops Left</Typography.Subtle>
            <Typography.Text weight='semibold' className='text-sm'>
              {stopsRemaining != null ? `${stopsRemaining} stops` : '—'}
            </Typography.Text>
          </div>
          <div className='min-w-0 flex-1'>
            <Typography.Subtle>Est. Arrival</Typography.Subtle>
            <Typography.Text weight='semibold' className='line-clamp-1 text-sm'>
              {estimatedArrival || '—'}
            </Typography.Text>
          </div>
        </Flex>
      </div>
    </div>
  );
}
