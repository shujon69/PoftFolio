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

// Facebook widget show/hide based on scroll position
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Select Facebook widgets
    const fbWidgets = document.querySelectorAll('.fb-widget');
    
    if (scrollTop > 100) {
        // Not at the top of the page - hide widgets
        fbWidgets.forEach(widget => {
            widget.style.transition = 'opacity 0.5s, transform 0.5s';
            widget.style.opacity = '0';
            widget.style.transform = 'translateY(-50%) translateX(-20px)';
            
            // Hide the widget completely after transition
            setTimeout(() => {
                widget.style.display = 'none';
            }, 500);
        });
    } else {
        // At the top of the page - show widgets
        fbWidgets.forEach(widget => {
            widget.style.display = 'block';
            
            // Use setTimeout to ensure the display change is applied before the opacity change
            setTimeout(() => {
                widget.style.opacity = '1';
                widget.style.transform = 'translateY(-50%) translateX(0)';
            }, 10);
        });
    }
}, false);

// Dynamic particle animation (disabled on mobile)
function createParticle() {
    if (window.innerWidth < 640) return; // Skip on mobile
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const homeSection = document.querySelector('#home');
    homeSection.appendChild(particle);
    const x = (Math.random() - 0.5) * 500;
    const y = (Math.random() - 0.5) * 500;
    particle.style.setProperty('--x', `${x}px`);
    particle.style.setProperty('--y', `${y}px`);
    particle.style.animationDelay = `${Math.random() * 4}s`;
    setTimeout(() => particle.remove(), 5000);
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
    setTimeout(() => trail.remove(), 1000);
});
