// Interactive functionality for the personal website

// Constants
const CONFIG = {
    GRID: {
        BASE_SIZE: 30,
        LINE_LENGTH: 10,
        MAX_FORCE: 1.2,
        FORCE_CONSTANT: 50000,
        SPRING_FORCE: 0.06,
        DAMPING: 0.9,
        ROTATION_RESPONSIVENESS: 0.12,
        ROTATION_DAMPING: 0.85
    },
    RIPPLE: {
        MAX_RADIUS: 200,
        SPEED: 12,
        STRENGTH: 1.0,
        LIFE_DECAY: 0.04,
        MOUSE_INTERVAL: 50,
        TOUCH_INTERVAL: 100,
        TIMEOUT: 5000,
        MAX_DURATION: 3000,
        NO_MOVEMENT_TIMEOUT: 2000
    },
    ANIMATION: {
        RIPPLE_OPACITY: 0.15,
        DOT_RADIUS: 1
    },
    THEME: {
        LIGHT: 'light',
        DARK: 'dark'
    }
};

// Utility functions
const Utils = {
    isInteractiveElement(element) {
        if (element.closest('#magneticField')) return false;
        if (element.matches('a, button, input, textarea, select, [contenteditable], [tabindex]')) return true;
        if (element.onclick || element.getAttribute('onclick') || 
            element.querySelector('[onclick], [data-action], [role="button"]')) return true;
        
        const hasTextContent = element.textContent && element.textContent.trim().length > 0;
        const isLayoutContainer = element.matches('div, span') && !hasTextContent;
        return hasTextContent && !isLayoutContainer;
    },
    
    calculateDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }
};

// Ripple management
class RippleManager {
    constructor() {
        this.ripples = [];
        this.isMouseDown = false;
        this.rippleStartTime = null;
        this.currentPointerType = null;
        this.lastRippleTime = null;
        this.rippleTimeout = null;
    }
    
    resetState() {
        this.isMouseDown = false;
        this.rippleStartTime = null;
        this.currentPointerType = null;
        this.lastRippleTime = null;
        if (this.rippleTimeout) {
            clearTimeout(this.rippleTimeout);
            this.rippleTimeout = null;
        }
    }
    
    startRipple(pointerType) {
        this.isMouseDown = true;
        this.rippleStartTime = Date.now();
        this.currentPointerType = pointerType;
        
        this.rippleTimeout = setTimeout(() => {
            this.resetState();
            console.log('Ripple timeout - resetting state');
        }, CONFIG.RIPPLE.TIMEOUT);
    }
    
    createRipple(x, y) {
        this.ripples.push({
            x, y,
            radius: 0,
            maxRadius: CONFIG.RIPPLE.MAX_RADIUS,
            speed: CONFIG.RIPPLE.SPEED,
            strength: CONFIG.RIPPLE.STRENGTH,
            life: 1.0
        });
    }
    
    updateRipples(mouseX, mouseY) {
        if (this.isMouseDown) {
            const now = Date.now();
            const timeSinceLastRipple = now - (this.lastRippleTime || 0);
            const rippleInterval = this.currentPointerType === 'touch' ? 
                CONFIG.RIPPLE.TOUCH_INTERVAL : CONFIG.RIPPLE.MOUSE_INTERVAL;
            
            if (!this.lastRippleTime || timeSinceLastRipple >= rippleInterval) {
                this.createRipple(mouseX, mouseY);
                this.lastRippleTime = now;
            }
        }
        
        this.ripples = this.ripples.filter(ripple => {
            ripple.radius += ripple.speed;
            ripple.life -= CONFIG.RIPPLE.LIFE_DECAY;
            return ripple.life > 0;
        });
    }
    
    calculateRippleForce(line) {
        let totalForce = { x: 0, y: 0 };
        
        this.ripples.forEach(ripple => {
            const distance = Utils.calculateDistance(line.x, line.y, ripple.x, ripple.y);
            
            if (distance <= ripple.radius) {
                const normalizedDistance = distance / ripple.radius;
                const decayFactor = Math.exp(-normalizedDistance * 2);
                const forceMagnitude = ripple.strength * (1 - ripple.life) * 6 * decayFactor;
                const angle = Math.atan2(line.y - ripple.y, line.x - ripple.x);
                
                totalForce.x += Math.cos(angle) * forceMagnitude;
                totalForce.y += Math.sin(angle) * forceMagnitude;
            }
        });
        
        return totalForce;
    }
    
    checkForStuckRipples(lastMouseMoveTime) {
        if (this.isMouseDown && this.rippleStartTime) {
            const rippleDuration = Date.now() - this.rippleStartTime;
            
            if (rippleDuration > CONFIG.RIPPLE.MAX_DURATION) {
                console.log('Stuck ripple detected (duration) - forcing reset after', rippleDuration, 'ms');
                this.resetState();
                return true;
            }
            
            if (lastMouseMoveTime && this.currentPointerType === 'mouse' && 
                (Date.now() - lastMouseMoveTime) > CONFIG.RIPPLE.NO_MOVEMENT_TIMEOUT) {
                console.log('Stuck ripple detected (no mouse movement) - forcing reset');
                this.resetState();
                return true;
            }
        }
        return false;
    }
}

// Grid line management
class GridManager {
    constructor(canvas, isHoverEnabled) {
        this.canvas = canvas;
        this.isHoverEnabled = isHoverEnabled;
        this.lines = [];
        // Don't create lines here - wait for proper canvas sizing
    }
    
    createLines() {
        this.lines = [];
        
        const screenArea = this.canvas.width * this.canvas.height;
        let adjustedGridSize;
        
        if (this.isHoverEnabled) {
            adjustedGridSize = screenArea > 1000000 ? CONFIG.GRID.BASE_SIZE : CONFIG.GRID.BASE_SIZE * 1.5;
        } else {
            adjustedGridSize = screenArea > 1000000 ? CONFIG.GRID.BASE_SIZE * 0.6 : CONFIG.GRID.BASE_SIZE * 0.8;
        }
        
        const cols = Math.ceil(this.canvas.width / adjustedGridSize);
        const rows = Math.ceil(this.canvas.height / adjustedGridSize);
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * adjustedGridSize + adjustedGridSize / 2;
                const y = j * adjustedGridSize + adjustedGridSize / 2;
                
                this.lines.push({
                    x, y,
                    originalX: x,
                    originalY: y,
                    angle: 0,
                    targetAngle: 0,
                    velocity: 0,
                    velocityX: 0,
                    velocityY: 0
                });
            }
        }
    }
    
    // This method is no longer needed since we call createLines directly
    // resize() {
    //     this.createLines();
    // }
}

// Physics calculations
class PhysicsEngine {
    static calculateMagneticForce(line, mouse, isHoverEnabled) {
        if (!isHoverEnabled) {
            return { force: 0, angle: 0 };
        }
        
        const distance = Utils.calculateDistance(mouse.x, mouse.y, line.x, line.y);
        
        if (distance < 5) return { force: 0, angle: 0 };
        
        const force = CONFIG.GRID.FORCE_CONSTANT / (distance * distance);
        const cappedForce = Math.min(force, CONFIG.GRID.MAX_FORCE);
        const angle = Math.atan2(mouse.y - line.y, mouse.x - line.x);
        
        return { force: cappedForce, angle };
    }
    
    static updateLine(line, magnetic, rippleForce) {
        // Handle magnetic rotation
        if (magnetic.force > 0.001) {
            const forceInfluence = Math.min(magnetic.force / CONFIG.GRID.MAX_FORCE, 1.0);
            let angleDiff = Utils.normalizeAngle(magnetic.angle - line.targetAngle);
            line.targetAngle += angleDiff * forceInfluence * 0.3;
        } else {
            line.targetAngle *= 0.9;
        }
        
        // Handle ripple position warping
        if (Math.abs(rippleForce.x) > 0.001 || Math.abs(rippleForce.y) > 0.001) {
            line.velocityX += rippleForce.x * 0.2;
            line.velocityY += rippleForce.y * 0.2;
        }
        
        // Return to original position
        const dx = line.originalX - line.x;
        const dy = line.originalY - line.y;
        line.velocityX += dx * CONFIG.GRID.SPRING_FORCE;
        line.velocityY += dy * CONFIG.GRID.SPRING_FORCE;
        
        // Apply damping
        line.velocityX *= CONFIG.GRID.DAMPING;
        line.velocityY *= CONFIG.GRID.DAMPING;
        
        // Update position
        line.x += line.velocityX;
        line.y += line.velocityY;
        
        // Smooth rotation
        let angleDiff = Utils.normalizeAngle(line.targetAngle - line.angle);
        const responsiveness = CONFIG.GRID.ROTATION_RESPONSIVENESS + 
            (magnetic.force / CONFIG.GRID.MAX_FORCE) * 0.18;
        line.velocity += angleDiff * responsiveness;
        line.velocity *= CONFIG.GRID.ROTATION_DAMPING;
        line.angle += line.velocity;
    }
}

// Rendering engine
class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    
    drawRipples(ripples) {
        ripples.forEach(ripple => {
            this.ctx.strokeStyle = `rgba(59, 130, 246, ${ripple.life * CONFIG.ANIMATION.RIPPLE_OPACITY})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        });
    }
    
    drawLines(lines, isHoverEnabled) {
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';
        
        lines.forEach(line => {
            if (isHoverEnabled) {
                this.drawLine(line);
            } else {
                this.drawDot(line);
            }
        });
    }
    
    drawLine(line) {
        const x1 = line.x - Math.cos(line.angle) * CONFIG.GRID.LINE_LENGTH / 2;
        const y1 = line.y - Math.sin(line.angle) * CONFIG.GRID.LINE_LENGTH / 2;
        const x2 = line.x + Math.cos(line.angle) * CONFIG.GRID.LINE_LENGTH / 2;
        const y2 = line.y + Math.sin(line.angle) * CONFIG.GRID.LINE_LENGTH / 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    drawDot(line) {
        this.ctx.beginPath();
        this.ctx.arc(line.x, line.y, CONFIG.ANIMATION.DOT_RADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
    }
}

// Event handler
class EventHandler {
    constructor(magneticField) {
        this.magneticField = magneticField;
        this.hasInitialMousePosition = false;
        this.lastMouseMoveTime = null;
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.magneticField.resize());
        
        document.addEventListener('pointermove', (e) => this.handlePointerMove(e));
        document.addEventListener('pointerleave', () => this.handlePointerLeave());
        document.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
        document.addEventListener('pointerup', (e) => this.handlePointerUp(e));
        document.addEventListener('pointercancel', (e) => this.handlePointerCancel(e));
        
        document.addEventListener('contextmenu', (e) => this.handleContextMenu(e));
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        document.addEventListener('touchend', () => this.handleTouchEnd());
        document.addEventListener('touchcancel', () => this.handleTouchCancel());
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    }
    
    handlePointerMove(e) {
        if (!this.hasInitialMousePosition) {
            this.magneticField.mouse.x = e.clientX;
            this.magneticField.mouse.y = e.clientY;
            this.hasInitialMousePosition = true;
        } else {
            this.magneticField.mouse.x = e.clientX;
            this.magneticField.mouse.y = e.clientY;
        }
        this.lastMouseMoveTime = Date.now();
        
        if (e.pointerType === 'touch' && this.magneticField.rippleManager.isMouseDown) {
            console.log('Pointer move (touch):', e.clientX, e.clientY);
        }
    }
    
    handlePointerLeave() {
        this.magneticField.mouse.x = -1000;
        this.magneticField.mouse.y = -1000;
        this.magneticField.rippleManager.resetState();
    }
    
    handlePointerDown(e) {
        if (e.isPrimary) {
            this.magneticField.rippleManager.startRipple(e.pointerType);
            this.magneticField.mouse.x = e.clientX;
            this.magneticField.mouse.y = e.clientY;
            this.magneticField.rippleManager.createRipple(e.clientX, e.clientY);
            console.log('Pointer down:', e.pointerType, e.clientX, e.clientY);
            
            const isInteractive = Utils.isInteractiveElement(e.target);
            if (!isInteractive && e.pointerType === 'touch') {
                e.preventDefault();
            }
        }
    }
    
    handlePointerUp(e) {
        if (e.isPrimary) {
            this.magneticField.rippleManager.resetState();
            console.log('Pointer up:', e.pointerType);
        }
    }
    
    handlePointerCancel(e) {
        if (e.isPrimary) {
            this.magneticField.rippleManager.resetState();
            console.log('Pointer cancel:', e.pointerType);
        }
    }
    
    handleContextMenu(e) {
        const isInteractive = Utils.isInteractiveElement(e.target);
        if (!isInteractive) {
            e.preventDefault();
            this.magneticField.rippleManager.resetState();
        }
    }
    
    handleTouchStart(e) {
        const isInteractive = Utils.isInteractiveElement(e.target);
        if (!isInteractive && e.touches.length > 0) {
            e.preventDefault();
        }
    }
    
    handleTouchEnd() {
        this.magneticField.rippleManager.resetState();
        console.log('Touch end');
    }
    
    handleTouchCancel() {
        this.magneticField.rippleManager.resetState();
        console.log('Touch cancel');
    }
    
    handleTouchMove(e) {
        if (this.magneticField.rippleManager.isMouseDown && e.touches.length > 0) {
            const touch = e.touches[0];
            this.magneticField.mouse.x = touch.clientX;
            this.magneticField.mouse.y = touch.clientY;
            this.lastMouseMoveTime = Date.now();
            console.log('Touch move (native):', touch.clientX, touch.clientY);
            
            const isInteractive = Utils.isInteractiveElement(e.target);
            if (!isInteractive) {
                e.preventDefault();
            }
        }
    }
}

// Main magnetic field class (simplified)
class MagneticField {
    constructor() {
        this.canvas = document.getElementById('magneticField');
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.isHoverEnabled = window.matchMedia('(hover: hover)').matches;
        this.animationId = null;
        
        // Initialize components
        this.rippleManager = new RippleManager();
        this.gridManager = new GridManager(this.canvas, this.isHoverEnabled);
        this.renderer = new Renderer(this.ctx);
        this.eventHandler = new EventHandler(this);
        
        // Initialize with proper sizing
        this.resize();
        
        this.animate();
        console.log('Magnetic field initialized with', this.gridManager.lines.length, 'lines');
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (!this.eventHandler.hasInitialMousePosition) {
            this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        }
        this.gridManager.createLines(); // Create lines after canvas is properly sized
    }
    
    updateLines() {
        if (this.rippleManager.checkForStuckRipples(this.eventHandler.lastMouseMoveTime)) {
            return;
        }
        
        this.rippleManager.updateRipples(this.mouse.x, this.mouse.y);
        
        this.gridManager.lines.forEach(line => {
            const magnetic = PhysicsEngine.calculateMagneticForce(line, this.mouse, this.isHoverEnabled);
            const rippleForce = this.rippleManager.calculateRippleForce(line);
            PhysicsEngine.updateLine(line, magnetic, rippleForce);
        });
    }
    
    draw() {
        this.renderer.clear();
        this.renderer.drawRipples(this.rippleManager.ripples);
        this.renderer.drawLines(this.gridManager.lines, this.isHoverEnabled);
    }
    
    animate() {
        this.updateLines();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// UI Components
class UIComponents {
    static sayHello() {
        const greetings = [
            "Hello there! 👋",
            "Hi! Nice to meet you! 😊",
            "Greetings! Welcome to my site! 🌟",
            "Hey! Thanks for visiting! ✨",
            "Hello! I'm glad you're here! 🎉",
            "VR enthusiast here! 🥽",
            "Georgia Tech alum checking in! 🐝",
            "Meta Reality Labs engineer at your service! 🚀"
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        NotificationManager.show(randomGreeting);
    }
    
    static toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === CONFIG.THEME.DARK ? CONFIG.THEME.LIGHT : CONFIG.THEME.DARK;
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeText = newTheme === CONFIG.THEME.DARK ? 
            'Dark theme activated 🌙' : 'Light theme activated ☀️';
        NotificationManager.show(themeText);
    }
    
    static initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? CONFIG.THEME.DARK : CONFIG.THEME.LIGHT);
        document.body.setAttribute('data-theme', theme);
    }
    
    static addHoverEffects() {
        const card = document.querySelector('.card');
        const buttons = document.querySelectorAll('.btn');
        
        if (card) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        }
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    static addRippleAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Notification management
class NotificationManager {
    static show(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Keyboard shortcuts
class KeyboardShortcuts {
    static init() {
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                UIComponents.toggleTheme();
            }
            
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                UIComponents.sayHello();
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    UIComponents.initializeTheme();
    UIComponents.addHoverEffects();
    UIComponents.addRippleAnimation();
    KeyboardShortcuts.init();
    
    const magneticField = new MagneticField();
    
    console.log('%c👋 Hello there! Welcome to my website!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
    console.log('%cVR Software Engineer at Meta Reality Labs | Georgia Tech EE Graduate', 'color: #64748b; font-size: 14px;');
    console.log('%cFeel free to explore the code and let me know what you think!', 'color: #64748b; font-size: 12px;');
});
