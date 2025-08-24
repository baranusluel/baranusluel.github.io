/**
 * Unit tests for UIComponents class
 * These tests cover the UI components and interactions like theme switching and notifications
 */

const { UIComponents, CONFIG } = require('../script.js');

describe('UIComponents', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('sayHello', () => {
    test('should execute without throwing an error', () => {
      expect(() => {
        UIComponents.sayHello();
      }).not.toThrow();
    });

    test('should be a function that can be called', () => {
      expect(typeof UIComponents.sayHello).toBe('function');
      expect(() => UIComponents.sayHello()).not.toThrow();
    });
  });

  describe('toggleTheme', () => {
    test('should toggle from light to dark theme', () => {
      document.body.setAttribute('data-theme', CONFIG.THEME.LIGHT);

      UIComponents.toggleTheme();

      expect(document.body.getAttribute('data-theme')).toBe(CONFIG.THEME.DARK);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', CONFIG.THEME.DARK);
    });

    test('should toggle from dark to light theme', () => {
      document.body.setAttribute('data-theme', CONFIG.THEME.DARK);

      UIComponents.toggleTheme();

      expect(document.body.getAttribute('data-theme')).toBe(CONFIG.THEME.LIGHT);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', CONFIG.THEME.LIGHT);
    });

    test('should handle theme when no theme is set', () => {
      // No theme attribute set

      UIComponents.toggleTheme();

      expect(document.body.getAttribute('data-theme')).toBe(CONFIG.THEME.DARK);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', CONFIG.THEME.DARK);
    });
  });

  describe('initializeTheme', () => {
    test('should use saved theme from localStorage', () => {
      localStorage.getItem.mockReturnValue(CONFIG.THEME.DARK);

      UIComponents.initializeTheme();

      expect(document.body.getAttribute('data-theme')).toBe(CONFIG.THEME.DARK);
    });

    test('should use dark theme when system prefers dark', () => {
      localStorage.getItem.mockReturnValue(null);
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      UIComponents.initializeTheme();

      expect(document.body.getAttribute('data-theme')).toBe(CONFIG.THEME.DARK);
    });

    test('should use light theme when system prefers light', () => {
      localStorage.getItem.mockReturnValue(null);
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false, // System prefers light
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      UIComponents.initializeTheme();

      expect(document.body.getAttribute('data-theme')).toBe(CONFIG.THEME.LIGHT);
    });
  });

  describe('addHoverEffects', () => {
    test('should add hover effects to card element', () => {
      document.body.innerHTML = `
        <div class="card">Card content</div>
        <button class="btn">Button</button>
      `;

      UIComponents.addHoverEffects();

      const card = document.querySelector('.card');
      expect(card).toBeTruthy();
    });

    test('should add ripple effects to buttons', () => {
      document.body.innerHTML = `
        <button class="btn">Button 1</button>
        <button class="btn">Button 2</button>
      `;

      UIComponents.addHoverEffects();

      const buttons = document.querySelectorAll('.btn');
      expect(buttons.length).toBe(2);
    });

    test('should handle missing elements gracefully', () => {
      document.body.innerHTML = '<div>No card or buttons</div>';

      expect(() => {
        UIComponents.addHoverEffects();
      }).not.toThrow();
    });
  });

  describe('addRippleAnimation', () => {
    test('should add ripple animation CSS to document head', () => {
      const initialStyleCount = document.head.querySelectorAll('style').length;

      UIComponents.addRippleAnimation();

      const finalStyleCount = document.head.querySelectorAll('style').length;
      expect(finalStyleCount).toBe(initialStyleCount + 1);
    });

    test('should add correct ripple animation CSS', () => {
      UIComponents.addRippleAnimation();

      const styleElement = document.head.querySelector('style');
      expect(styleElement).toBeTruthy();
      expect(styleElement.textContent).toContain('@keyframes ripple');
      expect(styleElement.textContent).toContain('transform: scale(4)');
      expect(styleElement.textContent).toContain('opacity: 0');
    });
  });

  describe('integration tests', () => {
    test('should initialize theme and add effects together', () => {
      localStorage.getItem.mockReturnValue(CONFIG.THEME.LIGHT);
      document.body.innerHTML = `
        <div class="card">Card content</div>
        <button class="btn">Button</button>
      `;

      UIComponents.initializeTheme();
      UIComponents.addHoverEffects();
      UIComponents.addRippleAnimation();

      expect(document.body.getAttribute('data-theme')).toBe(CONFIG.THEME.LIGHT);
      expect(document.querySelector('.card')).toBeTruthy();
      expect(document.querySelector('.btn')).toBeTruthy();
      expect(document.head.querySelector('style')).toBeTruthy();
    });

    test('should handle theme toggle with effects', () => {
      document.body.innerHTML = `
        <div class="card">Card content</div>
        <button class="btn">Button</button>
      `;

      // Set initial theme to light so toggle will go to dark
      document.body.setAttribute('data-theme', CONFIG.THEME.LIGHT);
      UIComponents.addHoverEffects();

      // Toggle theme
      UIComponents.toggleTheme();

      // The theme should be toggled to dark
      const theme = document.body.getAttribute('data-theme');
      expect(theme).toBe(CONFIG.THEME.DARK);
    });
  });
});
