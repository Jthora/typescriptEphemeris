#!/usr/bin/env tsx

/**
 * Example usage of the TypeScript Ephemeris Calculator
 */

import EphemerisCalculator, { formatRA, formatDec } from './index.js';
import Astronomy from 'astronomy-engine';

// Create calculator for Greenwich Observatory
const ephemeris = new EphemerisCalculator(51.4769, -0.0005, 46);

// Calculate Mars ephemeris for the next 30 days
const options = {
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  stepSize: 1, // 1 day steps
  includeVelocity: true
};

console.log('🔴 Mars Ephemeris (Next 30 Days)');
console.log('='.repeat(60));

const marsData = ephemeris.calculatePlanetEphemeris(Astronomy.Body.Mars, options);

marsData.slice(0, 5).forEach((data, index) => {
  const date = new Date(options.startDate.getTime() + index * options.stepSize * 24 * 60 * 60 * 1000);
  console.log(`\nDate: ${date.toDateString()}`);
  console.log(`RA:   ${formatRA(data.position.ra)}`);
  console.log(`Dec:  ${formatDec(data.position.dec)}`);
  console.log(`Dist: ${data.position.distance.toFixed(4)} AU`);
  
  if (data.velocity.ra !== 0) {
    console.log(`RA Motion:  ${(data.velocity.ra * 3600).toFixed(2)} arcsec/day`);
    console.log(`Dec Motion: ${(data.velocity.dec * 3600).toFixed(2)} arcsec/day`);
  }
});

// Calculate Moon phases and positions
console.log('\n\n🌙 Moon Ephemeris (Next 7 Days)');
console.log('='.repeat(60));

const moonOptions = {
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  stepSize: 1,
  includeVelocity: false
};

const moonData = ephemeris.calculateMoonEphemeris(moonOptions);

moonData.forEach((data, index) => {
  const date = new Date(moonOptions.startDate.getTime() + index * moonOptions.stepSize * 24 * 60 * 60 * 1000);
  console.log(`\n${date.toDateString()}`);
  console.log(`RA:   ${formatRA(data.position.ra)}`);
  console.log(`Dec:  ${formatDec(data.position.dec)}`);
  console.log(`Dist: ${data.position.distance.toFixed(6)} AU`);
});

// Calculate rise/set times for today
console.log('\n\n☀️ Sun Rise/Set Times (Today)');
console.log('='.repeat(60));

const today = new Date();
const sunTimes = ephemeris.calculateRiseTransitSet(Astronomy.Body.Sun, today);

if (sunTimes.rise) console.log(`Sunrise:  ${sunTimes.rise.toLocaleTimeString()}`);
if (sunTimes.transit) console.log(`Transit:  ${sunTimes.transit.toLocaleTimeString()}`);
if (sunTimes.set) console.log(`Sunset:   ${sunTimes.set.toLocaleTimeString()}`);

const moonTimes = ephemeris.calculateRiseTransitSet(Astronomy.Body.Moon, today);
console.log('\n🌙 Moon Rise/Set Times (Today)');
if (moonTimes.rise) console.log(`Moonrise: ${moonTimes.rise.toLocaleTimeString()}`);
if (moonTimes.transit) console.log(`Transit:  ${moonTimes.transit.toLocaleTimeString()}`);
if (moonTimes.set) console.log(`Moonset:  ${moonTimes.set.toLocaleTimeString()}`);

console.log('\n✨ Ephemeris calculation complete!');
