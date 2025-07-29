import React from 'react';

interface AspectLinesProps {
  aspects: any[];
  bodies: any[];
  houseRadius: number;
  strokeColor: string;
  getThemeColor: (name: string) => string;
}

export const AspectLines: React.FC<AspectLinesProps> = ({
  aspects,
  bodies,
  houseRadius,
  strokeColor,
  getThemeColor
}) => {
  const aspectRadius = houseRadius * 0.4;

  const getAspectColorAndGradient = (aspectType: string) => {
    let aspectColor;
    let aspectGradientId;
    
    if (aspectType === 'Trine' || aspectType === 'Sextile') {
      aspectColor = getThemeColor('success'); // Harmonious (green)
      aspectGradientId = 'aspect-success-gradient';
    } else if (aspectType === 'Square' || aspectType === 'Opposition') {
      aspectColor = getThemeColor('error'); // Challenging (red)
      aspectGradientId = 'aspect-error-gradient';
    } else {
      aspectColor = getThemeColor('primary'); // Neutral (blue)
      aspectGradientId = 'aspect-primary-gradient';
    }
    
    return { aspectColor, aspectGradientId };
  };

  const majorAspects = aspects.filter(aspect => 
    ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(aspect.type)
  );

  return (
    <g className="aspect-lines">
      {/* Create gradient definitions for each unique aspect type */}
      <defs>
        {[...new Set(majorAspects.map(a => a.type))].map((aspectType, index) => {
          const { aspectColor, aspectGradientId } = getAspectColorAndGradient(aspectType);
          
          return (
            <linearGradient
              key={`${aspectType}-${index}`}
              id={aspectGradientId}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={aspectColor} stopOpacity={0.9} />
              <stop offset="50%" stopColor={aspectColor} stopOpacity={0.7} />
              <stop offset="100%" stopColor={aspectColor} stopOpacity={0.9} />
            </linearGradient>
          );
        })}
      </defs>

      {majorAspects.map((aspect, index) => {
        const body1 = bodies.find(b => b.name === aspect.body1);
        const body2 = bodies.find(b => b.name === aspect.body2);
        
        if (!body1 || !body2) return null;

        const angle1 = (body1.longitude - 90) * (Math.PI / 180);
        const angle2 = (body2.longitude - 90) * (Math.PI / 180);
        
        const x1 = Math.cos(angle1) * aspectRadius;
        const y1 = Math.sin(angle1) * aspectRadius;
        const x2 = Math.cos(angle2) * aspectRadius;
        const y2 = Math.sin(angle2) * aspectRadius;

        const { aspectGradientId } = getAspectColorAndGradient(aspect.type);
        const strokeWidth = aspect.type === 'Conjunction' || aspect.type === 'Opposition' ? 2.5 : 1.5;
        const strokeDashArray = aspect.type === 'Square' ? '5,5' : 'none';

        return (
          <line
            key={`${aspect.body1}-${aspect.body2}-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`url(#${aspectGradientId})`}
            strokeWidth={strokeWidth}
            opacity={0.85}
            strokeDasharray={strokeDashArray}
            filter="url(#glow)"
          />
        );
      })}
    </g>
  );
};
