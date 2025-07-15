// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    function addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // Remove existing listeners to prevent duplicates
            anchor.removeEventListener('click', smoothScrollHandler);
            anchor.addEventListener('click', smoothScrollHandler);
        });
    }
    
    function smoothScrollHandler(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Initial setup
    addSmoothScrolling();
    
    // Re-attach listeners when hero slides change
    function reattachHeroButtonListeners() {
        setTimeout(() => {
            addSmoothScrolling();
        }, 100);
    }
    
    // Also attach listeners to hero carousel buttons specifically
    function attachHeroButtonListeners() {
        const heroButtons = document.querySelectorAll('.hero-slide .btn');
        heroButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Project Carousel functionality
let currentSlide = 0;
let isTransitioning = false;
let slides = [];
let dots = [];
let totalSlides = 0;
let autoSlideInterval;

function initializeCarousel() {
    slides = document.querySelectorAll('.project-slide');
    dots = document.querySelectorAll('.dot');
    totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    // Show first slide
    showSlide(0);
    
    // Start auto-advance
    startAutoSlide();
    
    // Add event listeners
    addCarouselEventListeners();
}

function initializeHeroCarousel() {
    heroSlides = document.querySelectorAll('.hero-slide');
    heroDots = document.querySelectorAll('.hero-dot');
    totalHeroSlides = heroSlides.length;
    
    if (totalHeroSlides === 0) return;
    
    // Show first slide
    showHeroSlide(0);
    
    // Start auto-advance
    startHeroAutoSlide();
}

function showSlide(n) {
    if (isTransitioning || n < 0 || n >= totalSlides) return;
    isTransitioning = true;
    
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide
    if (slides[n]) {
        slides[n].classList.add('active');
    }
    
    // Activate current dot
    if (dots[n]) {
        dots[n].classList.add('active');
    }
    
    // Update current slide index
    currentSlide = n;
    
    // Reset transition flag after animation
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

// Make functions globally accessible
window.changeSlide = function(direction) {
    if (isTransitioning) return;
    
    let newSlide = currentSlide + direction;
    
    if (newSlide >= totalSlides) {
        newSlide = 0;
    }
    
    if (newSlide < 0) {
        newSlide = totalSlides - 1;
    }
    
    showSlide(newSlide);
};

window.currentSlide = function(n) {
    if (isTransitioning) return;
    showSlide(n - 1);
};

// Hero Carousel - Simple and Working
let heroCurrentSlide = 0;
let heroSlides = [];
let heroDots = [];

function initHeroCarousel() {
    heroSlides = document.querySelectorAll('.hero-slide');
    heroDots = document.querySelectorAll('.hero-dot');
    
    if (heroSlides.length === 0) return;
    
    // Show first slide
    showHeroSlide(0);
    
    // Attach button listeners
    attachHeroButtonListeners();
    
    // Auto advance
    setInterval(() => {
        nextHeroSlide();
    }, 6000);
}

function showHeroSlide(index) {
    // Hide all slides
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroDots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (heroSlides[index]) {
        heroSlides[index].classList.add('active');
    }
    if (heroDots[index]) {
        heroDots[index].classList.add('active');
    }
    
    heroCurrentSlide = index;
    
    // Re-attach button listeners for the new active slide
    setTimeout(() => {
        attachHeroButtonListeners();
    }, 100);
}

function nextHeroSlide() {
    let next = heroCurrentSlide + 1;
    if (next >= heroSlides.length) next = 0;
    showHeroSlide(next);
}

function prevHeroSlide() {
    let prev = heroCurrentSlide - 1;
    if (prev < 0) prev = heroSlides.length - 1;
    showHeroSlide(prev);
}

function goToHeroSlide(index) {
    showHeroSlide(index - 1);
}

// Global functions for HTML onclick
window.changeHeroSlide = function(direction) {
    if (direction > 0) {
        nextHeroSlide();
    } else {
        prevHeroSlide();
    }
};

window.currentHeroSlide = function(index) {
    goToHeroSlide(index);
};

function startAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function addCarouselEventListeners() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    // Pause auto-advance on hover
    carouselContainer.addEventListener('mouseenter', () => {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            changeSlide(1);
        } else {
            // Swipe right - previous slide
            changeSlide(-1);
        }
    }
}

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !service || !message) {
        showNotification('Please fill all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email.', 'error');
        return;
    }
    
    // Show success message
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    
    // Reset form
    this.reset();
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create notification content
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    const messageText = document.createElement('span');
    messageText.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.className = 'notification-close';
    
    // Append elements
    notification.appendChild(icon);
    notification.appendChild(messageText);
    notification.appendChild(closeBtn);
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        padding: 16px 28px;
        border-radius: 50px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%) scale(0.8);
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 380px;
        min-width: 280px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        line-height: 1.3;
    `;
    
    // Set background based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #90EE90, #98FB98)';
        notification.style.color = '#2c5530';
        notification.style.borderLeft = '4px solid #7CFC00';
    } else {
        notification.style.background = 'linear-gradient(135deg, #90EE90, #98FB98)';
        notification.style.color = '#2c5530';
        notification.style.borderLeft = '4px solid #7CFC00';
    }
    
    // Style icon
    icon.style.cssText = `
        font-size: 1.3rem;
        flex-shrink: 0;
        animation: notificationIconPulse 0.6s ease-out;
    `;
    
    // Style close button
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #2c5530;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        margin-left: auto;
        flex-shrink: 0;
    `;
    
    // Add hover effect to close button
    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(44, 85, 48, 0.1)';
        this.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'none';
        this.style.transform = 'scale(1)';
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0) scale(1)';
    }, 100);
    
    // Close button functionality
    closeBtn.addEventListener('click', function() {
        closeNotification(notification);
    });
    
    // Auto remove after 6 seconds
    const autoRemove = setTimeout(() => {
        closeNotification(notification);
    }, 6000);
    
    // Function to close notification
    function closeNotification(notification) {
        clearTimeout(autoRemove);
        notification.style.transform = 'translateX(100%) scale(0.8)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .stat, .about-image, .contact-form');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Service cards hover effect enhancement
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Stats counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat h4');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    
    // Ensure carousels are initialized after all content is loaded
    setTimeout(() => {
        if (slides.length === 0) {
            initializeCarousel();
        }
        if (heroSlides.length === 0) {
            initializeHeroCarousel();
        }
    }, 100);
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set initial body opacity
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Initialize carousels
    initializeCarousel();
    initHeroCarousel();
    
    // Add loading class to body
    document.body.classList.add('loaded');
}); 