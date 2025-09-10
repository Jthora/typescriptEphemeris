export interface ElementColorMap { fire:[number,number,number]; earth:[number,number,number]; air:[number,number,number]; water:[number,number,number]; }

export const DEFAULT_ELEMENT_COLOR_MAP: ElementColorMap = {
  fire:  [1.00, 0.35, 0.05],
  earth: [0.45, 0.85, 0.30],
  air:   [0.55, 0.65, 1.00],
  water: [0.20, 0.55, 0.95]
};

export function elementVectorToRGB(feaw: [number,number,number,number], map: ElementColorMap = DEFAULT_ELEMENT_COLOR_MAP): [number,number,number] {
  const [f,e,a,w] = feaw;
  const r = f*map.fire[0] + e*map.earth[0] + a*map.air[0] + w*map.water[0];
  const g = f*map.fire[1] + e*map.earth[1] + a*map.air[1] + w*map.water[1];
  const b = f*map.fire[2] + e*map.earth[2] + a*map.air[2] + w*map.water[2];
  return [r,g,b];
}
