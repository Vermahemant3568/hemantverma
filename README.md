# Personal Portfolio Website

A modern, responsive portfolio website with Firebase backend integration.

## 🚀 Features

### Public Website
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Content**: All content loaded from Firebase Firestore
- **Modern UI**: Clean design with smooth animations and transitions
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Fast Loading**: Optimized images and minimal JavaScript

### Admin Dashboard
- **Secure Authentication**: Firebase Auth protected admin panel
- **Content Management**: Full CRUD operations for all content
- **Real-time Updates**: Changes reflect immediately on the public site
- **User-friendly Interface**: Intuitive forms and management tools

## 📁 Project Structure

```
/
├── public/                 # Public website files
│   ├── index.html         # Homepage
│   ├── project.html       # Project details page
│   ├── blog.html          # Blog listing page
│   ├── blog-post.html     # Individual blog post page
│   └── assets/
│       ├── js/
│       │   ├── main.js           # Main website functionality
│       │   ├── blog.js           # Blog functionality
│       │   ├── blog-post.js      # Individual blog post
│       │   ├── firebase-config.js # Firebase configuration
│       │   ├── auth.js           # Authentication
│       │   └── dashboard.js      # Admin dashboard
│       └── images/        # Static images
├── admin/                 # Admin dashboard
│   ├── index.html        # Login page
│   └── dashboard.html    # Admin panel
├── firebase.json         # Firebase hosting config
└── .firebaserc          # Firebase project config
```

## 🔧 Setup Instructions

### 1. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Firebase Hosting
5. Update `firebase-config.js` with your config

### 2. Firestore Collections

Create these collections in your Firestore database:

#### `portfolio` collection:
- Document ID: `about`
  ```json
  {
    "title": "About Me",
    "description": "Your about description...",
    "heroBio": "Short bio for hero section"
  }
  ```
- Document ID: `contact`
  ```json
  {
    "email": "your@email.com",
    "socialLinks": [
      {
        "name": "GitHub",
        "url": "https://github.com/username",
        "icon": "fab fa-github"
      }
    ]
  }
  ```

#### `projects` collection:
```json
{
  "title": "Project Name",
  "description": "Project description...",
  "imageUrl": "https://example.com/image.jpg",
  "link": "https://project-url.com"
}
```

#### `skills` collection:
```json
{
  "name": "JavaScript",
  "icon": "fab fa-js-square"
}
```

#### `blogs` collection:
```json
{
  "title": "Blog Post Title",
  "excerpt": "Short excerpt...",
  "content": "Full blog content...",
  "publishedAt": "2024-01-01T00:00:00Z",
  "slug": "blog-post-title"
}
```

### 3. Deployment

#### GitHub Pages (Public Site):
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch

#### Firebase Hosting (Admin Dashboard):
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🎨 Customization

### Colors
The website uses a purple color scheme. To change:
- Update Tailwind classes: `purple-600`, `purple-700`, etc.
- Modify CSS custom properties if needed

### Fonts
Currently using:
- **Headings**: Poppins
- **Body**: Roboto

Update in the `<head>` section of HTML files.

### Content
All content is managed through the Firebase admin dashboard:
1. Login to `/admin/`
2. Navigate through different sections
3. Add/edit/delete content as needed

## 🔒 Security

- Admin dashboard protected by Firebase Authentication
- Firestore security rules should be configured
- Environment variables for sensitive data

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`
- Touch-friendly navigation
- Optimized images for different screen sizes

## 🚀 Performance

- Lazy loading for images
- Minimal JavaScript bundles
- CDN for external libraries
- Optimized Firebase queries

## 📞 Support

For issues or questions:
1. Check Firebase console for errors
2. Verify Firestore security rules
3. Test authentication flow
4. Check browser console for JavaScript errors

## 🔄 Updates

To update content:
1. Login to admin dashboard
2. Select the section to edit
3. Make changes and save
4. Changes appear immediately on the public site

---

Built with ❤️ using Firebase, Tailwind CSS, and modern web technologies.