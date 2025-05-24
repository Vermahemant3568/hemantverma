// Function to include HTML files
function includeHTML() {
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');
    
    if (headerElement) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerElement.innerHTML = data;
                // Initialize mobile menu after header is loaded
                initMobileMenu();
            });
    }
    
    if (footerElement) {
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                footerElement.innerHTML = data;
                // Update copyright year
                document.getElementById('year').textContent = new Date().getFullYear();
            });
    }
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-times');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            });
        });
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    includeHTML();
    
    // Add smooth scrolling after content is loaded
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Sticky header effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.sticky-header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// Sticky header with scroll-then-fix behavior
let lastScrollPosition = 0;
const scrollThreshold = 100; // How far to scroll before fixing header

window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY || window.pageYOffset;
    const header = document.querySelector('.sticky-header');
    
    if (currentScrollPosition > scrollThreshold) {
        // Fix header to top after scrolling 100px
        header.classList.add('fixed');
        
        // Optional: Hide header when scrolling up
        if (currentScrollPosition > lastScrollPosition) {
            // Scrolling down
            header.classList.remove('scrolled-up');
        } else {
            // Scrolling up
            header.classList.add('scrolled-up');
        }
    } else {
        // Return to normal position when near top
        header.classList.remove('fixed', 'scrolled-up');
    }
    
    lastScrollPosition = currentScrollPosition;
});