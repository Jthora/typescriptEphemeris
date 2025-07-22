import React from 'react';
import type { AstrologyChart } from '../astrology';
import { ZODIAC_SIGNS, PLANET_SYMBOLS, ASPECTS } from '../astrology';
import './ChartDetails.css';

interface ChartDetailsProps {
  chart: AstrologyChart;
}

export const ChartDetails: React.FC<ChartDetailsProps> = ({ chart }) => {
  const formatDegrees = (degrees: number): string => {
    const signDegrees = degrees % 30;
    const deg = Math.floor(signDegrees);
    const min = Math.floor((signDegrees - deg) * 60);
    return `${deg}°${min.toString().padStart(2, '0')}'`;
  };

  const getSignName = (degrees: number): string => {
    const signIndex = Math.floor(degrees / 30) % 12;
    return ZODIAC_SIGNS[signIndex].name;
  };

  const getHousePosition = (longitude: number): number => {
    // Find which house this longitude falls into
    for (let i = 0; i < 12; i++) {
      const currentCusp = chart.houses.cusps[i];
      const nextCusp = chart.houses.cusps[(i + 1) % 12];
      
      // Handle wrapping around 360 degrees
      if (nextCusp > currentCusp) {
        if (longitude >= currentCusp && longitude < nextCusp) {
          return i + 1;
        }
      } else {
        // House spans across 0 degrees
        if (longitude >= currentCusp || longitude < nextCusp) {
          return i + 1;
        }
      }
    }
    return 1; // Default to first house
  };

  return (
    <div className="chart-details">
      <div className="details-section">
        <h3>🌟 Planetary Positions</h3>
        <div className="planets-grid">
          {chart.bodies.map((body) => (
            <div key={body.name} className="planet-row">
              <div className="planet-info">
                <span className="planet-symbol" style={{ color: PLANET_SYMBOLS[body.name as keyof typeof PLANET_SYMBOLS]?.color || '#333' }}>
                  {body.symbol}
                </span>
                <span className="planet-name">{body.name}</span>
                {body.retrograde && <span className="retrograde">℞</span>}
              </div>
              <div className="position-info">
                <span className="sign">{getSignName(body.longitude)} {formatDegrees(body.longitude)}</span>
                <span className="house">House {getHousePosition(body.longitude)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="details-section">
        <h3>🏠 House Cusps</h3>
        <div className="houses-grid">
          {chart.houses.cusps.map((cusp, index) => (
            <div key={index} className="house-row">
              <span className="house-number">House {index + 1}</span>
              <span className="house-sign">{getSignName(cusp)} {formatDegrees(cusp)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="details-section">
        <h3>🔗 Major Aspects</h3>
        <div className="aspects-grid">
          {chart.aspects
            .filter(aspect => ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(aspect.type))
            .map((aspect, index) => {
              const aspectInfo = ASPECTS[aspect.type as keyof typeof ASPECTS];
              return (
                <div key={index} className="aspect-row">
                  <div className="aspect-bodies">
                    <span>{aspect.body1}</span>
                    <span className="aspect-symbol" style={{ color: aspectInfo?.color || '#333' }}>
                      {aspectInfo?.symbol || aspect.type}
                    </span>
                    <span>{aspect.body2}</span>
                  </div>
                  <div className="aspect-details">
                    <span className="aspect-type">{aspect.type}</span>
                    <span className="aspect-orb">Orb: {Math.abs(aspect.orb).toFixed(1)}°</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="details-section">
        <h3>☊ Lunar Nodes</h3>
        <div className="nodes-grid">
          <div className="node-row">
            <span className="node-symbol">☊</span>
            <span className="node-name">North Node</span>
            <span className="node-position">
              {getSignName(chart.nodes.northNode.longitude)} {formatDegrees(chart.nodes.northNode.longitude)}
            </span>
          </div>
          <div className="node-row">
            <span className="node-symbol">☋</span>
            <span className="node-name">South Node</span>
            <span className="node-position">
              {getSignName(chart.nodes.southNode.longitude)} {formatDegrees(chart.nodes.southNode.longitude)}
            </span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h3>📊 Chart Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Birth Date:</span>
            <span className="summary-value">{chart.birthData.date.toLocaleDateString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Birth Time:</span>
            <span className="summary-value">{chart.birthData.date.toLocaleTimeString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Location:</span>
            <span className="summary-value">
              {chart.birthData.latitude.toFixed(4)}°, {chart.birthData.longitude.toFixed(4)}°
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">House System:</span>
            <span className="summary-value">{chart.houses.system}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Planets:</span>
            <span className="summary-value">{chart.bodies.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Major Aspects:</span>
            <span className="summary-value">
              {chart.aspects.filter(a => ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(a.type)).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDetails;
