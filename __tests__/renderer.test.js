/**
 * Unit tests for Renderer class
 * These tests cover the rendering system that draws lines, dots, and ripples on the canvas
 */

const { Renderer, CONFIG } = require('../script.js');

describe('Renderer', () => {
  let canvas;
  let ctx;
  let renderer;

  beforeEach(() => {
    // Create a mock canvas and context
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d');
    // Ensure canvas property is set on context
    ctx.canvas = canvas;
    renderer = new Renderer(ctx);
  });

  describe('constructor', () => {
    test('should initialize with canvas context', () => {
      expect(renderer.ctx).toBe(ctx);
    });
  });

  describe('clear', () => {
    test('should clear the entire canvas', () => {
      renderer.clear();

      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
  });

  describe('drawRipples', () => {
    test('should draw ripples with correct properties', () => {
      const ripples = [
        { x: 100, y: 150, radius: 50, life: 0.8 },
        { x: 200, y: 250, radius: 75, life: 0.5 }
      ];

      renderer.drawRipples(ripples);

      // Should call arc for each ripple
      expect(ctx.arc).toHaveBeenCalledTimes(2);
      expect(ctx.stroke).toHaveBeenCalledTimes(2);
      expect(ctx.beginPath).toHaveBeenCalledTimes(2);
    });

    test('should set correct stroke style for ripples', () => {
      const ripples = [{ x: 100, y: 150, radius: 50, life: 0.8 }];

      renderer.drawRipples(ripples);

      expect(ctx.strokeStyle).toBe(`rgba(59, 130, 246, ${0.8 * CONFIG.ANIMATION.RIPPLE_OPACITY})`);
    });

    test('should handle empty ripples array', () => {
      renderer.drawRipples([]);

      expect(ctx.beginPath).not.toHaveBeenCalled();
      expect(ctx.arc).not.toHaveBeenCalled();
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    test('should handle ripples with zero life', () => {
      const ripples = [{ x: 100, y: 150, radius: 50, life: 0 }];

      renderer.drawRipples(ripples);

      expect(ctx.strokeStyle).toBe(`rgba(59, 130, 246, 0)`);
    });
  });

  describe('drawLines', () => {
    test('should draw lines when hover is enabled', () => {
      const lines = [
        { x: 100, y: 100, angle: 0 },
        { x: 200, y: 200, angle: Math.PI / 4 }
      ];

      renderer.drawLines(lines, true);

      // Should call line drawing methods for each line
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalled();
      expect(ctx.lineTo).toHaveBeenCalled();
      expect(ctx.stroke).toHaveBeenCalled();
    });

    test('should draw dots when hover is disabled', () => {
      const lines = [
        { x: 100, y: 100, angle: 0 },
        { x: 200, y: 200, angle: Math.PI / 4 }
      ];

      renderer.drawLines(lines, false);

      // Should call arc (for dots) for each line
      expect(ctx.arc).toHaveBeenCalledTimes(2);
      expect(ctx.fill).toHaveBeenCalledTimes(2);
    });

    test('should set correct stroke and fill styles', () => {
      const lines = [{ x: 100, y: 100, angle: 0 }];

      renderer.drawLines(lines, true);

      expect(ctx.strokeStyle).toBe('#3b82f6');
      expect(ctx.fillStyle).toBe('#3b82f6');
      expect(ctx.lineWidth).toBe(1);
      expect(ctx.lineCap).toBe('round');
    });

    test('should handle empty lines array', () => {
      renderer.drawLines([], true);

      expect(ctx.beginPath).not.toHaveBeenCalled();
      expect(ctx.moveTo).not.toHaveBeenCalled();
      expect(ctx.lineTo).not.toHaveBeenCalled();
    });
  });

  describe('drawLine', () => {
    test('should draw a line with correct coordinates', () => {
      const line = { x: 100, y: 100, angle: 0 };
      const lineLength = CONFIG.GRID.LINE_LENGTH;

      renderer.drawLine(line);

      // Should draw line from (x - length/2, y) to (x + length/2, y) for angle 0
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledWith(100 - lineLength / 2, 100);
      expect(ctx.lineTo).toHaveBeenCalledWith(100 + lineLength / 2, 100);
      expect(ctx.stroke).toHaveBeenCalled();
    });

    test('should draw a line with 45 degree angle', () => {
      const line = { x: 100, y: 100, angle: Math.PI / 4 };
      const lineLength = CONFIG.GRID.LINE_LENGTH;

      renderer.drawLine(line);

      // Should calculate correct endpoints for 45 degree angle
      const halfLength = lineLength / 2;
      const expectedX1 = 100 - Math.cos(Math.PI / 4) * halfLength;
      const expectedY1 = 100 - Math.sin(Math.PI / 4) * halfLength;
      const expectedX2 = 100 + Math.cos(Math.PI / 4) * halfLength;
      const expectedY2 = 100 + Math.sin(Math.PI / 4) * halfLength;

      expect(ctx.moveTo).toHaveBeenCalledWith(expectedX1, expectedY1);
      expect(ctx.lineTo).toHaveBeenCalledWith(expectedX2, expectedY2);
    });

    test('should draw a line with 90 degree angle', () => {
      const line = { x: 100, y: 100, angle: Math.PI / 2 };
      const lineLength = CONFIG.GRID.LINE_LENGTH;

      renderer.drawLine(line);

      // Should draw vertical line
      expect(ctx.moveTo).toHaveBeenCalledWith(100, 100 - lineLength / 2);
      expect(ctx.lineTo).toHaveBeenCalledWith(100, 100 + lineLength / 2);
    });
  });

  describe('drawDot', () => {
    test('should draw a dot with correct properties', () => {
      const line = { x: 100, y: 100 };

      renderer.drawDot(line);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalledWith(100, 100, CONFIG.ANIMATION.DOT_RADIUS, 0, 2 * Math.PI);
      expect(ctx.fill).toHaveBeenCalled();
    });

    test('should draw dot at correct position', () => {
      const line = { x: 250, y: 300 };

      renderer.drawDot(line);

      expect(ctx.arc).toHaveBeenCalledWith(250, 300, CONFIG.ANIMATION.DOT_RADIUS, 0, 2 * Math.PI);
    });
  });

  describe('integration tests', () => {
    test('should draw multiple lines and ripples together', () => {
      const lines = [
        { x: 100, y: 100, angle: 0 },
        { x: 200, y: 200, angle: Math.PI / 4 }
      ];
      const ripples = [
        { x: 150, y: 150, radius: 50, life: 0.8 }
      ];

      renderer.clear();
      renderer.drawRipples(ripples);
      renderer.drawLines(lines, true);

      // Should have called all the necessary drawing methods
      expect(ctx.clearRect).toHaveBeenCalled();
      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled(); // For ripples
      expect(ctx.moveTo).toHaveBeenCalled(); // For lines
      expect(ctx.lineTo).toHaveBeenCalled(); // For lines
      expect(ctx.stroke).toHaveBeenCalled();
    });

    test('should handle mixed rendering modes', () => {
      const lines = [{ x: 100, y: 100, angle: 0 }];
      const ripples = [{ x: 150, y: 150, radius: 50, life: 0.5 }];

      renderer.drawRipples(ripples);
      renderer.drawLines(lines, false); // Dots mode

      // Should draw ripples as lines and lines as dots
      expect(ctx.arc).toHaveBeenCalled(); // For ripples and dots
      expect(ctx.fill).toHaveBeenCalled(); // For dots
      expect(ctx.stroke).toHaveBeenCalled(); // For ripples
    });
  });
});
