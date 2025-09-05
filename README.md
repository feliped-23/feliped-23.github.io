# Felipe Diaz - Personal Website

A modern, responsive personal website showcasing professional portfolio, research, and personal projects.

## 🏗️ Structure

```
├── src/                    # Source files (organized by type)
│   ├── css/               # Modular CSS files
│   │   ├── main.css       # Main import file
│   │   ├── variables.css  # CSS custom properties
│   │   ├── base.css       # Base styles & reset
│   │   ├── header.css     # Navigation & header
│   │   ├── footer.css     # Footer styles
│   │   ├── buttons.css    # Button components
│   │   ├── components.css # Reusable components
│   │   ├── hero.css       # Homepage hero section
│   │   ├── modal.css      # Modal component
│   │   ├── pages.css      # Page-specific styles
│   │   └── animations.css # Animations & effects
│   └── js/                # Modular JavaScript files
│       ├── main.js        # Main entry point
│       ├── utils.js       # Utility functions
│       ├── navigation.js  # Navigation component
│       ├── animations.js  # Scroll animations
│       ├── modals.js      # Modal functionality
│       ├── portfolio.js   # Portfolio view switcher
│       ├── blog.js        # Blog filters
│       └── contact.js     # Contact form handler
├── assets/                # Images, documents, and media
├── backup/                # Organized backup files
├── *.html                 # Main pages
└── README.md             # This file
```

## 🎨 Features

- **Responsive Design**: Works perfectly on all device sizes
- **Modern CSS**: Uses CSS custom properties and modern layout techniques
- **Modular Architecture**: CSS and JavaScript split into logical modules
- **Performance Optimized**: Efficient loading and minimal dependencies
- **Accessibility**: Semantic HTML and ARIA attributes
- **Dark/Light Mode**: Automatic theme switching based on user preference

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with custom properties, Grid, and Flexbox
- **JavaScript ES6+**: Modern JavaScript with modules
- **CSS Architecture**: Component-based organization
- **No Build Tools**: Runs directly in the browser

## 📱 Pages

1. **Home** (`index.html`) - Landing page with hero section and navigation panels
2. **About** (`about_me.html`) - Personal background and timeline
3. **Portfolio** (`resume.html`) - Professional experience with timeline/type views
4. **Research** (`blog.html`) - Blog posts with tag filtering
5. **Contact** (`contact.html`) - Contact form and social links

## 🚀 Development

The website uses a modular approach without build tools:

### CSS Organization

- Each component has its own CSS file
- Variables are centralized in `variables.css`
- Main.css imports all modules in the correct order

### JavaScript Organization

- ES6 modules with clear separation of concerns
- Each feature is self-contained and only runs when needed
- Utils provide shared functionality

### Asset Organization

- Original assets in `/assets/` folder
- Future organization planned with categorized subfolders

## 🎯 Best Practices Implemented

- **Separation of Concerns**: HTML, CSS, and JS are properly separated
- **Component Architecture**: Reusable components with consistent naming
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Semantic HTML**: Proper use of HTML5 semantic elements
- **CSS Custom Properties**: Consistent theming and easy maintenance
- **Mobile-First Design**: Responsive from the ground up
- **Performance**: Optimized images, efficient CSS, minimal JavaScript

## 📝 Notes

This website was built from scratch with minimal external dependencies, focusing on:

- Clean, maintainable code
- Modern web standards
- Excellent user experience
- Easy future maintenance and updates

## 🔧 Future Improvements

- [ ] Implement proper asset organization with categorized folders
- [ ] Add build process for optimization (optional)
- [ ] Implement proper blog content management
- [ ] Add PWA features
- [ ] Optimize images with modern formats (WebP, AVIF)

---

© 2025 Felipe Diaz. All rights reserved.
