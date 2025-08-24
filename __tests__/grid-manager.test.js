/**
 * Unit tests for GridManager class
 * These tests cover the grid system that creates and manages the magnetic field lines
 */

const { GridManager, CONFIG } = require('../script.js');

describe('GridManager', () => {
  let canvas;
  let gridManager;

  beforeEach(() => {
    // Create a mock canvas
    canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
  });

  describe('constructor', () => {
    test('should initialize with canvas and hover enabled', () => {
      gridManager = new GridManager(canvas, true);

      expect(gridManager.canvas).toBe(canvas);
      expect(gridManager.isHoverEnabled).toBe(true);
      expect(gridManager.lines).toEqual([]);
    });

    test('should initialize with hover disabled', () => {
      gridManager = new GridManager(canvas, false);

      expect(gridManager.canvas).toBe(canvas);
      expect(gridManager.isHoverEnabled).toBe(false);
      expect(gridManager.lines).toEqual([]);
    });
  });

  describe('createLines', () => {
    test('should create lines for small screen with hover enabled', () => {
      canvas.width = 300;
      canvas.height = 200;
      gridManager = new GridManager(canvas, true);

      gridManager.createLines();

      expect(gridManager.lines.length).toBeGreaterThan(0);
      
      // Check first line properties
      const firstLine = gridManager.lines[0];
      expect(firstLine).toHaveProperty('x');
      expect(firstLine).toHaveProperty('y');
      expect(firstLine).toHaveProperty('originalX');
      expect(firstLine).toHaveProperty('originalY');
      expect(firstLine).toHaveProperty('angle');
      expect(firstLine).toHaveProperty('targetAngle');
      expect(firstLine).toHaveProperty('velocity');
      expect(firstLine).toHaveProperty('velocityX');
      expect(firstLine).toHaveProperty('velocityY');
    });

    test('should create lines for large screen with hover enabled', () => {
      canvas.width = 1920;
      canvas.height = 1080;
      gridManager = new GridManager(canvas, true);

      gridManager.createLines();

      expect(gridManager.lines.length).toBeGreaterThan(0);
      
      // Large screens should use BASE_SIZE
      const expectedGridSize = CONFIG.GRID.BASE_SIZE;
      const firstLine = gridManager.lines[0];
      expect(firstLine.x % expectedGridSize).toBe(expectedGridSize / 2);
      expect(firstLine.y % expectedGridSize).toBe(expectedGridSize / 2);
    });

    test('should create lines for small screen with hover disabled', () => {
      canvas.width = 300;
      canvas.height = 200;
      gridManager = new GridManager(canvas, false);

      gridManager.createLines();

      expect(gridManager.lines.length).toBeGreaterThan(0);
      
      // Small screens with hover disabled should use BASE_SIZE * 0.8 (screen area < 1000000)
      const expectedGridSize = CONFIG.GRID.BASE_SIZE * 0.8;
      const firstLine = gridManager.lines[0];
      expect(firstLine.x % expectedGridSize).toBeCloseTo(expectedGridSize / 2, 1);
      expect(firstLine.y % expectedGridSize).toBeCloseTo(expectedGridSize / 2, 1);
    });

    test('should create lines for large screen with hover disabled', () => {
      canvas.width = 1920;
      canvas.height = 1080;
      gridManager = new GridManager(canvas, false);

      gridManager.createLines();

      expect(gridManager.lines.length).toBeGreaterThan(0);
      
      // Large screens with hover disabled should use BASE_SIZE * 0.6 (screen area > 1000000)
      const expectedGridSize = CONFIG.GRID.BASE_SIZE * 0.6;
      const firstLine = gridManager.lines[0];
      expect(firstLine.x % expectedGridSize).toBeCloseTo(expectedGridSize / 2, 1);
      expect(firstLine.y % expectedGridSize).toBeCloseTo(expectedGridSize / 2, 1);
    });

    test('should create lines with correct grid spacing', () => {
      canvas.width = 600;
      canvas.height = 400;
      gridManager = new GridManager(canvas, true);

      gridManager.createLines();

      // Check that lines are spaced correctly
      const lines = gridManager.lines;
      expect(lines.length).toBeGreaterThan(0);

      // Check that lines are positioned at grid centers
      // For 600x400 canvas, screen area = 240000 < 1000000, so BASE_SIZE * 1.5
      const expectedGridSize = CONFIG.GRID.BASE_SIZE * 1.5;
      lines.forEach(line => {
        expect(line.x % expectedGridSize).toBeCloseTo(expectedGridSize / 2, 1);
        expect(line.y % expectedGridSize).toBeCloseTo(expectedGridSize / 2, 1);
      });
    });

    test('should set original positions correctly', () => {
      canvas.width = 600;
      canvas.height = 400;
      gridManager = new GridManager(canvas, true);

      gridManager.createLines();

      gridManager.lines.forEach(line => {
        expect(line.originalX).toBe(line.x);
        expect(line.originalY).toBe(line.y);
      });
    });

    test('should initialize line properties correctly', () => {
      canvas.width = 600;
      canvas.height = 400;
      gridManager = new GridManager(canvas, true);

      gridManager.createLines();

      gridManager.lines.forEach(line => {
        expect(line.angle).toBe(0);
        expect(line.targetAngle).toBe(0);
        expect(line.velocity).toBe(0);
        expect(line.velocityX).toBe(0);
        expect(line.velocityY).toBe(0);
      });
    });

    test('should create appropriate number of lines for canvas size', () => {
      canvas.width = 600;
      canvas.height = 400;
      gridManager = new GridManager(canvas, true);

      gridManager.createLines();

      // For 600x400 canvas, screen area = 240000 < 1000000, so BASE_SIZE * 1.5
      const adjustedGridSize = CONFIG.GRID.BASE_SIZE * 1.5;
      const expectedCols = Math.ceil(canvas.width / adjustedGridSize);
      const expectedRows = Math.ceil(canvas.height / adjustedGridSize);
      const expectedLines = expectedCols * expectedRows;

      expect(gridManager.lines.length).toBe(expectedLines);
    });

    test('should clear existing lines when creating new ones', () => {
      canvas.width = 600;
      canvas.height = 400;
      gridManager = new GridManager(canvas, true);

      // Create lines first time
      gridManager.createLines();
      const firstCount = gridManager.lines.length;

      // Create lines again
      gridManager.createLines();
      const secondCount = gridManager.lines.length;

      expect(firstCount).toBe(secondCount);
      expect(gridManager.lines.length).toBeGreaterThan(0);
    });

    test('should handle very small canvas', () => {
      canvas.width = 50;
      canvas.height = 30;
      gridManager = new GridManager(canvas, true);

      gridManager.createLines();

      // Should still create at least one line
      expect(gridManager.lines.length).toBeGreaterThan(0);
    });

    test('should handle very large canvas', () => {
      canvas.width = 4000;
      canvas.height = 3000;
      gridManager = new GridManager(canvas, true);

      gridManager.createLines();

      // Should create many lines but not too many
      expect(gridManager.lines.length).toBeGreaterThan(100);
      expect(gridManager.lines.length).toBeLessThan(15000);
    });
  });
});
