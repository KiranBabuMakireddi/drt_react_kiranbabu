import type { Satellite } from '../types/satellite';

const BASE_URL = 'https://backend.digantara.dev/v1/satellites';

type Filters = {
  objectTypes: string[];
  orbitCodes: string[];
};

export async function fetchSatellites(filters: Filters, attributes: string[]): Promise<Satellite[]> {
  const params = new URLSearchParams();

  if (filters.objectTypes.length) {
    params.append('objectTypes', filters.objectTypes.join(','));
  }

  if (attributes.length) {
    params.append('attributes', attributes.join(','));
  }

  const url = `${BASE_URL}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch satellite data');
  }

  const json = await res.json();
  return json.data as Satellite[];
}
