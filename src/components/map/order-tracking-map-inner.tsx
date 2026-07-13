'use client';

import 'leaflet/dist/leaflet.css';

import type { LatLngExpression } from 'leaflet';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, ZoomControl } from 'react-leaflet';

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
  const t = useTranslations('orderTracking.page');
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
    <div
      className={cn(
        'border-border relative h-full min-h-[min(52vh,420px)] overflow-hidden rounded-2xl border sm:min-h-[480px] lg:min-h-[560px]',
        className
      )}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        zoomControl={false}
        className='delivery-location-map absolute inset-0 z-0 h-full w-full'
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url='https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        />
        <ZoomControl position='bottomright' />
        {route.length > 1 ? (
          <Polyline
            positions={route}
            pathOptions={{ color: '#22c55e', weight: 4, opacity: 0.9, dashArray: '8 10' }}
          />
        ) : null}
        {hubPos ? <Marker position={hubPos} icon={markerIcon} /> : null}
        <Marker position={destPos} icon={markerIcon} />
      </MapContainer>

      <div className='bg-background/95 absolute inset-x-0 bottom-0 z-[400] border-t px-4 py-3.5 backdrop-blur-md sm:px-6 sm:py-4'>
        <Flex
          direction='row'
          justify='between'
          gap={3}
          className='flex-wrap text-center sm:text-left'
        >
          <div className='min-w-0 flex-1'>
            <Typography.Subtle>{t('distanceLeft')}</Typography.Subtle>
            <Typography.Text weight='semibold' className='text-sm sm:text-base'>
              {distanceMiles != null
                ? t('distanceMiles', { miles: distanceMiles.toFixed(1) })
                : '—'}
            </Typography.Text>
          </div>
          <div className='min-w-0 flex-1'>
            <Typography.Subtle>{t('stopsLeft')}</Typography.Subtle>
            <Typography.Text weight='semibold' className='text-sm sm:text-base'>
              {stopsRemaining != null ? t('stopsCount', { count: stopsRemaining }) : '—'}
            </Typography.Text>
          </div>
          <div className='min-w-0 flex-1'>
            <Typography.Subtle>{t('estArrival')}</Typography.Subtle>
            <Typography.Text weight='semibold' className='line-clamp-1 text-sm sm:text-base'>
              {estimatedArrival || '—'}
            </Typography.Text>
          </div>
        </Flex>
      </div>
    </div>
  );
}
