export function normalizeApiBase(input: string): string {
  const value = input.trim().replace(/\/+$/, '');
  if (value.startsWith('/') && !value.startsWith('//')) return value || '/api';
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error('Use an HTTP or HTTPS URL without embedded credentials, or /api.');
  }
  return value;
}

export async function checkApiHealth(base: string): Promise<{ status: string; mode?: string }> {
  const safeBase = normalizeApiBase(base);
  const response = await fetch(safeBase + '/health', {
    signal: AbortSignal.timeout(5000),
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('The API returned HTTP ' + response.status + '.');
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('status' in data) || data.status !== 'ok') {
    throw new Error('The endpoint did not return the expected health response.');
  }
  return data as { status: string; mode?: string };
}

