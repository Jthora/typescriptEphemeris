import React from 'react';
import { User, MapPin, CalendarDays, Clock } from 'lucide-react';
import type { BirthData } from '../astrology';

interface LeftSideDrawerProps {
  birthData: BirthData;
  isCalculating: boolean;
  isRealTimeMode: boolean;
  onInputChange: (field: keyof BirthData, value: string | number | Date) => void;
  toggleRealTimeMode: () => void;
  resetToCurrentTime: () => void;
}

const LeftSideDrawer: React.FC<LeftSideDrawerProps> = ({
  birthData,
  isCalculating,
  isRealTimeMode,
  onInputChange,
  toggleRealTimeMode,
  resetToCurrentTime
}) => {
  // Format date for the input
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="left-side-drawer">
      <div className="drawer-header">
        <h2>Birth Information</h2>
        <p>Enter your birth details to calculate your chart</p>
      </div>

      <div className="drawer-content">
        <div className="form-card">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <User size={16} />
              <span>Name</span>
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={birthData.name || ''}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude" className="form-label">
              <MapPin size={16} />
              <span>Latitude</span>
            </label>
            <input
              type="number"
              id="latitude"
              className="form-input"
              value={birthData.latitude}
              onChange={(e) => onInputChange('latitude', parseFloat(e.target.value) || 0)}
              step="0.0001"
              placeholder="Latitude (e.g. 47.6062)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude" className="form-label">
              <MapPin size={16} />
              <span>Longitude</span>
            </label>
            <input
              type="number"
              id="longitude"
              className="form-input"
              value={birthData.longitude}
              onChange={(e) => onInputChange('longitude', parseFloat(e.target.value) || 0)}
              step="0.0001"
              placeholder="Longitude (e.g. -122.3321)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              <CalendarDays size={16} />
              <span>Date & Time</span>
            </label>
            <input
              type="datetime-local"
              id="date"
              className="form-input"
              value={formatDateForInput(birthData.date)}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : new Date();
                onInputChange('date', date);
              }}
            />
          </div>

          {/* House System dropdown removed - using Equal House only */}

          {/* The form-actions div with Real-time and Now buttons has been moved to BottomBar component */}
        </div>
      </div>
    </div>
  );
};

export default LeftSideDrawer;
