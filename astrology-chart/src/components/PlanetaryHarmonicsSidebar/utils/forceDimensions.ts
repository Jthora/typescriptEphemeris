/**
 * Utility functions for calculating 15-dimensional cosmic force comparisons
 * Represents all pairwise ratios between the 6 cosmic forces
 */

export interface ForceComparison {
  leftForce: string;
  rightForce: string;
  leftValue: number;
  rightValue: number;
  ratio: number; // -1 to 1, negative means left is stronger, positive means right is stronger
  balance: number; // 0 to 1, for the white balance bar
}

/**
 * Generate all 15 possible force pair combinations in triangular order
 */
export function generateForcePairs(): Array<[string, string]> {
  const forces = ['Core', 'Void', 'Order', 'Chaos', 'Alpha', 'Omega'];
  const pairs: Array<[string, string]> = [];
  
  for (let i = 0; i < forces.length; i++) {
    for (let j = i + 1; j < forces.length; j++) {
      pairs.push([forces[i], forces[j]]);
    }
  }
  
  return pairs;
}

/**
 * Calculate dimensional comparisons from processed force data
 */
export function calculateForceComparisons(
  processedForceData: Array<{
    name: string;
    fractional: number;
    normalized: number;
    differential: number;
  }>
): ForceComparison[] {
  const forcePairs = generateForcePairs();
  const forceMap = new Map(
    processedForceData.map(force => [force.name, force])
  );
  
  return forcePairs.map(([leftForce, rightForce]) => {
    const leftData = forceMap.get(leftForce);
    const rightData = forceMap.get(rightForce);
    
    if (!leftData || !rightData) {
      return {
        leftForce,
        rightForce,
        leftValue: 0,
        rightValue: 0,
        ratio: 0,
        balance: 0.5
      };
    }
    
    const leftValue = leftData.fractional;
    const rightValue = rightData.fractional;
    const total = leftValue + rightValue;
    
    // Calculate ratio: -1 (left stronger) to +1 (right stronger)
    const ratio = total > 0 ? (rightValue - leftValue) / total : 0;
    
    // Calculate balance position for white bar: 0 (left) to 1 (right)
    const balance = total > 0 ? rightValue / total : 0.5;
    
    return {
      leftForce,
      rightForce,
      leftValue,
      rightValue,
      ratio,
      balance
    };
  });
}

/**
 * Organize 15 comparisons into 3 rows of 5 columns
 */
export function organizeComparisonsGrid(comparisons: ForceComparison[]): ForceComparison[][] {
  const grid: ForceComparison[][] = [];
  
  for (let row = 0; row < 3; row++) {
    const rowStart = row * 5;
    const rowEnd = Math.min(rowStart + 5, comparisons.length);
    grid.push(comparisons.slice(rowStart, rowEnd));
  }
  
  return grid;
}
