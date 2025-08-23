// Interactive functionality for the personal website

// Magnetic field effect
class MagneticField {
    constructor() {
        this.canvas = document.getElementById('magneticField');
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: -1000, y: -1000 };
        this.isMouseDown = false;
        this.lines = [];
        this.gridSize = 30;
        this.lineLength = 10;
        this.maxForce = 1.2;
        this.ripples = [];
        this.animationId = null;
        this.isHoverEnabled = window.matchMedia('(hover: hover)').matches;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createLines();
        this.bindEvents();
        this.animate();
        console.log('Magnetic field initialized with', this.lines.length, 'lines');
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createLines();
    }
    
    createLines() {
        this.lines = [];
        
        // Adjust grid size based on device type and screen size for performance
        const screenArea = this.canvas.width * this.canvas.height;
        let adjustedGridSize;
        
        if (this.isHoverEnabled) {
            // For hover-enabled devices (lines), use original logic
            adjustedGridSize = screenArea > 1000000 ? this.gridSize : this.gridSize * 1.5;
        } else {
            // For touch devices (dots), create a denser grid
            adjustedGridSize = screenArea > 1000000 ? this.gridSize * 0.6 : this.gridSize * 0.8;
        }
        
        const cols = Math.ceil(this.canvas.width / adjustedGridSize);
        const rows = Math.ceil(this.canvas.height / adjustedGridSize);
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.lines.push({
                    x: i * adjustedGridSize + adjustedGridSize / 2,
                    y: j * adjustedGridSize + adjustedGridSize / 2,
                    originalX: i * adjustedGridSize + adjustedGridSize / 2,
                    originalY: j * adjustedGridSize + adjustedGridSize / 2,
                    angle: 0,
                    targetAngle: 0,
                    velocity: 0,
                    velocityX: 0,
                    velocityY: 0
                });
            }
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        // Listen for pointer events on the document since canvas has pointer-events: none
        document.addEventListener('pointermove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Debug: log pointer movement for touch
            if (e.pointerType === 'touch' && this.isMouseDown) {
                console.log('Touch move:', e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('pointerleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
            this.isMouseDown = false;
        });
        
        // Start ripple effect on pointerdown (any primary pointer)
        document.addEventListener('pointerdown', (e) => {
            if (e.isPrimary) { // Primary pointer (first finger, left mouse button, etc.)
                this.isMouseDown = true;
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.createRipple(e.clientX, e.clientY);
                console.log('Pointer down:', e.pointerType, e.clientX, e.clientY);
                
                // Prevent default touch behavior to avoid scroll interference
                if (e.pointerType === 'touch') {
                    e.preventDefault();
                }
            }
        });
        
        // Prevent context menu on long-press for touch devices
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.isMouseDown = false; // Reset state if context menu somehow appears
        });
        
        // Additional touch event handling for better touch tracking
        document.addEventListener('touchstart', (e) => {
            // if (e.touches.length > 0) {
            //     // Prevent context menu on long-press
            //     e.preventDefault();
            // }
        }, { passive: false });
        
        // Stop ripple effect on pointerup
        document.addEventListener('pointerup', (e) => {
            if (e.isPrimary) {
                this.isMouseDown = false;
                console.log('Pointer up:', e.pointerType);
            }
        });
        
        // Handle pointer cancellation (right-click, drag out of window, etc.)
        document.addEventListener('pointercancel', (e) => {
            if (e.isPrimary) {
                this.isMouseDown = false;
                console.log('Pointer cancel:', e.pointerType);
            }
        });
        
        // Additional touch event handling for better touch tracking
        document.addEventListener('touchmove', (e) => {
            if (this.isMouseDown && e.touches.length > 0) {
                const touch = e.touches[0];
                this.mouse.x = touch.clientX;
                this.mouse.y = touch.clientY;
                console.log('Touch move (native):', touch.clientX, touch.clientY);
                
                // Prevent default touch behavior when we're tracking for ripples
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    calculateMagneticForce(line) {
        // Only apply magnetic force on hover-enabled devices
        if (!this.isHoverEnabled) {
            return { force: 0, angle: 0 };
        }
        
        const dx = this.mouse.x - line.x;
        const dy = this.mouse.y - line.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Avoid division by zero and very close distances
        if (distance < 5) return { force: 0, angle: 0 };
        
        // Physics-based inverse square law: F = k / r²
        // Using a larger constant to make the effect more visible
        const forceConstant = 50000;
        const force = forceConstant / (distance * distance);
        
        // Cap the maximum force to prevent extreme values
        const cappedForce = Math.min(force, this.maxForce);
        
        const angle = Math.atan2(dy, dx);
        
        return { force: cappedForce, angle };
    }
    
    createRipple(x, y) {
        this.ripples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 200,
            speed: 12,
            strength: 1.0,
            life: 1.0
        });
    }
    
    updateRipples() {
        // If mouse is pressed down, continuously create ripples at mouse position
        if (this.isMouseDown) {
            this.createRipple(this.mouse.x, this.mouse.y);
        }
    }
    
    calculateRippleForce(line) {
        let totalForce = { x: 0, y: 0 };
        
        this.ripples.forEach((ripple, index) => {
            const dx = line.x - ripple.x;
            const dy = line.y - ripple.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Use exponential decay for all distances within ripple radius
            if (distance <= ripple.radius) {
                // Exponential decay: stronger at center, weaker at edges
                const normalizedDistance = distance / ripple.radius;
                const decayFactor = Math.exp(-normalizedDistance * 2); // Exponential decay
                
                // Calculate outward force with exponential decay
                const forceMagnitude = ripple.strength * (1 - ripple.life) * 6 * decayFactor;
                const angle = Math.atan2(dy, dx); // Outward direction
                
                totalForce.x += Math.cos(angle) * forceMagnitude;
                totalForce.y += Math.sin(angle) * forceMagnitude;
            }
        });
        
        return totalForce;
    }
    
    updateLines() {
        // Update ripples
        this.updateRipples();
        this.ripples = this.ripples.filter(ripple => {
            ripple.radius += ripple.speed;
            ripple.life -= 0.04;
            return ripple.life > 0;
        });
        
        this.lines.forEach(line => {
            const magnetic = this.calculateMagneticForce(line);
            const rippleForce = this.calculateRippleForce(line);
            
            // Handle magnetic rotation
            if (magnetic.force > 0.001) {
                // Apply magnetic force - strength determines how much to rotate toward cursor
                const forceInfluence = Math.min(magnetic.force / this.maxForce, 1.0);
                const magneticAngle = magnetic.angle;
                
                // Blend between current target and magnetic direction based on force strength
                let angleDiff = magneticAngle - line.targetAngle;
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                
                line.targetAngle += angleDiff * forceInfluence * 0.3;
            } else {
                // Return to neutral position (horizontal) when no magnetic force
                line.targetAngle *= 0.9;
            }
            
            // Handle ripple position warping
            if (Math.abs(rippleForce.x) > 0.001 || Math.abs(rippleForce.y) > 0.001) {
                // Apply ripple force to position (not rotation) - much more responsive
                line.velocityX += rippleForce.x * 0.2;
                line.velocityY += rippleForce.y * 0.2;
            }
            
            // Always return to original position (gentle spring force)
            const dx = line.originalX - line.x;
            const dy = line.originalY - line.y;
            line.velocityX += dx * 0.06;
            line.velocityY += dy * 0.06;
            
            // Apply damping to position velocities
            line.velocityX *= 0.9;
            line.velocityY *= 0.9;
            
            // Update position
            line.x += line.velocityX;
            line.y += line.velocityY;
            
            // Smooth rotation with improved damping
            let angleDiff = line.targetAngle - line.angle;
            
            // Handle angle wrapping (shortest rotation path)
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            // Responsiveness proportional to magnetic force with better damping
            const responsiveness = 0.12 + (magnetic.force / this.maxForce) * 0.18;
            line.velocity += angleDiff * responsiveness;
            line.velocity *= 0.85; // Increased damping to reduce oscillation
            line.angle += line.velocity;
        });
    }
    
    drawLines() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ripples (very subtle visual indicator)
        this.ripples.forEach(ripple => {
            this.ctx.strokeStyle = `rgba(59, 130, 246, ${ripple.life * 0.15})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        });
        
        // Draw magnetic field lines or dots based on device type
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.fillStyle = '#3b82f6'; // Set fill style to match stroke style for dots
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';
        
        this.lines.forEach(line => {
            if (this.isHoverEnabled) {
                // Draw lines for hover-enabled devices (magnetic field effect)
                const x1 = line.x - Math.cos(line.angle) * this.lineLength / 2;
                const y1 = line.y - Math.sin(line.angle) * this.lineLength / 2;
                const x2 = line.x + Math.cos(line.angle) * this.lineLength / 2;
                const y2 = line.y + Math.sin(line.angle) * this.lineLength / 2;
                
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();
            } else {
                // Draw dots for touch devices (simpler grid for ripple effect)
                this.ctx.beginPath();
                this.ctx.arc(line.x, line.y, 1, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        });
    }
    
    animate() {
        this.updateLines();
        this.drawLines();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Say hello function
function sayHello() {
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
    
    // Create a temporary notification
    showNotification(randomGreeting);
}

// Toggle theme function
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Show theme change notification
    const themeText = newTheme === 'dark' ? 'Dark theme activated 🌙' : 'Light theme activated ☀️';
    showNotification(themeText);
}

// Show notification function
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme, or system preference, or default to light
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', theme);
}

// Add some interactive hover effects
function addHoverEffects() {
    const card = document.querySelector('.card');
    const buttons = document.querySelectorAll('.btn');
    
    // Add subtle parallax effect to card
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
    
    // Add ripple effect to buttons
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
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation to CSS
function addRippleAnimation() {
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    addHoverEffects();
    addRippleAnimation();
    
    // Initialize magnetic field effect
    const magneticField = new MagneticField();
    
    // Add some console fun
    console.log('%c👋 Hello there! Welcome to my website!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
    console.log('%cVR Software Engineer at Meta Reality Labs | Georgia Tech EE Graduate', 'color: #64748b; font-size: 14px;');
    console.log('%cFeel free to explore the code and let me know what you think!', 'color: #64748b; font-size: 12px;');
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Space to say hello
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        sayHello();
    }
});
