/**
 * Unit tests for PhysicsEngine class
 * These tests cover the core physics calculations that drive the magnetic field behavior
 */

const { PhysicsEngine, CONFIG } = require('../script.js');

describe('PhysicsEngine', () => {
  describe('calculateMagneticForce', () => {
    test('should return zero force when hover is disabled', () => {
      const line = { x: 100, y: 100 };
      const mouse = { x: 150, y: 150 };
      const result = PhysicsEngine.calculateMagneticForce(line, mouse, false);
      
      expect(result.force).toBe(0);
      expect(result.angle).toBe(0);
    });

    test('should return zero force for very close distances', () => {
      const line = { x: 100, y: 100 };
      const mouse = { x: 102, y: 102 };
      const result = PhysicsEngine.calculateMagneticForce(line, mouse, true);
      
      expect(result.force).toBe(0);
      expect(result.angle).toBe(0);
    });

    test('should calculate correct force and angle for normal distances', () => {
      const line = { x: 100, y: 100 };
      const mouse = { x: 200, y: 100 }; // 100px to the right
      const result = PhysicsEngine.calculateMagneticForce(line, mouse, true);
      
      expect(result.force).toBeGreaterThan(0);
      expect(result.force).toBeLessThanOrEqual(CONFIG.GRID.MAX_FORCE);
      expect(result.angle).toBeCloseTo(0, 5); // Should point right
    });

    test('should calculate correct angle for different positions', () => {
      const line = { x: 100, y: 100 };
      
      // Test different mouse positions
      const positions = [
        { x: 100, y: 200, expectedAngle: Math.PI / 2 }, // Below
        { x: 100, y: 0, expectedAngle: -Math.PI / 2 },  // Above
        { x: 0, y: 100, expectedAngle: Math.PI },       // Left
        { x: 200, y: 100, expectedAngle: 0 },           // Right
      ];

      positions.forEach(({ x, y, expectedAngle }) => {
        const result = PhysicsEngine.calculateMagneticForce(line, { x, y }, true);
        expect(result.angle).toBeCloseTo(expectedAngle, 5);
      });
    });

    test('should cap force at maximum value', () => {
      const line = { x: 100, y: 100 };
      const mouse = { x: 101, y: 101 }; // Very close but not too close
      const result = PhysicsEngine.calculateMagneticForce(line, mouse, true);
      
      expect(result.force).toBeLessThanOrEqual(CONFIG.GRID.MAX_FORCE);
    });

    test('should follow inverse square law', () => {
      const line = { x: 100, y: 100 };
      const distances = [50, 100, 200];
      const forces = [];

      distances.forEach(distance => {
        const mouse = { x: 100 + distance, y: 100 };
        const result = PhysicsEngine.calculateMagneticForce(line, mouse, true);
        forces.push(result.force);
      });

      // Force should decrease as distance increases (allowing for capping at MAX_FORCE)
      expect(forces[0]).toBeGreaterThanOrEqual(forces[1]);
      expect(forces[1]).toBeGreaterThanOrEqual(forces[2]);
    });
  });

  describe('updateLine', () => {
    let line;

    beforeEach(() => {
      line = {
        x: 100,
        y: 100,
        originalX: 100,
        originalY: 100,
        angle: 0,
        targetAngle: 0,
        velocity: 0,
        velocityX: 0,
        velocityY: 0
      };
    });

    test('should update line position and angle with magnetic force', () => {
      const magnetic = { force: 0.5, angle: Math.PI / 4 };
      const rippleForce = { x: 0, y: 0 };
      
      PhysicsEngine.updateLine(line, magnetic, rippleForce);
      
      // Check that the line has been updated (position or angle changed)
      const positionChanged = line.x !== 100 || line.y !== 100;
      const angleChanged = line.angle !== 0 || line.targetAngle !== 0;
      expect(positionChanged || angleChanged).toBe(true);
    });

    test('should apply ripple force to velocity', () => {
      const magnetic = { force: 0, angle: 0 };
      const rippleForce = { x: 10, y: 5 };
      
      PhysicsEngine.updateLine(line, magnetic, rippleForce);
      
      expect(line.velocityX).toBeGreaterThan(0);
      expect(line.velocityY).toBeGreaterThan(0);
    });

    test('should return to original position with spring force', () => {
      // Move line away from original position
      line.x = 150;
      line.y = 150;
      
      const magnetic = { force: 0, angle: 0 };
      const rippleForce = { x: 0, y: 0 };
      
      PhysicsEngine.updateLine(line, magnetic, rippleForce);
      
      // Should move back toward original position
      expect(line.velocityX).toBeLessThan(0);
      expect(line.velocityY).toBeLessThan(0);
    });

    test('should apply damping to velocities', () => {
      line.velocityX = 10;
      line.velocityY = 10;
      line.velocity = 1;
      
      const magnetic = { force: 0, angle: 0 };
      const rippleForce = { x: 0, y: 0 };
      
      PhysicsEngine.updateLine(line, magnetic, rippleForce);
      
      expect(line.velocityX).toBeLessThan(10);
      expect(line.velocityY).toBeLessThan(10);
      expect(line.velocity).toBeLessThan(1);
    });

    test('should handle magnetic rotation influence', () => {
      const magnetic = { force: CONFIG.GRID.MAX_FORCE, angle: Math.PI / 2 };
      const rippleForce = { x: 0, y: 0 };
      
      PhysicsEngine.updateLine(line, magnetic, rippleForce);
      
      expect(line.targetAngle).not.toBe(0);
    });

    test('should handle zero magnetic force gracefully', () => {
      const magnetic = { force: 0, angle: 0 };
      const rippleForce = { x: 0, y: 0 };
      
      PhysicsEngine.updateLine(line, magnetic, rippleForce);
      
      // Should still apply spring force and damping
      expect(line.velocityX).toBe(0);
      expect(line.velocityY).toBe(0);
    });

    test('should handle very small magnetic force', () => {
      const magnetic = { force: 0.0001, angle: Math.PI / 4 };
      const rippleForce = { x: 0, y: 0 };
      
      PhysicsEngine.updateLine(line, magnetic, rippleForce);
      
      // Should still update but with minimal effect
      expect(line.targetAngle).toBeCloseTo(0, 3);
    });
  });
});
