import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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
    contentDiv.innerHTML = `Loading ${section}...`;
    let html = ``;

    if (section === 'about') {
        const docRef = doc(db, "portfolio", "about");
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : { title: '', description: '' };
        html = `
            <h2 class="text-2xl font-bold mb-4">Edit About Section</h2>
            <form id="about-form">
                <input type="text" id="about-title" placeholder="Title" value="${data.title}" class="w-full p-2 mb-4 border rounded">
                <textarea id="about-description" placeholder="Description" class="w-full p-2 mb-4 border rounded">${data.description}</textarea>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </form>
        `;
        contentDiv.innerHTML = html;
        document.getElementById('about-form').addEventListener('submit', async e => {
            e.preventDefault();
            const title = document.getElementById('about-title').value;
            const description = document.getElementById('about-description').value;
            await setDoc(doc(db, "portfolio", "about"), { title, description });
            alert('About section updated!');
        });
    } else if (section === 'projects') {
        const projectsCollection = collection(db, 'projects');
        const projectsSnapshot = await getDocs(projectsCollection);
        html = `<h2 class="text-2xl font-bold mb-4">Manage Projects</h2>`;
        
        projectsSnapshot.forEach(doc => {
            const project = doc.data();
            html += `
                <div class="bg-white p-4 rounded shadow mb-4">
                    <h3 class="font-bold">${project.title}</h3>
                    <p>${project.description}</p>
                    <button class="text-red-500" onclick="deleteProject('${doc.id}')">Delete</button>
                </div>
            `;
        });

        html += `
            <h3 class="text-xl font-bold mt-8 mb-4">Add New Project</h3>
            <form id="project-form">
                <input type="text" id="project-title" placeholder="Title" class="w-full p-2 mb-4 border rounded">
                <textarea id="project-description" placeholder="Description" class="w-full p-2 mb-4 border rounded"></textarea>
                <input type="text" id="project-image" placeholder="Image URL" class="w-full p-2 mb-4 border rounded">
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Add Project</button>
            </form>
        `;
        contentDiv.innerHTML = html;

        document.getElementById('project-form').addEventListener('submit', async e => {
            e.preventDefault();
            const title = document.getElementById('project-title').value;
            const description = document.getElementById('project-description').value;
            const imageUrl = document.getElementById('project-image').value;
            await setDoc(doc(collection(db, "projects")), { title, description, imageUrl });
            loadContent('projects');
        });
    }
    // Add other sections (skills, experience, etc.) here
}

window.deleteProject = async (id) => {
    if(confirm('Are you sure you want to delete this project?')) {
        await deleteDoc(doc(db, 'projects', id));
        loadContent('projects');
    }
} 