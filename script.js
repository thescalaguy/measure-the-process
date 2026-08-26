// Waveform Visualization
class Waveform {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bars = [];
        this.isMobile = window.innerWidth <= 768;
        this.numBars = this.isMobile ? 40 : 80;
        this.animationFrame = null;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;

            if (wasMobile !== this.isMobile) {
                this.numBars = this.isMobile ? 40 : 80;
                this.bars = [];
                this.init();
            }

            this.resize();
        });
    }

    resize() {
        this.canvas.width = Math.min(window.innerWidth * 0.9, 1200);
        this.canvas.height = Math.min(window.innerHeight * 0.5, 600);
    }

    init() {
        const centerX = this.canvas.width / 2;
        const barWidth = 4;
        const spacing = 8;

        for (let i = 0; i < this.numBars; i++) {
            const x = centerX - (this.numBars / 2) * spacing + i * spacing;
            const offset = Math.abs(i - this.numBars / 2);
            const maxHeight = this.canvas.height * (1 - offset / this.numBars);

            this.bars.push({
                x,
                width: barWidth,
                height: 0,
                maxHeight,
                targetHeight: Math.random() * maxHeight,
                speed: 0.02 + Math.random() * 0.03,
                phase: Math.random() * Math.PI * 2,
                color: this.getBarColor(i)
            });
        }
    }

    getBarColor(index) {
        const center = this.numBars / 2;
        const distance = Math.abs(index - center);
        const ratio = distance / center;

        if (ratio < 0.3) {
            return '#ffffff';
        } else if (ratio < 0.6) {
            return '#4a9eff';
        } else {
            return '#ff8c42';
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.bars.forEach((bar, index) => {
            const time = Date.now() * 0.001;
            bar.targetHeight = bar.maxHeight * (0.3 + 0.7 * Math.abs(Math.sin(time * bar.speed + bar.phase)));
            bar.height += (bar.targetHeight - bar.height) * 0.1;

            const centerY = this.canvas.height / 2;
            const gradient = this.ctx.createLinearGradient(bar.x, centerY - bar.height / 2, bar.x, centerY + bar.height / 2);
            gradient.addColorStop(0, bar.color);
            gradient.addColorStop(0.5, bar.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                bar.x,
                centerY - bar.height / 2,
                bar.width,
                bar.height
            );
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Smooth Scroll Handler
class ScrollHandler {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.isMobile = window.innerWidth <= 768;
        this.observerOptions = {
            threshold: this.isMobile ? 0.1 : 0.2,
            rootMargin: this.isMobile ? '-50px' : '0px'
        };

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });

        // Observe each approach step individually
        const approachSteps = document.querySelectorAll('.approach-step');
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('step-visible');
                }
            });
        }, {
            threshold: this.isMobile ? 0.2 : 0.3,
            rootMargin: this.isMobile ? '-20px' : '0px'
        });

        approachSteps.forEach(step => {
            stepObserver.observe(step);
        });

        this.setupScrollIndicator();
        this.setupNavigation();
    }

    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const firstSection = document.querySelector('#consultancy');
                if (firstSection) {
                    firstSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('waveform');
    const waveform = new Waveform(canvas);
    const scrollHandler = new ScrollHandler();

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        waveform.destroy();
    });
});