/**
 * SVG Element Tracker for Performance Optimization
 * 
 * This module provides a system to track SVG elements and their states
 * to enable selective updates instead of complete DOM rebuilds.
 */

export interface ElementState {
  id: string;
  type: 'static' | 'dynamic' | 'conditional';
  element?: SVGElement;
  attributes: Record<string, string | number>;
  content?: string;
  hash?: string;
}

export interface ChartElements {
  // Static elements (never change)
  background: ElementState[];
  gradients: ElementState[];
  patterns: ElementState[];
  filters: ElementState[];
  
  // Dynamic elements (change with chart data)
  zodiacSigns: ElementState[];
  houses: ElementState[];
  planets: ElementState[];
  aspects: ElementState[];
  
  // Conditional elements (may or may not be present)
  decans: ElementState[];
  houseCusps: ElementState[];
}

export class SVGElementTracker {
  private elements: ChartElements;
  private lastHash: string = '';
  
  constructor() {
    this.elements = {
      background: [],
      gradients: [],
      patterns: [],
      filters: [],
      zodiacSigns: [],
      houses: [],
      planets: [],
      aspects: [],
      decans: [],
      houseCusps: []
    };
  }

  /**
   * Generate a hash for the current chart state to detect changes
   */
  generateChartHash(chart: any): string {
    const stateData = {
      planets: chart.planets.map((p: any) => ({
        name: p.name,
        longitude: Math.round(p.longitude * 1000) / 1000, // Round to 3 decimal places
        isRetrograde: p.isRetrograde
      })),
      houses: chart.houses.map((h: any) => Math.round(h * 1000) / 1000),
      aspects: chart.aspects.map((a: any) => ({
        planet1: a.planet1,
        planet2: a.planet2,
        type: a.type,
        orb: Math.round(a.orb * 100) / 100
      }))
    };
    
    return btoa(JSON.stringify(stateData));
  }

  /**
   * Check if chart has changed since last render
   */
  hasChartChanged(chart: any): boolean {
    const currentHash = this.generateChartHash(chart);
    const changed = currentHash !== this.lastHash;
    this.lastHash = currentHash;
    return changed;
  }

  /**
   * Create element state object
   */
  createElement(
    id: string, 
    type: 'static' | 'dynamic' | 'conditional',
    attributes: Record<string, string | number>,
    content?: string
  ): ElementState {
    const hash = this.hashAttributes(attributes, content);
    return {
      id,
      type,
      attributes,
      content,
      hash
    };
  }

  /**
   * Hash attributes and content for change detection
   */
  private hashAttributes(attributes: Record<string, string | number>, content?: string): string {
    const data = { ...attributes, content };
    return btoa(JSON.stringify(data));
  }

  /**
   * Update element state and detect changes
   */
  updateElement(
    category: keyof ChartElements,
    id: string,
    attributes: Record<string, string | number>,
    content?: string
  ): { changed: boolean; element: ElementState } {
    const newHash = this.hashAttributes(attributes, content);
    
    const existingIndex = this.elements[category].findIndex(el => el.id === id);
    const existing = existingIndex >= 0 ? this.elements[category][existingIndex] : null;
    
    const changed = !existing || existing.hash !== newHash;
    
    const element: ElementState = {
      id,
      type: existing?.type || 'dynamic',
      attributes,
      content,
      hash: newHash,
      element: existing?.element
    };

    if (existingIndex >= 0) {
      this.elements[category][existingIndex] = element;
    } else {
      this.elements[category].push(element);
    }

    return { changed, element };
  }

  /**
   * Get all elements in a category
   */
  getElements(category: keyof ChartElements): ElementState[] {
    return this.elements[category];
  }

  /**
   * Register DOM element reference
   */
  registerElement(category: keyof ChartElements, id: string, element: SVGElement): void {
    const existing = this.elements[category].find(el => el.id === id);
    if (existing) {
      existing.element = element;
    }
  }

  /**
   * Get changes between current and new state
   */
  getChanges(newChart: any): {
    toUpdate: { category: keyof ChartElements; elements: ElementState[] }[];
    toRemove: { category: keyof ChartElements; elements: ElementState[] }[];
    toAdd: { category: keyof ChartElements; elements: ElementState[] }[];
  } {
    // This would contain logic to compare current state with new chart
    // and return what needs to be updated, removed, or added
    // For now, returning empty structure - will be implemented in next phase
    return {
      toUpdate: [],
      toRemove: [],
      toAdd: []
    };
  }

  /**
   * Clear all tracked elements
   */
  clear(): void {
    Object.keys(this.elements).forEach(key => {
      this.elements[key as keyof ChartElements] = [];
    });
    this.lastHash = '';
  }

  /**
   * Get performance metrics
   */
  getMetrics(): {
    totalElements: number;
    staticElements: number;
    dynamicElements: number;
    conditionalElements: number;
  } {
    let total = 0;
    let staticCount = 0;
    let dynamicCount = 0;
    let conditionalCount = 0;

    Object.values(this.elements).forEach(category => {
      category.forEach((element: ElementState) => {
        total++;
        switch (element.type) {
          case 'static': staticCount++; break;
          case 'dynamic': dynamicCount++; break;
          case 'conditional': conditionalCount++; break;
        }
      });
    });

    return {
      totalElements: total,
      staticElements: staticCount,
      dynamicElements: dynamicCount,
      conditionalElements: conditionalCount
    };
  }
}

// Singleton instance for use across the application
export const svgTracker = new SVGElementTracker();
