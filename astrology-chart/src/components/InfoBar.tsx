import React from 'react';

export interface StatsInfo {
  drawMs: number;
  uploadMs?: number;
  uploadMode?: 'full' | 'sub' | string;
  tiles?: number;
  rows?: number;
  cols?: number;
}

export interface SummaryInfo {
  spanHours: number;
  lod: number;
  refinedCount: number;
  prevCount?: number;
  nextCount?: number;
}

interface InfoBarProps {
  hoverTime?: number | null;
  stats?: StatsInfo | null;
  summary: SummaryInfo;
}

const microConsoleStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  minWidth: 180,
  maxWidth: 280,
  padding: '2px 4px',
  borderRadius: 4,
  background: '#0a0a0a',
  border: '1px solid #222',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)'
};

const lineStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: 12,
  lineHeight: 1.0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '#a8a8a8',
  // Slightly smaller and shrink-to-fit feel via clamp
  fontSize: 'clamp(8px, 1.2vw, 10px)',
  fontVariantNumeric: 'tabular-nums'
};

const labelStyle: React.CSSProperties = {
  color: '#6e6e6e',
  marginRight: 4,
  flex: '0 0 auto'
};

const valueStyle: React.CSSProperties = {
  flex: '1 1 auto',
  minWidth: 0, // allow ellipsis
};

function formatShortTime(ms: number): string {
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

const InfoBar: React.FC<InfoBarProps> = ({ hoverTime, stats, summary }) => {
  const fullIso = hoverTime ? new Date(hoverTime).toISOString() : undefined;
  const timeLabel = hoverTime ? formatShortTime(hoverTime) : '—:—:—';

  const statsLabel = stats
    ? `draw ${stats.drawMs.toFixed(1)}ms • up ${stats.uploadMs?.toFixed(1) ?? '–'}ms${stats.uploadMode ? `(${stats.uploadMode})` : ''}${
        stats.tiles != null && stats.rows != null && stats.cols != null ? ` • ${stats.tiles}:${stats.rows}:${stats.cols}` : ''
      }`
    : '—';

  const summaryLabel = `${summary.spanHours.toFixed(2)}h • LOD${summary.lod} • ref ${summary.refinedCount}`;

  return (
    <div className="timestream-info" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
      <div className="timestream-micro-console" style={microConsoleStyle}>
        <div className="line time" style={{ ...lineStyle }} title={fullIso ?? 'No hover'}>
          <span style={labelStyle}>time</span>
          <span style={valueStyle}>{timeLabel}</span>
        </div>
        <div className="line stats" style={{ ...lineStyle }} title={statsLabel}>
          <span style={labelStyle}>stats</span>
          <span style={valueStyle}>{statsLabel}</span>
        </div>
        <div className="line summary" style={{ ...lineStyle }} title={summaryLabel}>
          <span style={labelStyle}>span</span>
          <span style={valueStyle}>{summaryLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default InfoBar;
