// Trigger animations on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'slide-in-left', 'slide-in-right', 'zoom-in', 'rotate-in');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in, .rotate-in').forEach(element => {
    observer.observe(element);
});

// Facebook widget show/hide based on scroll position - Improved version
let isWidgetVisible = true;
let scrollTimeout;
const fbWidgets = document.querySelectorAll('.fb-widget');

function updateWidgetVisibility() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeVisible = scrollTop <= 100;
    
    // Only update if state needs to change
    if (shouldBeVisible !== isWidgetVisible) {
        isWidgetVisible = shouldBeVisible;
        
        fbWidgets.forEach(widget => {
            if (shouldBeVisible) {
                // Show widget
                widget.style.display = 'block';
                // Force a reflow to ensure display change is applied
                widget.offsetHeight;
                widget.style.opacity = '1';
                widget.style.transform = 'translateY(-50%) translateX(0)';
            } else {
                // Hide widget
                widget.style.opacity = '0';
                widget.style.transform = 'translateY(-50%) translateX(-20px)';
                // Hide completely after fade out
                setTimeout(() => {
                    if (!isWidgetVisible) {
                        widget.style.display = 'none';
                    }
                }, 500);
            }
        });
    }
}

// Use throttling to prevent performance issues
let lastScrollTime = 0;
window.addEventListener('scroll', function() {
    const now = Date.now();
    if (now - lastScrollTime < 50) return; // Throttle to 20fps
    lastScrollTime = now;
    
    // Clear any pending timeout
    clearTimeout(scrollTimeout);
    
    // Use a small delay to ensure we get the final scroll position
    scrollTimeout = setTimeout(updateWidgetVisibility, 10);
}, false);

// Initial check on page load
updateWidgetVisibility();

// Dynamic particle animation (disabled on mobile)
function createParticle() {
    if (window.innerWidth < 640) return; // Skip on mobile
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const homeSection = document.querySelector('#home');
    if (homeSection) {
        homeSection.appendChild(particle);
        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;
        particle.style.setProperty('--x', `${x}px`);
        particle.style.setProperty('--y', `${y}px`);
        particle.style.animationDelay = `${Math.random() * 4}s`;
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 5000);
    }
}
setInterval(createParticle, 300);

// Mouse trail effect (disabled on mobile)
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 640) return; // Skip on mobile
    const trail = document.createElement('div');
    trail.classList.add('trail');
    document.body.appendChild(trail);
    trail.style.left = `${e.pageX}px`;
    trail.style.top = `${e.pageY}px`;
    setTimeout(() => {
        if (trail.parentNode) {
            trail.remove();
        }
    }, 1000);
});
