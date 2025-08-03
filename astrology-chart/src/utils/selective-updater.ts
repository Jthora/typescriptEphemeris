/**
 * Selective SVG Update Utilities
 * 
 * This module provides utilities for selective DOM updates instead of complete rebuilds.
 */

import * as d3 from 'd3';
import type { ElementState } from './svg-element-tracker';
import { svgTracker } from './svg-element-tracker';

export interface UpdateOperation {
  type: 'create' | 'update' | 'remove';
  category: string;
  elementId: string;
  element?: ElementState;
}

export class SelectiveUpdater {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private defs: d3.Selection<SVGDefsElement, unknown, null, undefined>;
  private mainGroup: d3.Selection<SVGGElement, unknown, null, undefined>;

  constructor(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
    mainGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  ) {
    this.svg = svg;
    this.defs = defs;
    this.mainGroup = mainGroup;
  }

  /**
   * Apply selective updates to the SVG
   */
  applyUpdates(operations: UpdateOperation[]): void {
    const startTime = performance.now();
    let operationCount = 0;

    operations.forEach(op => {
      switch (op.type) {
        case 'create':
          this.createElement(op);
          operationCount++;
          break;
        case 'update':
          this.updateElement(op);
          operationCount++;
          break;
        case 'remove':
          this.removeElement(op);
          operationCount++;
          break;
      }
    });

    const endTime = performance.now();
    console.log(`⚡ Selective update: ${operationCount} operations in ${(endTime - startTime).toFixed(2)}ms`);
  }

  /**
   * Create a new SVG element
   */
  private createElement(operation: UpdateOperation): void {
    if (!operation.element) return;

    const { element } = operation;
    const parent = this.getParentSelection(operation.category);
    
    if (!parent) {
      console.warn(`No parent found for category: ${operation.category}`);
      return;
    }

    let svgElement: d3.Selection<SVGElement, unknown, null, undefined>;

    // Create element based on its attributes
    const elementType = this.getElementType(element);
    svgElement = parent.append(elementType);

    // Apply all attributes
    Object.entries(element.attributes).forEach(([key, value]) => {
      svgElement.attr(key, value);
    });

    // Set content if present
    if (element.content) {
      svgElement.text(element.content);
    }

    // Register the DOM element
    const domElement = svgElement.node() as SVGElement;
    if (domElement) {
      svgTracker.registerElement(
        operation.category as keyof import('./svg-element-tracker').ChartElements,
        element.id,
        domElement
      );
    }
  }

  /**
   * Update an existing SVG element
   */
  private updateElement(operation: UpdateOperation): void {
    if (!operation.element) return;

    const { element } = operation;
    const domElement = element.element;
    
    if (!domElement) {
      // Element doesn't exist, create it instead
      this.createElement(operation);
      return;
    }

    const selection = d3.select(domElement);

    // Update attributes
    Object.entries(element.attributes).forEach(([key, value]) => {
      const currentValue = selection.attr(key);
      if (currentValue !== String(value)) {
        selection.attr(key, value);
      }
    });

    // Update content if present
    if (element.content && selection.text() !== element.content) {
      selection.text(element.content);
    }
  }

  /**
   * Remove an SVG element
   */
  private removeElement(operation: UpdateOperation): void {
    const elements = svgTracker.getElements(
      operation.category as keyof import('./svg-element-tracker').ChartElements
    );
    
    const element = elements.find(el => el.id === operation.elementId);
    if (element?.element) {
      d3.select(element.element).remove();
      element.element = undefined;
    }
  }

  /**
   * Get parent selection for a category
   */
  private getParentSelection(category: string): d3.Selection<SVGElement, unknown, null, undefined> | null {
    switch (category) {
      case 'gradients':
      case 'patterns':
      case 'filters':
        return this.defs as any;
      
      case 'background':
      case 'zodiacSigns':
      case 'houses':
      case 'planets':
      case 'aspects':
      case 'decans':
      case 'houseCusps':
      default:
        return this.mainGroup as any;
    }
  }

  /**
   * Determine SVG element type from ElementState
   */
  private getElementType(element: ElementState): string {
    // Try to infer from attributes or use defaults
    if (element.attributes.href || element.attributes['xlink:href']) {
      return 'image';
    }
    if (element.attributes.cx !== undefined && element.attributes.cy !== undefined) {
      return 'circle';
    }
    if (element.attributes.d) {
      return 'path';
    }
    if (element.attributes.x1 !== undefined && element.attributes.y1 !== undefined) {
      return 'line';
    }
    if (element.content) {
      return 'text';
    }
    if (element.attributes.transform) {
      return 'g';
    }
    
    // Default fallback
    return 'g';
  }

  /**
   * Update planet positions (most common update)
   */
  updatePlanetPositions(planets: any[]): void {
    const operations: UpdateOperation[] = [];

    planets.forEach((planet, index) => {
      const planetId = `planet-${planet.name}`;
      const angle = (planet.longitude - 90) * (Math.PI / 180);
      const radius = 200; // This should match the radius calculation in ChartWheel
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Update planet group position
      operations.push({
        type: 'update',
        category: 'planets',
        elementId: planetId,
        element: svgTracker.createElement(
          planetId,
          'dynamic',
          {
            id: planetId,
            transform: `translate(${x}, ${y})`
          }
        )
      });

      // Update planet line
      operations.push({
        type: 'update',
        category: 'planets',
        elementId: `${planetId}-line`,
        element: svgTracker.createElement(
          `${planetId}-line`,
          'dynamic',
          {
            id: `${planetId}-line`,
            x1: 0,
            y1: 0,
            x2: x * 0.8,
            y2: y * 0.8,
            stroke: '#666',
            'stroke-width': 1
          }
        )
      });
    });

    this.applyUpdates(operations);
  }

  /**
   * Update aspect lines
   */
  updateAspectLines(aspects: any[]): void {
    const operations: UpdateOperation[] = [];

    // Remove existing aspects
    const existingAspects = svgTracker.getElements('aspects');
    existingAspects.forEach(aspect => {
      operations.push({
        type: 'remove',
        category: 'aspects',
        elementId: aspect.id
      });
    });

    // Add new aspects
    aspects.forEach((aspect, index) => {
      const aspectId = `aspect-${index}`;
      const planet1Angle = (aspect.planet1.longitude - 90) * (Math.PI / 180);
      const planet2Angle = (aspect.planet2.longitude - 90) * (Math.PI / 180);
      const radius = 150; // Inner radius for aspects

      const x1 = Math.cos(planet1Angle) * radius;
      const y1 = Math.sin(planet1Angle) * radius;
      const x2 = Math.cos(planet2Angle) * radius;
      const y2 = Math.sin(planet2Angle) * radius;

      operations.push({
        type: 'create',
        category: 'aspects',
        elementId: aspectId,
        element: svgTracker.createElement(
          aspectId,
          'dynamic',
          {
            id: aspectId,
            x1,
            y1,
            x2,
            y2,
            stroke: this.getAspectColor(aspect.type),
            'stroke-width': this.getAspectWidth(aspect.type),
            opacity: 0.7
          }
        )
      });
    });

    this.applyUpdates(operations);
  }

  /**
   * Get aspect color based on type
   */
  private getAspectColor(aspectType: string): string {
    const colors: Record<string, string> = {
      conjunction: '#ff6b6b',
      opposition: '#ff8e53',
      trine: '#4ecdc4',
      square: '#45b7d1',
      sextile: '#96ceb4',
      quincunx: '#ffeaa7',
      semisextile: '#dda0dd',
      semisquare: '#98d8c8',
      sesquiquadrate: '#f7dc6f'
    };
    return colors[aspectType] || '#666';
  }

  /**
   * Get aspect line width based on type
   */
  private getAspectWidth(aspectType: string): number {
    const weights: Record<string, number> = {
      conjunction: 3,
      opposition: 3,
      trine: 2,
      square: 2,
      sextile: 1.5,
      quincunx: 1,
      semisextile: 1,
      semisquare: 1,
      sesquiquadrate: 1
    };
    return weights[aspectType] || 1;
  }
}

/**
 * Factory function to create selective updater
 */
export function createSelectiveUpdater(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
): SelectiveUpdater | null {
  const defs = svg.select<SVGDefsElement>('defs');
  const mainGroup = svg.select<SVGGElement>('g');
  
  if (defs.empty() || mainGroup.empty()) {
    console.warn('Cannot create SelectiveUpdater: missing defs or main group');
    return null;
  }

  return new SelectiveUpdater(svg, defs, mainGroup);
}
