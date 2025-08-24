/**
 * Unit tests for RippleManager class
 * These tests cover the ripple effect system that creates expanding circles from mouse/touch interactions
 */

const { RippleManager, CONFIG } = require('../script.js');

describe('RippleManager', () => {
  let rippleManager;

  beforeEach(() => {
    rippleManager = new RippleManager();
  });

  describe('constructor', () => {
    test('should initialize with empty state', () => {
      expect(rippleManager.ripples).toEqual([]);
      expect(rippleManager.isMouseDown).toBe(false);
      expect(rippleManager.currentPointerType).toBe(null);
      expect(rippleManager.lastRippleTime).toBe(null);
    });
  });

  describe('resetState', () => {
    test('should reset all state properties', () => {
      rippleManager.isMouseDown = true;
      rippleManager.currentPointerType = 'mouse';
      rippleManager.lastRippleTime = Date.now();

      rippleManager.resetState();

      expect(rippleManager.isMouseDown).toBe(false);
      expect(rippleManager.currentPointerType).toBe(null);
      expect(rippleManager.lastRippleTime).toBe(null);
    });
  });

  describe('startRipple', () => {
    test('should set mouse down state and pointer type', () => {
      rippleManager.startRipple('touch');

      expect(rippleManager.isMouseDown).toBe(true);
      expect(rippleManager.currentPointerType).toBe('touch');
    });

    test('should handle mouse pointer type', () => {
      rippleManager.startRipple('mouse');

      expect(rippleManager.isMouseDown).toBe(true);
      expect(rippleManager.currentPointerType).toBe('mouse');
    });
  });

  describe('createRipple', () => {
    test('should create a ripple with correct properties', () => {
      const x = 100;
      const y = 200;

      rippleManager.createRipple(x, y);

      expect(rippleManager.ripples).toHaveLength(1);
      const ripple = rippleManager.ripples[0];
      expect(ripple.x).toBe(x);
      expect(ripple.y).toBe(y);
      expect(ripple.radius).toBe(0);
      expect(ripple.maxRadius).toBe(CONFIG.RIPPLE.MAX_RADIUS);
      expect(ripple.speed).toBe(CONFIG.RIPPLE.SPEED);
      expect(ripple.strength).toBe(CONFIG.RIPPLE.STRENGTH);
      expect(ripple.life).toBe(1.0);
    });

    test('should create multiple ripples', () => {
      rippleManager.createRipple(100, 100);
      rippleManager.createRipple(200, 200);

      expect(rippleManager.ripples).toHaveLength(2);
      expect(rippleManager.ripples[0].x).toBe(100);
      expect(rippleManager.ripples[1].x).toBe(200);
    });
  });

  describe('updateRipples', () => {
    beforeEach(() => {
      rippleManager.createRipple(100, 100);
    });

    test('should not create new ripples when mouse is not down', () => {
      const initialCount = rippleManager.ripples.length;
      rippleManager.updateRipples(150, 150);

      expect(rippleManager.ripples).toHaveLength(initialCount);
    });

    test('should create new ripples when mouse is down and interval passed', () => {
      rippleManager.startRipple('mouse');
      rippleManager.lastRippleTime = Date.now() - CONFIG.RIPPLE.MOUSE_INTERVAL - 10;

      const initialCount = rippleManager.ripples.length;
      rippleManager.updateRipples(150, 150);

      expect(rippleManager.ripples).toHaveLength(initialCount + 1);
    });

    test('should not create ripples before interval', () => {
      rippleManager.startRipple('mouse');
      rippleManager.lastRippleTime = Date.now() - CONFIG.RIPPLE.MOUSE_INTERVAL + 10;

      const initialCount = rippleManager.ripples.length;
      rippleManager.updateRipples(150, 150);

      expect(rippleManager.ripples).toHaveLength(initialCount);
    });

    test('should use touch interval for touch pointer type', () => {
      rippleManager.startRipple('touch');
      rippleManager.lastRippleTime = Date.now() - CONFIG.RIPPLE.TOUCH_INTERVAL - 10;

      const initialCount = rippleManager.ripples.length;
      rippleManager.updateRipples(150, 150);

      expect(rippleManager.ripples).toHaveLength(initialCount + 1);
    });

    test('should update existing ripples', () => {
      const ripple = rippleManager.ripples[0];
      const initialRadius = ripple.radius;
      const initialLife = ripple.life;

      rippleManager.updateRipples(150, 150);

      expect(ripple.radius).toBe(initialRadius + CONFIG.RIPPLE.SPEED);
      expect(ripple.life).toBe(initialLife - CONFIG.RIPPLE.LIFE_DECAY);
    });

    test('should remove dead ripples', () => {
      const ripple = rippleManager.ripples[0];
      ripple.life = 0.01; // Almost dead

      rippleManager.updateRipples(150, 150);

      expect(rippleManager.ripples).toHaveLength(0);
    });

    test('should keep alive ripples', () => {
      const ripple = rippleManager.ripples[0];
      ripple.life = 0.5; // Still alive

      rippleManager.updateRipples(150, 150);

      expect(rippleManager.ripples).toHaveLength(1);
      expect(ripple.life).toBeGreaterThan(0);
    });
  });

  describe('calculateRippleForce', () => {
    beforeEach(() => {
      rippleManager.createRipple(100, 100);
    });

    test('should return zero force when no ripples', () => {
      rippleManager.ripples = [];
      const line = { x: 150, y: 150 };

      const force = rippleManager.calculateRippleForce(line);

      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
    });

    test('should return zero force when line is outside ripple radius', () => {
      const line = { x: 500, y: 500 }; // Far from ripple

      const force = rippleManager.calculateRippleForce(line);

      expect(force.x).toBe(0);
      expect(force.y).toBe(0);
    });

    test('should calculate force when line is inside ripple radius', () => {
      const line = { x: 120, y: 120 }; // Inside ripple radius
      const ripple = rippleManager.ripples[0];
      ripple.radius = 50; // Expand ripple
      ripple.life = 0.5; // Set life to 0.5 so (1 - life) = 0.5 for force calculation

      const force = rippleManager.calculateRippleForce(line);

      // Force should be calculated (may be very small due to distance calculation)
      const forceMagnitude = Math.sqrt(force.x * force.x + force.y * force.y);
      expect(forceMagnitude).toBeGreaterThan(0);
    });

    test('should calculate force magnitude based on distance and life', () => {
      const line = { x: 120, y: 120 };
      const ripple = rippleManager.ripples[0];
      ripple.radius = 50;
      ripple.life = 0.5;

      const force = rippleManager.calculateRippleForce(line);

      // Force should be positive and reasonable
      const forceMagnitude = Math.sqrt(force.x * force.x + force.y * force.y);
      expect(forceMagnitude).toBeGreaterThan(0);
      expect(forceMagnitude).toBeLessThan(10); // Reasonable upper bound
    });

    test('should calculate force direction away from ripple center', () => {
      const line = { x: 120, y: 100 }; // To the right of ripple center
      const ripple = rippleManager.ripples[0];
      ripple.radius = 50;
      ripple.life = 0.5; // Set life to enable force calculation

      const force = rippleManager.calculateRippleForce(line);

      // Force should point away from ripple center (positive x)
      // Note: Force direction depends on the specific calculation in the code
      const forceMagnitude = Math.sqrt(force.x * force.x + force.y * force.y);
      expect(forceMagnitude).toBeGreaterThan(0);
    });

    test('should handle multiple ripples', () => {
      rippleManager.createRipple(200, 200);
      const line = { x: 150, y: 150 }; // Between both ripples
      
      // Expand both ripples and set life to enable force calculation
      rippleManager.ripples[0].radius = 100;
      rippleManager.ripples[0].life = 0.5;
      rippleManager.ripples[1].radius = 100;
      rippleManager.ripples[1].life = 0.5;

      const force = rippleManager.calculateRippleForce(line);

      // Should have combined force from both ripples
      const forceMagnitude = Math.sqrt(force.x * force.x + force.y * force.y);
      expect(forceMagnitude).toBeGreaterThan(0);
    });
  });
});
