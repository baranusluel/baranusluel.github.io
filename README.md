# Personal Website - Baran Usluel

A modern, elegant personal website built with pure HTML, CSS, and JavaScript, featuring interactive magnetic field physics and comprehensive test coverage.

## ✨ Features

- 🎯 **Interactive Magnetic Field**: Real-time physics simulation with ripple effects
- 🌙 **Dark/Light Theme**: Toggle between themes with automatic system preference detection
- 📱 **Responsive Design**: Fully responsive design that works on all devices
- 🎨 **Smooth Animations**: Hover effects, button animations, and parallax effects
- ⌨️ **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + K`: Toggle theme
  - `Space`: Say hello
- 💾 **Persistent Settings**: Theme preference saved to localStorage
- 🧪 **Comprehensive Testing**: 100% test coverage with 118 unit tests
- 🚀 **Performance Optimized**: Smooth 60fps animations with efficient rendering

## 🏗️ Project Structure

```
personal-website/
├── index.html              # Main HTML file
├── about.html              # About page
├── styles.css              # CSS styles and animations
├── script.js               # JavaScript functionality
├── package.json            # Project dependencies and scripts
├── jest.config.js          # Jest testing configuration
├── jest.setup.js           # Jest test environment setup
├── .gitignore              # Git ignore rules
├── __tests__/              # Test files directory
│   ├── utils.test.js       # Utility function tests
│   ├── physics.test.js     # Physics engine tests
│   ├── ripple-manager.test.js # Ripple system tests
│   ├── grid-manager.test.js   # Grid system tests
│   ├── renderer.test.js    # Canvas rendering tests
│   ├── ui-components.test.js # UI component tests
│   ├── notification-manager.test.js # Notification tests
│   └── keyboard-shortcuts.test.js # Keyboard event tests
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests** (optional but recommended)
   ```bash
   npm test
   ```

4. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000`

## 🧪 Testing

This project includes comprehensive unit testing with **100% test coverage**:

### Test Coverage
- **8 test suites** with **118 tests**
- **Utils**: Distance calculations, angle normalization, DOM interaction detection
- **PhysicsEngine**: Magnetic force calculations, line updates, physics simulation
- **RippleManager**: Ripple creation, force calculations, state management
- **GridManager**: Grid line generation, responsive sizing, canvas handling
- **Renderer**: Canvas drawing operations, ripples, lines, dots
- **UIComponents**: Theme switching, hover effects, ripple animations
- **NotificationManager**: Toast notifications, animations, cleanup
- **KeyboardShortcuts**: Event handling, theme toggle, greeting system

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- __tests__/physics.test.js
```

### Test Results
```
Test Suites: 8 passed, 8 total
Tests:       118 passed, 118 total
Snapshots:   0 total
Time:        0.534 s
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks or libraries
- **Canvas API**: Real-time graphics and physics rendering
- **Jest**: Comprehensive testing framework
- **JSDOM**: DOM simulation for testing
- **Google Fonts**: Inter font family for typography

## 🎮 Interactive Features

### Magnetic Field Physics
- **Real-time Simulation**: Lines respond to mouse/touch position
- **Ripple Effects**: Dynamic ripple creation with physics-based forces
- **Smooth Animations**: 60fps rendering with optimized performance
- **Responsive Grid**: Adaptive grid system that scales with screen size

### Theme System
- **Automatic Detection**: Respects system dark/light mode preference
- **Manual Toggle**: Keyboard shortcut (Ctrl/Cmd + K) or button click
- **Persistent Storage**: Theme preference saved across sessions
- **Smooth Transitions**: CSS transitions for theme changes

### Keyboard Shortcuts
- **Theme Toggle**: `Ctrl/Cmd + K`
- **Greeting**: `Space` (when not focused on input elements)
- **Accessibility**: Full keyboard navigation support

## 🎨 Design Features

- **CSS Custom Properties**: Easy theme switching and maintainable code
- **Smooth Animations**: CSS transitions and keyframe animations
- **Modern Typography**: Inter font with proper font weights and spacing
- **Accessibility**: Proper semantic HTML and keyboard navigation
- **Performance**: Optimized animations and minimal JavaScript footprint

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Development

### Available Scripts
```bash
npm test          # Run test suite
npm test -- --watch  # Run tests in watch mode
npm test -- --coverage  # Generate coverage report
```

### Code Quality
- **100% Test Coverage**: All core functionality is tested
- **ESLint Ready**: Code follows JavaScript best practices
- **Modular Architecture**: Clean separation of concerns
- **Performance Optimized**: Efficient rendering and memory management

## 🎯 Customization

The website is built to be easily customizable:

- **Colors**: Modify CSS custom properties in `:root`
- **Typography**: Change the Google Fonts import in `index.html`
- **Content**: Update the HTML content in `index.html`
- **Animations**: Adjust timing and effects in `styles.css`
- **Physics**: Tune magnetic field parameters in `script.js`

## 🚀 Future Enhancements

### 🎮 **Advanced Interactions**
- [ ] **Multi-touch Support** - Create multiple ripples simultaneously with touch gestures
- [ ] **Physics Playground** - Different force types (gravity wells, repulsion, attraction zones)
- [ ] **3D Effects** - Add depth, perspective, and 3D transformations to the magnetic field
- [ ] **Interactive Resume** - Hover sections to see details with magnetic attraction effects
- [ ] **Dynamic Theme** - Automatically adjust theme based on Seattle's weather conditions

### 🥚 **Easter Eggs & Minigames**
- [ ] **Hidden Easter Eggs** - Secret interactions and discoveries throughout the site
- [ ] **Mini-games** - Fun interactive games using the magnetic field mechanics
- [ ] **Achievement System** - Unlock new visual effects and interactions
- [ ] **Konami Code** - Classic easter egg implementation
- [ ] **Hidden Patterns** - Draw specific shapes to trigger special effects

### 🚀 **Performance & Features**
- [ ] **Audio Reactivity** - Microphone input for sound-based interactions
- [ ] **Gesture Recognition** - Hand tracking and gesture controls
- [ ] **Device Sensors** - Accelerometer, gyroscope, and proximity sensor integration
- [ ] **Particle Systems** - Floating particles and trail effects
- [ ] **WebGL Integration** - GPU-accelerated rendering for complex effects

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📊 Project Statistics

- **Lines of Code**: ~1,500+ (including tests)
- **Test Coverage**: 100%
- **Dependencies**: 0 runtime dependencies
- **Build Time**: 0 (no build process required)
- **Bundle Size**: Minimal (vanilla JS)

---

Built with ❤️ by Baran Usluel | VR Software Engineer at Meta Reality Labs
