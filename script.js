AOS.init({
    duration: 1000,
    once: true
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 35, 126, 0.98)';
    } else {
        navbar.style.background = 'rgba(26, 35, 126, 0.95)';
    }
});

// Countdown Timer
function updateCountdown() {
    const eventDate = new Date('March 15, 2024 09:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Form validation and submission
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        teamName: document.getElementById('teamName').value.trim(),
        category: document.getElementById('category').value,
        experience: document.getElementById('experience').value,
        terms: document.getElementById('terms').checked
    };
    
    // Enhanced validation with specific error messages
    const errors = [];
    
    if (!formData.firstName) errors.push('First name is required');
    if (!formData.lastName) errors.push('Last name is required');
    if (!formData.email) errors.push('Email address is required');
    if (!formData.phone) errors.push('Phone number is required');
    if (!formData.category) errors.push('Please select an event category');
    if (!formData.terms) errors.push('Please accept the terms and conditions');
    
    if (errors.length > 0) {
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        alert('Please enter a valid phone number.');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button[form="registrationForm"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Check if EmailJS is available and configured
    if (typeof emailjs !== 'undefined' && emailjs.init) {
        try {
            // Send email using EmailJS
            emailjs.send('service_elite2k24', 'template_registration', {
                to_email: formData.email,
                to_name: formData.firstName + ' ' + formData.lastName,
                from_name: 'Elite2k24 Team',
                message: `Dear ${formData.firstName} ${formData.lastName},

Congratulations! You have been selected to participate in Elite2k24 - The Ultimate Tech Innovation Summit.

Your registration details:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Team Name: ${formData.teamName || 'Not specified'}
- Category: ${formData.category}
- Experience Level: ${formData.experience}

Event Details:
- Date: March 15-17, 2024
- Location: Innovation City Convention Center
- Prize Pool: $50,000+

You will receive further instructions and event updates via email.

Best regards,
The Elite2k24 Team`
            })
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                handleRegistrationSuccess(formData);
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                // Fallback to local success handling
                handleRegistrationSuccess(formData);
            });
        } catch (error) {
            console.log('EmailJS error:', error);
            // Fallback to local success handling
            handleRegistrationSuccess(formData);
        }
    } else {
        // EmailJS not available, use fallback
        console.log('EmailJS not available, using fallback registration.');
        handleRegistrationSuccess(formData);
    }
});

// Function to handle successful registration
function handleRegistrationSuccess(formData) {
    // Close registration modal
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    if (registerModal) {
        registerModal.hide();
    }
    
    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Reset form
    document.getElementById('registrationForm').reset();
    
    // Store registration data (in a real app, this would be sent to a server)
    console.log('Registration data:', formData);
    
    // Reset button state
    const submitBtn = document.querySelector('button[form="registrationForm"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Register Now';
        submitBtn.disabled = false;
    }
}

// Add form reset functionality when modal is closed
document.getElementById('registerModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('registrationForm').reset();
    const submitBtn = document.querySelector('button[form="registrationForm"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Register Now';
        submitBtn.disabled = false;
    }
});

// Remove duplicate event listener for register button to avoid conflicts
// The form submission handler already manages the button state

// Animate cards on scroll
function animateOnScroll() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            card.classList.add('animate-fadeIn');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Initial call

// Mobile menu close on link click
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            bootstrap.Collapse.getInstance(navbarCollapse).hide();
        }
    });
});

// Sponsor logo hover effect
document.querySelectorAll('.sponsor-logo').forEach(logo => {
    logo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Dynamic content loading simulation
const eventData = {
    title: "Elite2k24",
    subtitle: "Where Innovation Meets Excellence",
    description: "The premier tech innovation summit bringing together the brightest minds in technology",
    eventDate: "March 15-17, 2024",
    location: "Innovation City Convention Center",
    prizePool: "$50,000+",
    participants: "500+ Participants",
    sponsors: "20+ Sponsors",
    speakers: "15+ Industry Experts"
};

// Add some interactive statistics
function animateStats() {
    const stats = [
        { element: 'participants', target: 500, suffix: '+' },
        { element: 'projects', target: 120, suffix: '+' },
        { element: 'prizes', target: 50000, suffix: '+', prefix: '$' },
        { element: 'hours', target: 72, suffix: '' }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.element);
        if (element) {
            let current = 0;
            const increment = stat.target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    current = stat.target;
                    clearInterval(timer);
                }
                element.textContent = (stat.prefix || '') + 
                                    Math.floor(current).toLocaleString() + 
                                    (stat.suffix || '');
            }, 20);
        }
    });
}

// Trigger stats animation when about section is visible
const aboutSection = document.getElementById('about');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
});

if (aboutSection) {
    observer.observe(aboutSection);
}

// Add typing effect to hero subtitle
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Initialize typing effect after page load
window.addEventListener('load', () => {
    const heroSubtitle = document.querySelector('.hero-content p');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 30);
        }, 1000);
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add interactive elements to timeline
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Console welcome message
console.log('%c🚀 Welcome to Elite2k24! 🚀', 'color: #ffd700; font-size: 20px; font-weight: bold;');
console.log('%cJoin us for the ultimate tech innovation summit!', 'color: #1a237e; font-size: 14px;');
console.log('%cEvent Date: March 15-17, 2024', 'color: #666; font-size: 12px;');