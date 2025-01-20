document.addEventListener('DOMContentLoaded', () => {
    // Navigation functionality
    initNavigation();
    
    // Smooth scrolling
    initSmoothScroll();
    
    // Form handling
    initContactForm();
});

function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScroll = 0;
    const scrollThreshold = 50;

    // Handle scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Update header background opacity
        if (currentScroll > 0) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(8px)';
        } else {
            header.style.backgroundColor = 'var(--background-color)';
            header.style.backdropFilter = 'none';
        }
        
        // Handle header visibility
        if (currentScroll > scrollThreshold) {
            if (currentScroll > lastScroll) {
                header.classList.add('nav-hidden');
            } else {
                header.classList.remove('nav-hidden');
            }
        }
        
        lastScroll = currentScroll;

        // Only update active link if we're on a page with sections
        if (document.querySelector('section[id]')) {
            // Find the section currently in view
            const sections = document.querySelectorAll('section[id]');
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - header.offsetHeight - 10;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                // Check if we're currently within this section
                if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Only update if we found a current section
            if (currentSection) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(currentSection)) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Set initial active state based on URL
    const currentPath = window.location.pathname;
    if (!currentPath.includes('#')) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath.endsWith(href)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Here you would typically send the data to your server
            // For now, we'll just show a success message
            showFormMessage('Thank you! We will get back to you soon.', 'success');
            form.reset();
        } catch (error) {
            showFormMessage('Something went wrong. Please try again.', 'error');
        }
    });
}

function showFormMessage(message, type = 'success') {
    const formMessage = document.createElement('div');
    formMessage.className = `form-message ${type}`;
    formMessage.textContent = message;
    
    const form = document.getElementById('contact-form');
    form.appendChild(formMessage);
    
    setTimeout(() => {
        formMessage.remove();
    }, 5000);
}
