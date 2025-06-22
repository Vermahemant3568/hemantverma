import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

/**
 * Loads a single blog post from Firebase based on URL parameter
 */
async function loadBlogPost() {
    const blogPostContent = document.getElementById('blog-post-content');
    if (!blogPostContent) return;

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        blogPostContent.innerHTML = '<p class="text-center">Blog post ID not found.</p>';
        return;
    }

    try {
        const docRef = doc(db, "blogs", postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const blog = docSnap.data();
            const publishedDate = blog.publishedAt ? new Date(blog.publishedAt.seconds * 1000).toLocaleDateString() : 'Draft';
            
            // Update page title
            document.title = `${blog.title} | Hemant Verma`;
            
            blogPostContent.innerHTML = `
                <article class="prose max-w-none">
                    <h1 class="text-4xl font-bold text-gray-900 mb-4">${blog.title}</h1>
                    <p class="text-gray-500 mb-8">Published on ${publishedDate}</p>
                    <div class="text-gray-700 leading-relaxed whitespace-pre-line">
                        ${blog.content}
                    </div>
                </article>
                <div class="mt-8 pt-8 border-t">
                    <a href="blog.html" class="text-purple-600 hover:text-purple-800 font-semibold">← Back to Blog</a>
                </div>
            `;
        } else {
            blogPostContent.innerHTML = '<p class="text-center">Blog post not found.</p>';
        }
    } catch (error) {
        console.error("Error loading blog post: ", error);
        blogPostContent.innerHTML = '<p class="text-center text-red-600">Error loading blog post. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPost();
});