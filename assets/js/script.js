// Add additional JavaScript functionality
document.addEventListener('DOMContentLoaded', () => {
    // Animation on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.section, .project-card, .hero-content, .about-content');
  
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
  
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animate');
        }
      });
    };
  
    // Run on load
    animateOnScroll();
  
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
  
    // Typed.js text animation
    if (document.getElementById("typed-text")) {
      const typed = new Typed("#typed-text", {
        strings: ["Frontend Web Developer", "UI Designer", "Creative Coder"],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true
      });
    }
  
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        // Simulate form submission
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
      });
    }
  });
  