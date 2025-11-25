# Olive & Oak Restaurant Website

A modern, responsive restaurant website built with HTML, TailwindCSS v4, and vanilla JavaScript. Features a single-page application (SPA) architecture with smooth transitions and interactive components.

## 🚀 Features

### Core Functionality

- **Single Page Application (SPA)** - Smooth client-side routing without page reloads
- **Responsive Design** - Optimized for all device sizes
- **Mobile-First Approach** - TailwindCSS v4 utility classes
- **Accessible** - Proper ARIA labels and semantic HTML

### Interactive Components

- **Mobile Navigation** - Hamburger menu with smooth animations
- **Contact Form** - Real-time validation and submission handling
- **Newsletter Sign-up** - Email validation and toast notifications
- **Toast System** - Custom notification system with swipe-to-dismiss
- **Back-to-Top Button** - Appears on scroll for easy navigation

### Performance Optimizations

- **Component Caching** - Templates are cached for faster navigation
- **Image Preloading** - Critical images are preloaded
- **Font Preloading** - Custom fonts are preloaded for better performance
- **Smooth Animations** - CSS transitions and animations

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: TailwindCSS v4
- **Icons**: Tabler Icons
- **Architecture**: Client-side SPA with custom router
- **Build Tool**: Vite

## 📁 Project Structure

```bash
project/
├─ src/
│  ├─ templates/
│  │  ├─ components/
│  │  │  └─ toast.html
│  │  ├─ 404.html
│  │  ├─ about.html
│  │  ├─ contact.html
│  │  ├─ home.html
│  │  └─ menu.html
│  ├─ main.js
│  └─ style.css
├─ index.html
├─ package.json
└─ README.md
```

## 🎯 Key Components

### Router

- Handles client-side navigation
- Manages page transitions
- Supports hash-based scrolling
- Caches templates for performance

### Form Handling

- Real-time validation for contact form
- Newsletter subscription
- Error states and success messages
- Accessible form controls

### Toast System

- Multiple types: success, error, info
- Auto-dismiss functionality
- Swipe-to-dismiss on mobile
- Smooth enter/exit animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd olive-oak-restaurant
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Customization

### Styling

The project uses TailwindCSS v4. Customize colors, spacing, and other design tokens in your Tailwind configuration.

### Content

- Update restaurant information in the respective HTML templates
- Modify contact details in the footer
- Add social media links in the footer

### Pages

- **Home**: Hero section and newsletter sign-up
- **Menu**: Restaurant menu items
- **About**: Restaurant story and team
- **Contact**: Contact form and location information

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Designed & Developed by [Amr Gobran](https://amrgobran.netlify.app/)

---

**Olive & Oak** - Experience a warm, inviting atmosphere and exquisite dishes crafted with passion and the freshest ingredients. Your table awaits.
