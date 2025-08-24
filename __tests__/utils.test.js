/**
 * Unit tests for Utils class
 * These tests cover the core utility functions that are critical for the physics calculations
 */

// Import the script to test
const { Utils } = require('../script.js');

describe('Utils', () => {
  describe('calculateDistance', () => {
    test('should calculate correct distance between two points', () => {
      expect(Utils.calculateDistance(0, 0, 3, 4)).toBe(5);
      expect(Utils.calculateDistance(1, 1, 4, 5)).toBe(5);
      expect(Utils.calculateDistance(-1, -1, 2, 3)).toBe(5);
    });

    test('should return 0 for same point', () => {
      expect(Utils.calculateDistance(5, 5, 5, 5)).toBe(0);
    });

    test('should handle negative coordinates', () => {
      expect(Utils.calculateDistance(-3, -4, 0, 0)).toBe(5);
    });

    test('should handle decimal coordinates', () => {
      expect(Utils.calculateDistance(0, 0, 1.5, 2)).toBeCloseTo(2.5, 5);
    });
  });

  describe('normalizeAngle', () => {
    test('should normalize angles to [-π, π] range', () => {
      expect(Utils.normalizeAngle(Math.PI * 2)).toBeCloseTo(0, 5);
      expect(Utils.normalizeAngle(Math.PI * 3)).toBeCloseTo(Math.PI, 5);
      expect(Utils.normalizeAngle(-Math.PI * 2)).toBeCloseTo(0, 5);
      expect(Utils.normalizeAngle(-Math.PI * 3)).toBeCloseTo(-Math.PI, 5);
    });

    test('should keep angles already in range unchanged', () => {
      expect(Utils.normalizeAngle(Math.PI / 2)).toBe(Math.PI / 2);
      expect(Utils.normalizeAngle(-Math.PI / 2)).toBe(-Math.PI / 2);
      expect(Utils.normalizeAngle(0)).toBe(0);
    });

    test('should handle edge cases', () => {
      expect(Utils.normalizeAngle(Math.PI)).toBeCloseTo(Math.PI, 5);
      expect(Utils.normalizeAngle(-Math.PI)).toBeCloseTo(-Math.PI, 5);
    });
  });

  describe('isInteractiveElement', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="magneticField">
          <div class="non-interactive"></div>
        </div>
        <a href="#">Link</a>
        <button>Button</button>
        <input type="text" />
        <div onclick="alert('test')">Clickable div</div>
        <div>Text content</div>
        <div><span>Nested text</span></div>
        <div></div>
      `;
    });

    test('should return false for elements inside magnetic field', () => {
      const magneticField = document.getElementById('magneticField');
      const nonInteractive = magneticField.querySelector('.non-interactive');
      expect(Utils.isInteractiveElement(nonInteractive)).toBe(false);
    });

    test('should return true for interactive elements', () => {
      const link = document.querySelector('a');
      const button = document.querySelector('button');
      const input = document.querySelector('input');
      
      expect(Utils.isInteractiveElement(link)).toBe(true);
      expect(Utils.isInteractiveElement(button)).toBe(true);
      expect(Utils.isInteractiveElement(input)).toBe(true);
    });

    test('should return true for elements with onclick handlers', () => {
      const clickableDiv = document.querySelector('[onclick]');
      expect(Utils.isInteractiveElement(clickableDiv)).toBe(true);
    });

    test('should return true for elements with text content', () => {
      const allDivs = document.querySelectorAll('div');
      const textDiv = Array.from(allDivs).find(div => div.textContent.trim() === 'Text content');
      expect(Utils.isInteractiveElement(textDiv)).toBe(true);
    });

    test('should return false for empty layout containers', () => {
      const emptyDiv = document.querySelector('div:last-child');
      expect(Utils.isInteractiveElement(emptyDiv)).toBe(false);
    });

    test('should return true for elements with nested text', () => {
      const nestedTextDiv = document.querySelector('div span').parentElement;
      expect(Utils.isInteractiveElement(nestedTextDiv)).toBe(true);
    });
  });
});
