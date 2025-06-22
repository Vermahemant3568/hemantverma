import { db } from './firebase-config.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const currentPage = window.location.pathname;

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
                <a href="project.html?id=${doc.id}" class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <img src="${project.imageUrl || 'assets/images/placeholder.png'}" alt="${project.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                        <p class="text-gray-600 text-sm">${project.description.substring(0, 100)}...</p>
                    </div>
                </a>
            `;
        });
        projectsGrid.innerHTML = projectsHTML;
    } catch (error) {
        console.error("Error loading projects: ", error);
        projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
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
            // Assuming the 'about' document has a 'description' field
            aboutContent.innerHTML = `<p>${data.description}</p>`;
            
            // Optional: Update hero bio if it's also in this document
            const heroBio = document.getElementById('hero-bio');
            if (heroBio && data.heroBio) {
                heroBio.textContent = data.heroBio;
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
                <div class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <i class="${skill.icon || 'fas fa-code'} text-4xl text-purple-600 mb-2"></i>
                    <p class="font-semibold">${skill.name}</p>
                </div>
            `;
        });
        skillsGrid.innerHTML = skillsHTML;
    } catch (error) {
        console.error("Error loading skills: ", error);
        skillsGrid.innerHTML = '<p>Could not load skills.</p>';
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

// Run functions based on the current page
document.addEventListener('DOMContentLoaded', () => {
    if (currentPage.includes('index.html') || currentPage === '/') {
        loadProjects();
        loadAboutSection();
        loadSkills();
    } else if (currentPage.includes('project.html')) {
        loadProjectDetails();
    }
}); 