import { db } from './firebase-config.js';
import { collection, getDocs, doc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

/**
 * Loads all blog posts from Firebase
 */
async function loadBlogPosts() {
    const blogPostsContainer = document.getElementById('blog-posts');
    if (!blogPostsContainer) return;

    try {
        const q = query(collection(db, "blogs"), orderBy("publishedAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            blogPostsContainer.innerHTML = '<p class="text-center text-gray-600">No blog posts available yet.</p>';
            return;
        }

        let blogHTML = '';
        querySnapshot.forEach((doc) => {
            const blog = doc.data();
            const publishedDate = blog.publishedAt ? new Date(blog.publishedAt.seconds * 1000).toLocaleDateString() : 'Draft';
            
            blogHTML += `
                <article class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <h2 class="text-2xl font-bold mb-3 text-gray-900">${blog.title}</h2>
                    <p class="text-sm text-gray-500 mb-4">Published on ${publishedDate}</p>
                    <p class="text-gray-700 mb-4">${blog.excerpt || blog.content.substring(0, 200)}...</p>
                    <a href="blog-post.html?id=${doc.id}" class="text-purple-600 hover:text-purple-800 font-semibold">Read More →</a>
                </article>
            `;
        });
        
        blogPostsContainer.innerHTML = blogHTML;
    } catch (error) {
        console.error("Error loading blog posts: ", error);
        blogPostsContainer.innerHTML = '<p class="text-center text-red-600">Error loading blog posts. Please try again later.</p>';
    }
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

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    initMobileNav();
});