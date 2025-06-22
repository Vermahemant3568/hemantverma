import { db } from './firebase-config.js';
import { collection, getDocs, doc, getDoc, query, orderBy, limit, setDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const currentPage = window.location.pathname;
const isHomePage = currentPage.endsWith('index.html') || currentPage === '/' || currentPage.endsWith('/hemantverma/') || currentPage.endsWith('/hemantverma');
const isProjectPage = currentPage.includes('project.html');

/**
 * Fetches all projects from the 'projects' collection in Firestore and populates the projects grid.
 */
async function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        let projectsHTML = '';
        querySnapshot.forEach((doc) => {
            const project = doc.data();
            projectsHTML += `
                <div class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 border border-purple-100">
                    <div class="relative overflow-hidden">
                        <img src="${project.imageUrl || 'assets/images/placeholder.png'}" alt="${project.title}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-3 text-purple-700 group-hover:text-purple-800 transition-colors">${project.title}</h3>
                        <p class="text-gray-600 text-sm leading-relaxed mb-4">${project.description.substring(0, 100)}...</p>
                        ${project.techStack ? `
                            <div class="flex flex-wrap gap-2 mb-4">
                                ${project.techStack.split(',').map(tech => `<span class="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">${tech.trim()}</span>`).join('')}
                            </div>
                        ` : ''}
                        <a href="project.html?id=${doc.id}" class="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold text-sm transition-colors">
                            View Project <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </a>
                    </div>
                </div>
            `;
        });
        projectsGrid.innerHTML = projectsHTML;
    } catch (error) {
        console.error("Error loading projects: ", error);
        projectsGrid.innerHTML = '<p class="col-span-full text-center text-gray-600">Error loading projects. Please try again later.</p>';
    }
}

/**
 * Fetches content for the About section from Firestore.
 */
async function loadAboutSection() {
    const aboutContent = document.getElementById('about-content');
    if (!aboutContent) return;

    try {
        const docRef = doc(db, "portfolio", "about");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            aboutContent.innerHTML = `<p>${data.description}</p>`;
            
            // Hero bio is now managed by loadHeroSection() only
            
            // Update about image
            const aboutImage = document.getElementById('about-image');
            if (aboutImage && data.imageUrl) {
                aboutImage.src = data.imageUrl;
            }
            
            // Update about facts
            const aboutFacts = document.getElementById('about-facts');
            if (aboutFacts && data.facts) {
                aboutFacts.innerHTML = `
                    <div class="flex items-center"><i class="fas fa-map-marker-alt text-purple-600 mr-3"></i><span>Location: ${data.facts.location || 'Not specified'}</span></div>
                    <div class="flex items-center"><i class="fas fa-briefcase text-purple-600 mr-3"></i><span>Experience: ${data.facts.experience || 'Not specified'}</span></div>
                    <div class="flex items-center"><i class="fas fa-graduation-cap text-purple-600 mr-3"></i><span>Education: ${data.facts.education || 'Not specified'}</span></div>
                    <div class="flex items-center"><i class="fas fa-heart text-purple-600 mr-3"></i><span>Interests: ${data.facts.interests || 'Not specified'}</span></div>
                `;
            }
        } else {
            aboutContent.innerHTML = "<p>About content could not be loaded.</p>";
        }
    } catch (error) {
        console.error("Error loading about section: ", error);
        aboutContent.innerHTML = "<p>Error loading about section.</p>";
    }
}

/**
 * Fetches skills from the 'skills' collection in Firestore and populates the skills grid.
 */
async function loadSkills() {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;

    try {
        const querySnapshot = await getDocs(collection(db, "skills"));
        let skillsHTML = '';
        querySnapshot.forEach((doc) => {
            const skill = doc.data();
            // Assuming a 'name' and 'icon' field (e.g., 'fab fa-html5')
            skillsHTML += `
                <div class="group flex flex-col items-center p-6 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 border border-white/30 hover:bg-white/30">
                    <div class="bg-white/20 p-4 rounded-full mb-4 group-hover:bg-white/40 transition-all duration-300">
                        <i class="${skill.icon || 'fas fa-code'} text-4xl text-white drop-shadow-lg"></i>
                    </div>
                    <h4 class="font-bold text-white text-center text-sm group-hover:text-yellow-200 transition-colors duration-300 mb-2">${skill.name}</h4>
                    ${skill.level ? `<span class="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full mb-2">${skill.level}</span>` : ''}
                    ${skill.description ? `<p class="text-xs text-white/70 text-center leading-relaxed">${skill.description}</p>` : ''}
                </div>
            `;
        });
        skillsGrid.innerHTML = skillsHTML;
    } catch (error) {
        console.error("Error loading skills: ", error);
        skillsGrid.innerHTML = '<p class="col-span-full text-center text-white">Could not load skills.</p>';
    }
}

/**
 * Fetches a single project's details from Firestore based on the ID from the URL query string.
 */
async function loadProjectDetails() {
    const projectDetailContent = document.getElementById('project-detail-content');
    if (!projectDetailContent) return;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');

    if (!projectId) {
        projectDetailContent.innerHTML = '<p>Project ID not found.</p>';
        return;
    }

    try {
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const project = docSnap.data();
            projectDetailContent.innerHTML = `
                <h1 class="text-4xl font-bold text-center mb-8">${project.title}</h1>
                ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="w-full h-auto rounded-lg shadow-lg mb-8">` : ''}
                <div class="prose max-w-none text-gray-700 leading-relaxed">
                    <p>${project.description}</p>
                </div>
                ${project.link ? `<div class="mt-8 text-center"><a href="${project.link}" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition duration-300" target="_blank">View Live Project</a></div>` : ''}
            `;
        } else {
            console.log("No such document!");
            projectDetailContent.innerHTML = '<p>Project not found.</p>';
        }
    } catch (error) {
        console.error("Error loading project details: ", error);
        projectDetailContent.innerHTML = '<p>Error loading project details.</p>';
    }
}

/**
 * Loads contact information and social links from Firebase
 */
async function loadContactInfo() {
    try {
        const docRef = doc(db, "portfolio", "contact");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Update contact email
            const contactEmail = document.getElementById('contact-email');
            if (contactEmail && data.email) {
                contactEmail.href = `mailto:${data.email}`;
            }
            
            // Load social links
            const socialLinks = document.getElementById('social-links');
            if (socialLinks && data.socialLinks) {
                let socialHTML = '';
                data.socialLinks.forEach(link => {
                    socialHTML += `<a href="${link.url}" class="backgroound-white text-white-600 hover:text-purple-600 text-2xl transition duration-300" target="_blank p-4 rounded-full"><i class="${link.icon}"></i></a>`;
                });
                socialLinks.innerHTML = socialHTML;
            }
        }
    } catch (error) {
        console.error("Error loading contact info: ", error);
    }
}

/**
 * Loads featured blog posts for homepage
 */
async function loadFeaturedBlogs() {
    const featuredBlogsGrid = document.getElementById('featured-blogs-grid');
    if (!featuredBlogsGrid) return;

    try {
        const q = query(collection(db, "blogs"), orderBy("publishedAt", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            featuredBlogsGrid.innerHTML = '<div class="col-span-full text-center"><div class="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30"><i class="fas fa-blog text-4xl text-white/60 mb-4"></i><p class="text-white">No blog posts available yet.</p></div></div>';
            return;
        }

        let blogsHTML = '';
        querySnapshot.forEach((doc) => {
            const blog = doc.data();
            const publishedDate = blog.publishedAt ? new Date(blog.publishedAt.seconds * 1000).toLocaleDateString() : 'Draft';
            blogsHTML += `
                <div class="group bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 border border-white/30 hover:bg-white/30">
                    ${blog.imageUrl ? `
                        <div class="relative overflow-hidden">
                            <img src="${blog.imageUrl}" alt="${blog.title}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span class="text-xs text-white font-medium">${publishedDate}</span>
                            </div>
                        </div>
                    ` : ''}
                    <div class="p-6">
                        ${!blog.imageUrl ? `
                            <div class="flex items-center mb-3">
                                <div class="bg-white/20 p-2 rounded-full mr-3">
                                    <i class="fas fa-blog text-white text-sm"></i>
                                </div>
                                <span class="text-sm text-orange-200">${publishedDate}</span>
                            </div>
                        ` : ''}
                        <h3 class="text-xl font-bold mb-3 text-white group-hover:text-yellow-200 transition-colors">${blog.title}</h3>
                        <p class="text-white/90 text-sm leading-relaxed mb-4">${blog.excerpt || blog.content.substring(0, 100)}...</p>
                        <a href="blog-post.html?id=${doc.id}" class="inline-flex items-center text-white hover:text-yellow-200 font-semibold text-sm transition-colors">
                            Read More <i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </a>
                    </div>
                </div>
            `;
        });
        featuredBlogsGrid.innerHTML = blogsHTML;
    } catch (error) {
        console.error("Error loading featured blogs: ", error);
        featuredBlogsGrid.innerHTML = '<p class="col-span-full text-center text-white">Error loading blog posts.</p>';
    }
}

/**
 * Loads hero section data
 */
async function loadHeroSection() {
    try {
        const docRef = doc(db, "portfolio", "hero");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Update hero name
            const heroName = document.getElementById('hero-name');
            if (heroName && data.name) {
                heroName.textContent = data.name;
            }
            
            // Update hero bio
            const heroBio = document.getElementById('hero-bio');
            if (heroBio) {
                if (data.bio) {
                    heroBio.innerHTML = data.bio;
                } else {
                    try {
                        const aboutRef = doc(db, "portfolio", "about");
                        const aboutSnap = await getDoc(aboutRef);
                        if (aboutSnap.exists() && aboutSnap.data().heroBio) {
                            heroBio.innerHTML = aboutSnap.data().heroBio;
                        }
                    } catch (error) {
                        console.error("Error loading hero bio from about section: ", error);
                    }
                }
            }
            
            // Update hero image
            const heroImage = document.querySelector('#hero img');
            if (heroImage && data.imageUrl) {
                heroImage.src = data.imageUrl;
            }
            
            // Update CV download link
            const cvButton = document.querySelector('a[download]');
            if (cvButton && data.cvUrl) {
                cvButton.href = data.cvUrl;
            }
            
            // Update social links
            const socialLinks = document.getElementById('social-links');
            if (socialLinks && data.socialLinks) {
                let socialHTML = '';
                data.socialLinks.forEach(link => {
                    socialHTML += `<a href="${link.url}" target="_blank" class="text-white/80 hover:text-yellow-300 text-3xl transition-all duration-300 transform hover:scale-125"><i class="${link.icon}"></i></a>`;
                });
                socialLinks.innerHTML = socialHTML;
            }
        }
    } catch (error) {
        console.error("Error loading hero section: ", error);
    }
}

/**
 * Typing animation for hero section
 */
function initTypingAnimation() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;
    
    const titles = ['Frontend Developer', 'Graphic Designer', 'UI/UX Designer'];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    
    function type() {
        const fullText = titles[currentIndex];
        
        if (isDeleting) {
            currentText = fullText.substring(0, currentText.length - 1);
        } else {
            currentText = fullText.substring(0, currentText.length + 1);
        }
        
        typingText.textContent = currentText;
        
        let typeSpeed = isDeleting ? 100 : 150;
        
        if (!isDeleting && currentText === fullText) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % titles.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

/**
 * Loads education timeline
 */
async function loadEducation() {
    const educationTimeline = document.getElementById('education-timeline');
    if (!educationTimeline) return;
    
    try {
        const docRef = doc(db, "portfolio", "education");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().education) {
            const education = docSnap.data().education;
            let educationHTML = '';
            
            education.forEach(edu => {
                educationHTML += `
                    <div class="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
                        <div class="flex items-start">
                            <div class="bg-white/30 p-3 rounded-full mr-4">
                                <i class="fas fa-graduation-cap text-white"></i>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold text-white">${edu.degree}</h4>
                                <p class="text-purple-200">${edu.institution}</p>
                                <p class="text-white/80 text-sm">${edu.year}</p>
                                ${edu.description ? `<p class="text-white/70 text-sm mt-2">${edu.description}</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            educationTimeline.innerHTML = educationHTML;
        } else {
            educationTimeline.innerHTML = '<p class="text-white/80">No education data available.</p>';
        }
    } catch (error) {
        console.error("Error loading education: ", error);
        educationTimeline.innerHTML = '<p class="text-white/80">Error loading education.</p>';
    }
}

/**
 * Loads experience timeline
 */
async function loadExperience() {
    const experienceTimeline = document.getElementById('experience-timeline');
    if (!experienceTimeline) return;
    
    try {
        const docRef = doc(db, "portfolio", "experience");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().experiences) {
            const experiences = docSnap.data().experiences;
            let experienceHTML = '';
            
            experiences.forEach(exp => {
                experienceHTML += `
                    <div class="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/30">
                        <div class="flex items-start">
                            <div class="bg-white/30 p-3 rounded-full mr-4">
                                <i class="fas fa-briefcase text-white"></i>
                            </div>
                            <div>
                                <h4 class="text-lg font-bold text-white">${exp.position}</h4>
                                <p class="text-purple-200">${exp.company}</p>
                                <p class="text-white/80 text-sm">${exp.duration}</p>
                                ${exp.description ? `<p class="text-white/70 text-sm mt-2">${exp.description}</p>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            experienceTimeline.innerHTML = experienceHTML;
        } else {
            experienceTimeline.innerHTML = '<p class="text-white/80">No experience data available.</p>';
        }
    } catch (error) {
        console.error("Error loading experience: ", error);
        experienceTimeline.innerHTML = '<p class="text-white/80">Error loading experience.</p>';
    }
}

/**
 * Loads contact information
 */
async function loadContactDetails() {
    try {
        const docRef = doc(db, "portfolio", "contact");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Update contact details
            const emailDisplay = document.getElementById('contact-email-display');
            const phone = document.getElementById('contact-phone');
            const location = document.getElementById('contact-location');
            
            if (emailDisplay && data.email) emailDisplay.textContent = data.email;
            if (phone && data.phone) phone.textContent = data.phone;
            if (location && data.location) location.textContent = data.location;
            
            // Update social links
            const contactSocial = document.getElementById('contact-social');
            if (contactSocial && data.socialLinks) {
                let socialHTML = '';
                data.socialLinks.forEach(link => {
                    socialHTML += `<a href="${link.url}" class="text-purple-600 hover:text-purple-800 text-2xl transition-colors" target="_blank"><i class="${link.icon}"></i></a>`;
                });
                contactSocial.innerHTML = socialHTML;
            }
        }
    } catch (error) {
        console.error("Error loading contact details: ", error);
    }
}

/**
 * Handles contact form submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const message = document.getElementById('form-message').value;
        
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        try {
            // Save to Firestore
            await setDoc(doc(collection(db, "messages")), {
                name,
                email,
                message,
                timestamp: new Date()
            });
            
            alert('Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            console.error("Error sending message: ", error);
            alert('Error sending message. Please try again.');
        }
    });
}

/**
 * Mobile navigation functionality
 */
function initMobileNav() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Run functions based on the current page
document.addEventListener('DOMContentLoaded', () => {
    if (isHomePage) {
        loadHeroSection();
        loadProjects();
        loadAboutSection();
        loadSkills();
        loadEducation();
        loadExperience();
        loadFeaturedBlogs();
        loadContactInfo();
        loadContactDetails();
        initTypingAnimation();
        initContactForm();
        initMobileNav();
    } else if (isProjectPage) {
        loadProjectDetails();
    }
}); 