import type { AstrologyBody, AstrologyChart, Aspect } from '../../astrology';
import type { ShareTextPreferences } from './shareOptions';

export interface ShareTextResult {
  text: string;
  summaryLine: string;
  anglesLine?: string;
  aspectHighlights?: string[];
  hashtags?: string[];
  charCount: number;
}

const MAJOR_ASPECTS = new Set(['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile']);

function formatDegree(degree: number): string {
  const normalized = ((degree % 360) + 360) % 360;
  const deg = Math.floor(normalized);
  const minutesFloat = (normalized - deg) * 60;
  const minutes = Math.round(minutesFloat);
  return `${deg}\u00B0${minutes.toString().padStart(2, '0')}'`;
}

function formatBodyPosition(body?: AstrologyBody | null): string | null {
  if (!body) return null;
  return `${body.sign} ${formatDegree(body.signDegree)}`;
}

function getBody(chart: AstrologyChart | null, name: string): AstrologyBody | undefined {
  return chart?.bodies?.find((body) => body.name === name);
}

function buildSummary(chart: AstrologyChart | null, name?: string | null): string {
  const sun = getBody(chart, 'Sun');
  const moon = getBody(chart, 'Moon');
  const owner = name?.trim() ? `${name.trim()}\u2019s ` : '';
  const sunPosition = formatBodyPosition(sun) ?? 'Sun in cosmic flow';
  const moonPosition = formatBodyPosition(moon) ?? 'Moon in motion';
  return `${owner}cosmic snapshot: Sun in ${sunPosition}, Moon in ${moonPosition}.`;
}

function buildAnglesLine(chart: AstrologyChart | null): string | undefined {
  if (!chart?.angles) return undefined;
  const { ascendant, midheaven } = chart.angles;
  const asc = formatBodyPosition(ascendant);
  const mc = formatBodyPosition(midheaven);
  if (!asc && !mc) return undefined;
  if (asc && mc) {
    return `Rising in ${asc}, Midheaven in ${mc}.`;
  }
  if (asc) return `Rising in ${asc}.`;
  if (mc) return `Midheaven in ${mc}.`;
  return undefined;
}

function formatAspect(aspect: Aspect): string {
  const orb = Math.abs(aspect.orb).toFixed(1);
  return `${aspect.body1} ${aspect.type} ${aspect.body2} (${orb}\u00B0 orb)`;
}

function buildAspectHighlights(chart: AstrologyChart | null, take = 2): string[] | undefined {
  if (!chart?.aspects?.length) return undefined;
  const highlights = chart.aspects
    .filter((aspect) => MAJOR_ASPECTS.has(aspect.type))
    .sort((a, b) => Math.abs(a.orb) - Math.abs(b.orb))
    .slice(0, take)
    .map(formatAspect);

  return highlights.length ? highlights : undefined;
}

function buildHashtags(chart: AstrologyChart | null): string[] {
  const sun = getBody(chart, 'Sun');
  const sunTag = sun?.sign ? `#${sun.sign.replace(/\s+/g, '')}Season` : '#StarChart';
  return ['#CosmicCypher', '#Astrology', sunTag];
}

export function generateShareText(
  chart: AstrologyChart | null,
  preferences: ShareTextPreferences,
  customMessage: string,
  name?: string | null
): ShareTextResult {
  const summaryLine = buildSummary(chart, name);
  const anglesLine = preferences.includeAngles ? buildAnglesLine(chart) : undefined;
  const aspectHighlights = preferences.includeAspects ? buildAspectHighlights(chart) : undefined;
  const hashtags = preferences.includeHashtags ? buildHashtags(chart) : undefined;

  const sections: string[] = [summaryLine];

  if (anglesLine) sections.push(anglesLine);
  if (aspectHighlights?.length) {
    sections.push(`Highlights: ${aspectHighlights.join('; ')}`);
  }
  if (customMessage.trim().length) {
    sections.push(customMessage.trim());
  }
  if (hashtags?.length) {
    sections.push(hashtags.join(' '));
  }

  const text = sections.join('\n');

  return {
    text,
    summaryLine,
    anglesLine,
    aspectHighlights,
    hashtags,
    charCount: text.length
  };
}
