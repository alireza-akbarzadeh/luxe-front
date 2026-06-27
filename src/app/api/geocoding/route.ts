import { NextRequest, NextResponse } from 'next/server';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'Luxe-Front/1.0 (address picker; contact@luxe.app)';

/**
 * Proxies OpenStreetMap Nominatim requests so we respect usage policy
 * and avoid browser CORS limitations.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get('mode');

  if (mode === 'reverse') {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json({ message: 'lat and lon are required' }, { status: 400 });
    }

    const url = new URL('/reverse', NOMINATIM_BASE);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Reverse geocoding failed' },
        { status: response.status }
      );
    }

    const payload = await response.json();
    if (payload && typeof payload === 'object' && 'error' in payload) {
      return NextResponse.json({ message: 'Reverse geocoding failed' }, { status: 422 });
    }

    return NextResponse.json(payload);
  }

  if (mode === 'search') {
    const query = searchParams.get('q');

    if (!query || query.trim().length < 3) {
      return NextResponse.json({ message: 'q must be at least 3 characters' }, { status: 400 });
    }

    const url = new URL('/search', NOMINATIM_BASE);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '5');
    url.searchParams.set('q', query.trim());

    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Address search failed' }, { status: response.status });
    }

    return NextResponse.json(await response.json());
  }

  return NextResponse.json({ message: 'Invalid mode' }, { status: 400 });
}
