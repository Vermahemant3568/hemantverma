import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Loading and error utilities
function showLoading(message = 'Loading...') {
    return `<div class="flex items-center justify-center p-8"><i class="fas fa-spinner fa-spin mr-2"></i>${message}</div>`;
}

function showError(message) {
    return `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"><i class="fas fa-exclamation-triangle mr-2"></i>${message}</div>`;
}

function showSuccess(message) {
    return `<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"><i class="fas fa-check-circle mr-2"></i>${message}</div>`;
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html';
    }
});

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Logout Error:', error);
    });
});

const contentDiv = document.getElementById('content');
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.hash.substring(1);
        loadContent(section);
    });
});

async function loadContent(section) {
    contentDiv.innerHTML = showLoading(`Loading ${section}...`);
    let html = ``;

    try {
        if (section === 'hero') {
            const docRef = doc(db, "portfolio", "hero");
            const docSnap = await getDoc(docRef);
            const data = docSnap.exists() ? docSnap.data() : {};
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Edit Hero Section</h2>
                    <form id="hero-form" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                            <input type="text" id="hero-name" placeholder="Your Full Name" value="${data.name || ''}" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                            <input type="text" id="hero-image" placeholder="assets/images/profile.jpg" value="${data.imageUrl || ''}" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <p class="text-xs text-gray-500 mt-1">Use local path: assets/images/filename.jpg</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Bio/Description *</label>
                            <textarea id="hero-bio" placeholder="Brief description about yourself..." rows="4" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">${data.bio || ''}</textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">CV/Resume URL</label>
                            <input type="text" id="hero-cv-url" placeholder="assets/cv/resume.pdf" value="${data.cvUrl || ''}" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <p class="text-xs text-gray-500 mt-1">Path to your CV/Resume file</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Social Links (JSON Format)</label>
                            <textarea id="hero-social" placeholder='[{"name": "GitHub", "url": "https://github.com/username", "icon": "fab fa-github"}]' rows="6" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm">${JSON.stringify(data.socialLinks || [], null, 2)}</textarea>
                            <p class="text-xs text-gray-500 mt-1">Format: [{"name": "Platform", "url": "https://...", "icon": "fab fa-icon"}]</p>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                            <i class="fas fa-save mr-2"></i>Save Hero Section
                        </button>
                    </form>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('hero-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
                submitBtn.disabled = true;
                
                try {
                    const name = document.getElementById('hero-name').value.trim();
                    const bio = document.getElementById('hero-bio').value.trim();
                    
                    if (!name || !bio) {
                        throw new Error('Name and bio are required');
                    }
                    
                    const socialLinksText = document.getElementById('hero-social').value.trim();
                    let socialLinks = [];
                    
                    if (socialLinksText) {
                        try {
                            socialLinks = JSON.parse(socialLinksText);
                        } catch {
                            throw new Error('Invalid JSON format for social links');
                        }
                    }
                    
                    const heroData = {
                        name,
                        bio,
                        imageUrl: document.getElementById('hero-image').value.trim(),
                        cvUrl: document.getElementById('hero-cv-url').value.trim(),
                        socialLinks
                    };
                    
                    await setDoc(doc(db, "portfolio", "hero"), heroData);
                    contentDiv.insertAdjacentHTML('afterbegin', showSuccess('Hero section updated successfully!'));
                    setTimeout(() => document.querySelector('.bg-green-100')?.remove(), 3000);
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                } finally {
                    submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Save Hero Section';
                    submitBtn.disabled = false;
                }
            });
            
        } else if (section === 'about') {
            const docRef = doc(db, "portfolio", "about");
            const docSnap = await getDoc(docRef);
            const data = docSnap.exists() ? docSnap.data() : {};
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Edit About Section</h2>
                    <form id="about-form" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input type="text" id="about-title" placeholder="About Me Title" value="${data.title || ''}" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea id="about-description" placeholder="Tell your story..." rows="6" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">${data.description || ''}</textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Hero Bio</label>
                            <textarea id="about-hero-bio" placeholder="Short bio for hero section..." rows="3" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">${data.heroBio || ''}</textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">About Image URL</label>
                            <input type="url" id="about-image" placeholder="https://example.com/image.jpg" value="${data.imageUrl || ''}" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input type="text" id="about-location" placeholder="City, Country" value="${data.facts?.location || ''}" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                                <input type="text" id="about-experience" placeholder="5+ years" value="${data.facts?.experience || ''}" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Education</label>
                                <input type="text" id="about-education" placeholder="Bachelor's Degree" value="${data.facts?.education || ''}" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                                <input type="text" id="about-interests" placeholder="Coding, Design, Music" value="${data.facts?.interests || ''}" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                            <i class="fas fa-save mr-2"></i>Save About Section
                        </button>
                    </form>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('about-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
                submitBtn.disabled = true;
                
                try {
                    const description = document.getElementById('about-description').value.trim();
                    if (!description) {
                        throw new Error('Description is required');
                    }
                    
                    const aboutData = {
                        title: document.getElementById('about-title').value.trim(),
                        description,
                        heroBio: document.getElementById('about-hero-bio').value.trim(),
                        imageUrl: document.getElementById('about-image').value.trim(),
                        facts: {
                            location: document.getElementById('about-location').value.trim(),
                            experience: document.getElementById('about-experience').value.trim(),
                            education: document.getElementById('about-education').value.trim(),
                            interests: document.getElementById('about-interests').value.trim()
                        }
                    };
                    
                    await setDoc(doc(db, "portfolio", "about"), aboutData);
                    contentDiv.insertAdjacentHTML('afterbegin', showSuccess('About section updated successfully!'));
                    setTimeout(() => document.querySelector('.bg-green-100')?.remove(), 3000);
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                } finally {
                    submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Save About Section';
                    submitBtn.disabled = false;
                }
            });
            
        } else if (section === 'skills') {
            const skillsCollection = collection(db, 'skills');
            const skillsSnapshot = await getDocs(skillsCollection);
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Skills</h2>
                    <div class="grid gap-4 mb-8">
            `;
            
            skillsSnapshot.forEach(doc => {
                const skill = doc.data();
                html += `
                    <div class="bg-gray-50 p-4 rounded-lg border">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <i class="${skill.icon || 'fas fa-code'} text-2xl text-blue-600 mr-3"></i>
                                    <h3 class="font-bold text-lg">${skill.name}</h3>
                                </div>
                                ${skill.level ? `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">${skill.level}</span>` : ''}
                                ${skill.description ? `<p class="text-sm text-gray-600">${skill.description}</p>` : ''}
                            </div>
                            <button class="text-red-500 hover:text-red-700 p-2" onclick="deleteSkill('${doc.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-xl font-bold mb-4">Add New Skill</h3>
                        <form id="skill-form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
                                    <input type="text" id="skill-name" placeholder="JavaScript" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Font Awesome Icon *</label>
                                    <input type="text" id="skill-icon" placeholder="fab fa-js-square" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                                <select id="skill-level" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea id="skill-description" placeholder="Brief description of your experience with this skill..." rows="3" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                <i class="fas fa-plus mr-2"></i>Add Skill
                            </button>
                        </form>
                    </div>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('skill-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding...';
                submitBtn.disabled = true;
                
                try {
                    const name = document.getElementById('skill-name').value.trim();
                    const icon = document.getElementById('skill-icon').value.trim();
                    
                    if (!name || !icon) {
                        throw new Error('Skill name and icon are required');
                    }
                    
                    const skillData = { name, icon };
                    const level = document.getElementById('skill-level').value;
                    const description = document.getElementById('skill-description').value.trim();
                    
                    if (level) skillData.level = level;
                    if (description) skillData.description = description;
                    
                    await setDoc(doc(collection(db, "skills")), skillData);
                    loadContent('skills');
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                    submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Skill';
                    submitBtn.disabled = false;
                }
            });
            
        } else if (section === 'projects') {
            const projectsCollection = collection(db, 'projects');
            const projectsSnapshot = await getDocs(projectsCollection);
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Projects</h2>
                    <div class="grid gap-4 mb-8">
            `;
            
            projectsSnapshot.forEach(doc => {
                const project = doc.data();
                html += `
                    <div class="bg-gray-50 p-4 rounded-lg border">
                        <div class="flex gap-4">
                            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="w-20 h-20 object-cover rounded">` : '<div class="w-20 h-20 bg-gray-200 rounded flex items-center justify-center"><i class="fas fa-image text-gray-400"></i></div>'}
                            <div class="flex-1">
                                <h3 class="font-bold text-lg mb-1">${project.title}</h3>
                                <p class="text-sm text-gray-600 mb-2">${project.description.substring(0, 100)}...</p>
                                ${project.techStack ? `<div class="flex flex-wrap gap-1 mb-2">${project.techStack.split(',').map(tech => `<span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">${tech.trim()}</span>`).join('')}</div>` : ''}
                                <div class="flex space-x-2">
                                    ${project.link ? `<a href="${project.link}" target="_blank" class="text-blue-500 hover:text-blue-700 text-sm"><i class="fas fa-external-link-alt mr-1"></i>View</a>` : ''}
                                    <button class="text-red-500 hover:text-red-700 text-sm" onclick="deleteProject('${doc.id}')">
                                        <i class="fas fa-trash mr-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-xl font-bold mb-4">Add New Project</h3>
                        <form id="project-form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                                    <input type="text" id="project-title" placeholder="My Awesome Project" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                                    <input type="text" id="project-subtitle" placeholder="Brief project tagline" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                                <textarea id="project-description" placeholder="Brief description for project cards..." rows="3" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                                <textarea id="project-full-description" placeholder="Detailed project description..." rows="6" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                                <input type="text" id="project-tech" placeholder="React, Node.js, MongoDB, Tailwind CSS" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <p class="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Main Image Path</label>
                                    <input type="text" id="project-image" placeholder="assets/images/project1.jpg" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <p class="text-xs text-gray-500 mt-1">Use local path: assets/images/filename.jpg</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                    <input type="text" id="project-gallery" placeholder="image1.jpg, image2.jpg, image3.jpg" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <p class="text-xs text-gray-500 mt-1">Separate image paths with commas</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Live Project URL</label>
                                    <input type="url" id="project-live-url" placeholder="https://myproject.com" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                                    <input type="url" id="project-github-url" placeholder="https://github.com/username/repo" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                            <div class="grid grid-cols-4 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                    <input type="text" id="project-duration" placeholder="3 months" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <input type="text" id="project-role" placeholder="Full Stack Developer" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                                    <input type="text" id="project-team" placeholder="3 members" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select id="project-status" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="Completed">Completed</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                                <textarea id="project-features" placeholder="Feature 1, Feature 2, Feature 3" rows="3" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                                <p class="text-xs text-gray-500 mt-1">Separate features with commas</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Challenges & Solutions</label>
                                <textarea id="project-challenges" placeholder="Describe challenges faced and how you solved them..." rows="4" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                <i class="fas fa-plus mr-2"></i>Add Project
                            </button>
                        </form>
                    </div>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('project-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding...';
                submitBtn.disabled = true;
                
                try {
                    const title = document.getElementById('project-title').value.trim();
                    const description = document.getElementById('project-description').value.trim();
                    
                    if (!title || !description) {
                        throw new Error('Title and description are required');
                    }
                    
                    const galleryText = document.getElementById('project-gallery').value.trim();
                    const featuresText = document.getElementById('project-features').value.trim();
                    
                    const projectData = {
                        title,
                        subtitle: document.getElementById('project-subtitle').value.trim(),
                        description,
                        fullDescription: document.getElementById('project-full-description').value.trim(),
                        imageUrl: document.getElementById('project-image').value.trim(),
                        gallery: galleryText ? galleryText.split(',').map(img => img.trim()) : [],
                        liveUrl: document.getElementById('project-live-url').value.trim(),
                        githubUrl: document.getElementById('project-github-url').value.trim(),
                        techStack: document.getElementById('project-tech').value.trim(),
                        duration: document.getElementById('project-duration').value.trim(),
                        role: document.getElementById('project-role').value.trim(),
                        teamSize: document.getElementById('project-team').value.trim(),
                        status: document.getElementById('project-status').value,
                        features: featuresText ? featuresText.split(',').map(f => f.trim()) : [],
                        challenges: document.getElementById('project-challenges').value.trim()
                    };
                    
                    await setDoc(doc(collection(db, "projects")), projectData);
                    loadContent('projects');
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                    submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Project';
                    submitBtn.disabled = false;
                }
            });
            
        } else if (section === 'experience') {
            const docRef = doc(db, "portfolio", "experience");
            const docSnap = await getDoc(docRef);
            const data = docSnap.exists() ? docSnap.data() : { experiences: [] };
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Experience</h2>
                    <div class="space-y-4 mb-8">
            `;
            
            if (data.experiences && data.experiences.length > 0) {
                data.experiences.forEach((exp, index) => {
                    html += `
                        <div class="bg-gray-50 p-4 rounded-lg border">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <h3 class="font-bold text-lg">${exp.position}</h3>
                                    <p class="text-blue-600 font-medium">${exp.company}</p>
                                    <p class="text-sm text-gray-500 mb-2">${exp.duration}</p>
                                    ${exp.description ? `<p class="text-sm text-gray-600">${exp.description}</p>` : ''}
                                </div>
                                <div class="flex space-x-2">
                                    <button class="text-blue-500 hover:text-blue-700 p-2" onclick="editExperience(${index})">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="text-red-500 hover:text-red-700 p-2" onclick="deleteExperience(${index})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<p class="text-gray-500 text-center py-8">No experience entries yet. Add your first one below!</p>';
            }
            
            html += `
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-xl font-bold mb-4">Add New Experience</h3>
                        <form id="experience-form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Position/Job Title *</label>
                                    <input type="text" id="exp-position" placeholder="Frontend Developer" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                                    <input type="text" id="exp-company" placeholder="Tech Company Inc." 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                                <input type="text" id="exp-duration" placeholder="Jan 2022 - Present" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                                <textarea id="exp-description" placeholder="Describe your role and achievements..." rows="4" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                <i class="fas fa-plus mr-2"></i>Add Experience
                            </button>
                        </form>
                    </div>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('experience-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding...';
                submitBtn.disabled = true;
                
                try {
                    const position = document.getElementById('exp-position').value.trim();
                    const company = document.getElementById('exp-company').value.trim();
                    const duration = document.getElementById('exp-duration').value.trim();
                    
                    if (!position || !company || !duration) {
                        throw new Error('Position, company, and duration are required');
                    }
                    
                    const experienceData = { position, company, duration };
                    const description = document.getElementById('exp-description').value.trim();
                    if (description) experienceData.description = description;
                    
                    let updatedExperiences;
                    const editIndex = e.target.dataset.editIndex;
                    
                    if (editIndex !== undefined) {
                        updatedExperiences = [...(data.experiences || [])];
                        updatedExperiences[parseInt(editIndex)] = experienceData;
                        delete e.target.dataset.editIndex;
                        submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Experience';
                    } else {
                        updatedExperiences = [...(data.experiences || []), experienceData];
                    }
                    
                    await setDoc(doc(db, "portfolio", "experience"), { experiences: updatedExperiences });
                    loadContent('experience');
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                    submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Experience';
                    submitBtn.disabled = false;
                }
            });
            
        } else if (section === 'education') {
            const docRef = doc(db, "portfolio", "education");
            const docSnap = await getDoc(docRef);
            const data = docSnap.exists() ? docSnap.data() : { education: [] };
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Education</h2>
                    <div class="space-y-4 mb-8">
            `;
            
            if (data.education && data.education.length > 0) {
                data.education.forEach((edu, index) => {
                    html += `
                        <div class="bg-gray-50 p-4 rounded-lg border">
                            <div class="flex justify-between items-start">
                                <div class="flex-1 pr-4">
                                    <h3 class="font-bold text-lg">${edu.degree}</h3>
                                    <p class="text-blue-600 font-medium">${edu.institution}</p>
                                    <p class="text-sm text-gray-500 mb-2">${edu.year}</p>
                                    ${edu.description ? `<p class="text-justify text-sm text-white-600">${edu.description}</p>` : ''}
                                </div>
                                <div class="flex space-x-2 flex-shrink-0">
                                    <button class="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors" onclick="editEducation(${index})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" onclick="deleteEducation(${index})" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<p class="text-gray-500 text-center py-8">No education entries yet. Add your first one below!</p>';
            }
            
            html += `
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-xl font-bold mb-4">Add New Education</h3>
                        <form id="education-form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Degree/Course *</label>
                                    <input type="text" id="edu-degree" placeholder="Bachelor of Computer Science" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Institution/University *</label>
                                    <input type="text" id="edu-institution" placeholder="University Name" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Year/Duration *</label>
                                <input type="text" id="edu-year" placeholder="2020-2024" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea id="edu-description" placeholder="Relevant coursework, achievements, etc..." rows="3" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                <i class="fas fa-plus mr-2"></i>Add Education
                            </button>
                        </form>
                    </div>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('education-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding...';
                submitBtn.disabled = true;
                
                try {
                    const degree = document.getElementById('edu-degree').value.trim();
                    const institution = document.getElementById('edu-institution').value.trim();
                    const year = document.getElementById('edu-year').value.trim();
                    
                    if (!degree || !institution || !year) {
                        throw new Error('Degree, institution, and year are required');
                    }
                    
                    const educationData = { degree, institution, year };
                    const description = document.getElementById('edu-description').value.trim();
                    if (description) educationData.description = description;
                    
                    let updatedEducation;
                    const editIndex = e.target.dataset.editIndex;
                    
                    if (editIndex !== undefined) {
                        updatedEducation = [...(data.education || [])];
                        updatedEducation[parseInt(editIndex)] = educationData;
                        delete e.target.dataset.editIndex;
                        submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Education';
                    } else {
                        updatedEducation = [...(data.education || []), educationData];
                    }
                    
                    await setDoc(doc(db, "portfolio", "education"), { education: updatedEducation });
                    loadContent('education');
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                    submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Education';
                    submitBtn.disabled = false;
                }
            });
            
        } else if (section === 'awards') {
            const docRef = doc(db, "portfolio", "awards");
            const docSnap = await getDoc(docRef);
            const data = docSnap.exists() ? docSnap.data() : { awards: [] };
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Awards & Certificates</h2>
                    <div class="space-y-4 mb-8">
            `;
            
            if (data.awards && data.awards.length > 0) {
                data.awards.forEach((award, index) => {
                    html += `
                        <div class="bg-gray-50 p-4 rounded-lg border">
                            <div class="flex justify-between items-start">
                                <div class="flex-1 pr-4">
                                    <h3 class="font-bold text-lg">${award.title}</h3>
                                    <p class="text-blue-600 font-medium">${award.issuer}</p>
                                    <p class="text-sm text-gray-500 mb-2">${award.date}</p>
                                    ${award.description ? `<p class="text-sm text-gray-600">${award.description}</p>` : ''}
                                    ${award.credentialUrl ? `<a href="${award.credentialUrl}" target="_blank" class="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"><i class="fas fa-external-link-alt mr-1"></i>View Certificate</a>` : ''}
                                </div>
                                <div class="flex space-x-2 flex-shrink-0">
                                    <button class="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors" onclick="editAward(${index})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" onclick="deleteAward(${index})" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<p class="text-gray-500 text-center py-8">No awards or certificates yet. Add your first one below!</p>';
            }
            
            html += `
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-xl font-bold mb-4">Add New Award/Certificate</h3>
                        <form id="award-form" class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Award/Certificate Title *</label>
                                    <input type="text" id="award-title" placeholder="AWS Certified Developer" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Issuing Organization *</label>
                                    <input type="text" id="award-issuer" placeholder="Amazon Web Services" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Date Received *</label>
                                    <input type="text" id="award-date" placeholder="March 2024" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Credential URL</label>
                                    <input type="url" id="award-url" placeholder="https://credential-url.com" 
                                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea id="award-description" placeholder="Brief description of the award or certificate..." rows="3" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                <i class="fas fa-plus mr-2"></i>Add Award/Certificate
                            </button>
                        </form>
                    </div>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('award-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Adding...';
                submitBtn.disabled = true;
                
                try {
                    const title = document.getElementById('award-title').value.trim();
                    const issuer = document.getElementById('award-issuer').value.trim();
                    const date = document.getElementById('award-date').value.trim();
                    
                    if (!title || !issuer || !date) {
                        throw new Error('Title, issuer, and date are required');
                    }
                    
                    const awardData = { title, issuer, date };
                    const description = document.getElementById('award-description').value.trim();
                    const credentialUrl = document.getElementById('award-url').value.trim();
                    
                    if (description) awardData.description = description;
                    if (credentialUrl) awardData.credentialUrl = credentialUrl;
                    
                    let updatedAwards;
                    const editIndex = e.target.dataset.editIndex;
                    
                    if (editIndex !== undefined) {
                        updatedAwards = [...(data.awards || [])];
                        updatedAwards[parseInt(editIndex)] = awardData;
                        delete e.target.dataset.editIndex;
                        submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Award/Certificate';
                    } else {
                        updatedAwards = [...(data.awards || []), awardData];
                    }
                    
                    await setDoc(doc(db, "portfolio", "awards"), { awards: updatedAwards });
                    loadContent('awards');
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                    submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Add Award/Certificate';
                    submitBtn.disabled = false;
                }
            });
            
        } else if (section === 'blog') {
            const blogsCollection = collection(db, 'blogs');
            const blogsSnapshot = await getDocs(blogsCollection);
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Blog Posts</h2>
                    <div class="space-y-4 mb-8">
            `;
            
            blogsSnapshot.forEach(doc => {
                const blog = doc.data();
                const publishedDate = blog.publishedAt ? new Date(blog.publishedAt.seconds * 1000).toLocaleDateString() : 'Draft';
                html += `
                    <div class="bg-gray-50 p-4 rounded-lg border">
                        <div class="flex gap-4">
                            ${blog.imageUrl ? `<img src="${blog.imageUrl}" alt="${blog.title}" class="w-20 h-20 object-cover rounded">` : '<div class="w-20 h-20 bg-gray-200 rounded flex items-center justify-center"><i class="fas fa-image text-gray-400"></i></div>'}
                            <div class="flex-1">
                                <h3 class="font-bold text-lg mb-1">${blog.title}</h3>
                                <p class="text-sm text-gray-500 mb-2">Published: ${publishedDate}</p>
                                <p class="text-sm text-gray-600 mb-2">${blog.excerpt || blog.content.substring(0, 100)}...</p>
                                <button class="text-red-500 hover:text-red-700 text-sm" onclick="deleteBlog('${doc.id}')">
                                    <i class="fas fa-trash mr-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                    <div class="border-t pt-6">
                        <h3 class="text-xl font-bold mb-4">Add New Blog Post</h3>
                        <form id="blog-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Blog Title *</label>
                                <input type="text" id="blog-title" placeholder="My Awesome Blog Post" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                                <textarea id="blog-excerpt" placeholder="Brief summary of your blog post..." rows="3" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                                <textarea id="blog-content" placeholder="Write your blog content here..." rows="8" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                                <input type="url" id="blog-image" placeholder="https://example.com/image.jpg" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                <i class="fas fa-plus mr-2"></i>Publish Blog Post
                            </button>
                        </form>
                    </div>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('blog-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Publishing...';
                submitBtn.disabled = true;
                
                try {
                    const title = document.getElementById('blog-title').value.trim();
                    const content = document.getElementById('blog-content').value.trim();
                    
                    if (!title || !content) {
                        throw new Error('Title and content are required');
                    }
                    
                    const blogData = {
                        title,
                        content,
                        excerpt: document.getElementById('blog-excerpt').value.trim(),
                        imageUrl: document.getElementById('blog-image').value.trim(),
                        publishedAt: new Date(),
                        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    };
                    
                    await setDoc(doc(collection(db, "blogs")), blogData);
                    loadContent('blog');
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                    submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Publish Blog Post';
                    submitBtn.disabled = false;
                }
            });
            
        } else if (section === 'contact') {
            const docRef = doc(db, "portfolio", "contact");
            const docSnap = await getDoc(docRef);
            const data = docSnap.exists() ? docSnap.data() : {};
            
            html = `
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Contact Information</h2>
                    <form id="contact-form" class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                <input type="email" id="contact-email-input" placeholder="your@email.com" value="${data.email || ''}" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" id="contact-phone-input" placeholder="+1 (555) 123-4567" value="${data.phone || ''}" 
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input type="text" id="contact-location-input" placeholder="City, Country" value="${data.location || ''}" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Social Links (JSON Format)</label>
                            <textarea id="social-links-data" placeholder='[{"name": "GitHub", "url": "https://github.com/username", "icon": "fab fa-github"}]' rows="6" 
                                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm">${JSON.stringify(data.socialLinks || [], null, 2)}</textarea>
                            <p class="text-xs text-gray-500 mt-1">Format: [{"name": "Platform", "url": "https://...", "icon": "fab fa-icon"}]</p>
                        </div>
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                            <i class="fas fa-save mr-2"></i>Save Contact Information
                        </button>
                    </form>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            document.getElementById('contact-form').addEventListener('submit', async e => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
                submitBtn.disabled = true;
                
                try {
                    const email = document.getElementById('contact-email-input').value.trim();
                    if (!email) {
                        throw new Error('Email address is required');
                    }
                    
                    const socialLinksText = document.getElementById('social-links-data').value.trim();
                    let socialLinks = [];
                    
                    if (socialLinksText) {
                        try {
                            socialLinks = JSON.parse(socialLinksText);
                        } catch {
                            throw new Error('Invalid JSON format for social links');
                        }
                    }
                    
                    const contactData = {
                        email,
                        phone: document.getElementById('contact-phone-input').value.trim(),
                        location: document.getElementById('contact-location-input').value.trim(),
                        socialLinks
                    };
                    
                    await setDoc(doc(db, "portfolio", "contact"), contactData);
                    contentDiv.insertAdjacentHTML('afterbegin', showSuccess('Contact information updated successfully!'));
                    setTimeout(() => document.querySelector('.bg-green-100')?.remove(), 3000);
                } catch (error) {
                    contentDiv.insertAdjacentHTML('afterbegin', showError(error.message));
                } finally {
                    submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Save Contact Information';
                    submitBtn.disabled = false;
                }
            });
        }
        
    } catch (error) {
        console.error(`Error loading ${section}:`, error);
        contentDiv.innerHTML = showError(`Failed to load ${section}. Please try again.`);
    }
}

// Delete functions
window.deleteProject = async (id) => {
    if(confirm('Are you sure you want to delete this project?')) {
        try {
            await deleteDoc(doc(db, 'projects', id));
            loadContent('projects');
        } catch (error) {
            alert('Error deleting project: ' + error.message);
        }
    }
}

window.deleteSkill = async (id) => {
    if(confirm('Are you sure you want to delete this skill?')) {
        try {
            await deleteDoc(doc(db, 'skills', id));
            loadContent('skills');
        } catch (error) {
            alert('Error deleting skill: ' + error.message);
        }
    }
}

window.deleteBlog = async (id) => {
    if(confirm('Are you sure you want to delete this blog post?')) {
        try {
            await deleteDoc(doc(db, 'blogs', id));
            loadContent('blog');
        } catch (error) {
            alert('Error deleting blog post: ' + error.message);
        }
    }
}

window.deleteEducation = async (index) => {
    if(confirm('Are you sure you want to delete this education entry?')) {
        try {
            const docRef = doc(db, "portfolio", "education");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const updatedEducation = data.education.filter((_, i) => i !== index);
                await setDoc(doc(db, "portfolio", "education"), { education: updatedEducation });
                loadContent('education');
            }
        } catch (error) {
            alert('Error deleting education entry: ' + error.message);
        }
    }
}

window.deleteExperience = async (index) => {
    if(confirm('Are you sure you want to delete this experience entry?')) {
        try {
            const docRef = doc(db, "portfolio", "experience");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const updatedExperiences = data.experiences.filter((_, i) => i !== index);
                await setDoc(doc(db, "portfolio", "experience"), { experiences: updatedExperiences });
                loadContent('experience');
            }
        } catch (error) {
            alert('Error deleting experience entry: ' + error.message);
        }
    }
}

window.editEducation = async (index) => {
    try {
        const docRef = doc(db, "portfolio", "education");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const edu = data.education[index];
            
            document.getElementById('edu-degree').value = edu.degree;
            document.getElementById('edu-institution').value = edu.institution;
            document.getElementById('edu-year').value = edu.year;
            document.getElementById('edu-description').value = edu.description || '';
            
            const form = document.getElementById('education-form');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Update Education';
            form.dataset.editIndex = index;
        }
    } catch (error) {
        alert('Error loading education entry: ' + error.message);
    }
}

window.editExperience = async (index) => {
    try {
        const docRef = doc(db, "portfolio", "experience");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const exp = data.experiences[index];
            
            document.getElementById('exp-position').value = exp.position;
            document.getElementById('exp-company').value = exp.company;
            document.getElementById('exp-duration').value = exp.duration;
            document.getElementById('exp-description').value = exp.description || '';
            
            const form = document.getElementById('experience-form');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Update Experience';
            form.dataset.editIndex = index;
        }
    } catch (error) {
        alert('Error loading experience entry: ' + error.message);
    }
}

window.deleteAward = async (index) => {
    if(confirm('Are you sure you want to delete this award/certificate?')) {
        try {
            const docRef = doc(db, "portfolio", "awards");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const updatedAwards = data.awards.filter((_, i) => i !== index);
                await setDoc(doc(db, "portfolio", "awards"), { awards: updatedAwards });
                loadContent('awards');
            }
        } catch (error) {
            alert('Error deleting award: ' + error.message);
        }
    }
}

window.editAward = async (index) => {
    try {
        const docRef = doc(db, "portfolio", "awards");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const award = data.awards[index];
            
            document.getElementById('award-title').value = award.title;
            document.getElementById('award-issuer').value = award.issuer;
            document.getElementById('award-date').value = award.date;
            document.getElementById('award-description').value = award.description || '';
            document.getElementById('award-url').value = award.credentialUrl || '';
            
            const form = document.getElementById('award-form');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Update Award/Certificate';
            form.dataset.editIndex = index;
        }
    } catch (error) {
        alert('Error loading award entry: ' + error.message);
    }
}