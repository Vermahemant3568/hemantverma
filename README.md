# Hemant Verma - Portfolio Website

## Public Pages Structure

### 🎯 Main Public Pages
- **Home Page** (`/` or `/index.html`) - Main portfolio landing page
  - Hero section with introduction
  - About section
  - Education section  
  - Experience section
  - Projects section
  - Skills section
  - Contact section

### 🔒 Protected Admin Pages
- **Admin Login** (`/admin/` or `/admin/index.html`) - Authentication required
- **Admin Dashboard** (`/admin/dashboard.html`) - Content management (Authentication required)

### 📁 Public Assets
- `/assets/css/` - Stylesheets
- `/assets/js/` - JavaScript files (except admin-specific)
- `/assets/images/` - Images and media files

### 🔧 Configuration Files
- `firebase.json` - Firebase hosting configuration
- `robots.txt` - Search engine guidance
- `sitemap.xml` - SEO sitemap for public pages

## 🚀 Deployment
This site is configured for Firebase Hosting with:
- Public pages accessible to everyone
- Admin pages protected behind authentication
- Proper caching headers for assets
- SEO optimization with sitemap and robots.txt

## 📝 Notes
- Replace `your-domain.com` in sitemap.xml and robots.txt with your actual domain
- Admin pages require Firebase Authentication
- All public content is served from the root directory