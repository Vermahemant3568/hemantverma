import { db } from './firebase-config.js';
import { doc, getDoc, collection, getDocs, query, where, limit } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Get project ID from URL
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

if (!projectId) {
    window.location.href = 'index.html#projects';
}

// Load project details
async function loadProjectDetails() {
    try {
        const docRef = doc(db, "projects", projectId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const project = docSnap.data();
            
            // Update page title
            document.title = `${project.title} - Project Details`;
            
            // Hero section
            document.getElementById('project-title').textContent = project.title;
            document.getElementById('project-subtitle').textContent = project.subtitle || project.description.substring(0, 100) + '...';
            
            // Tech stack in hero
            if (project.techStack) {
                const techHero = document.getElementById('project-tech-hero');
                const techBadges = project.techStack.split(',').map(tech => 
                    `<span class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">${tech.trim()}</span>`
                ).join('');
                techHero.innerHTML = techBadges;
            }
            
            // Project links
            const linksContainer = document.getElementById('project-links');
            let linksHTML = '';
            if (project.liveUrl) {
                linksHTML += `<a href="${project.liveUrl}" target="_blank" class="bg-white text-purple-600 hover:bg-purple-50 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"><i class="fas fa-external-link-alt mr-2"></i>Live Demo</a>`;
            }
            if (project.githubUrl) {
                linksHTML += `<a href="${project.githubUrl}" target="_blank" class="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 border border-white/30"><i class="fab fa-github mr-2"></i>View Code</a>`;
            }
            linksContainer.innerHTML = linksHTML;
            
            // Main image
            if (project.imageUrl) {
                document.getElementById('project-main-image').src = project.imageUrl;
            }
            
            // Gallery
            if (project.gallery && project.gallery.length > 0) {
                const galleryContainer = document.getElementById('project-gallery');
                const galleryHTML = project.gallery.map(img => 
                    `<img src="${img}" alt="Project Screenshot" class="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" onclick="changeMainImage('${img}')">`
                ).join('');
                galleryContainer.innerHTML = galleryHTML;
            }
            
            // Description
            document.getElementById('project-description').innerHTML = `<p>${project.fullDescription || project.description}</p>`;
            
            // Project details
            document.getElementById('project-duration').textContent = project.duration || 'Not specified';
            document.getElementById('project-role').textContent = project.role || 'Developer';
            document.getElementById('project-team').textContent = project.teamSize || '1';
            document.getElementById('project-status').textContent = project.status || 'Completed';
            
            // Features
            if (project.features && project.features.length > 0) {
                const featuresContainer = document.getElementById('project-features');
                const featuresHTML = project.features.map(feature => 
                    `<li class="flex items-start"><i class="fas fa-check text-green-300 mr-3 mt-1"></i><span>${feature}</span></li>`
                ).join('');
                featuresContainer.innerHTML = featuresHTML;
            }
            
            // Challenges
            if (project.challenges) {
                document.getElementById('project-challenges').innerHTML = `<p>${project.challenges}</p>`;
            }
            
            // Load related projects
            loadRelatedProjects(project.techStack);
            
        } else {
            window.location.href = 'index.html#projects';
        }
    } catch (error) {
        console.error("Error loading project details: ", error);
        window.location.href = 'index.html#projects';
    }
}

// Change main image when gallery image is clicked
window.changeMainImage = function(imageSrc) {
    document.getElementById('project-main-image').src = imageSrc;
}

// Load related projects
async function loadRelatedProjects(currentTechStack) {
    try {
        const projectsCollection = collection(db, 'projects');
        const querySnapshot = await getDocs(query(projectsCollection, limit(6)));
        
        let relatedHTML = '';
        let count = 0;
        
        querySnapshot.forEach((doc) => {
            if (doc.id !== projectId && count < 3) {
                const project = doc.data();
                relatedHTML += `
                    <a href="project.html?id=${doc.id}" class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 border border-purple-100">
                        <img src="${project.imageUrl || 'assets/images/placeholder.png'}" alt="${project.title}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300">
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2 text-purple-700">${project.title}</h3>
                            <p class="text-gray-600 text-sm">${project.description.substring(0, 80)}...</p>
                        </div>
                    </a>
                `;
                count++;
            }
        });
        
        if (relatedHTML) {
            document.getElementById('related-projects').innerHTML = relatedHTML;
        } else {
            document.getElementById('related-projects').innerHTML = '<p class="text-center text-gray-600 col-span-full">No related projects found.</p>';
        }
    } catch (error) {
        console.error("Error loading related projects: ", error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadProjectDetails();
});