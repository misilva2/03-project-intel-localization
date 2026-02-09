// Theme switcher with manual override and system default detection
// Optimized for performance

// Check for saved theme preference or default to system
function getThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to the document - optimized to minimize reflows
function applyTheme(theme) {
  // Use requestAnimationFrame for smooth visual updates
  requestAnimationFrame(() => {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    
    // Update toggle button icon
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.textContent = isDark ? '☀️' : '🌙';
      toggleBtn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    }
  });
}

// Toggle theme manually
function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Save preference
  localStorage.setItem('theme', newTheme);
  
  // Apply new theme
  applyTheme(newTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const theme = getThemePreference();
  applyTheme(theme);
  
  // Add click event to toggle button
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
  
  // Add scroll to end functionality for desktop arrow button
  const scrollArrow = document.getElementById('scroll-arrow');
  if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
      const section = document.querySelector('section');
      if (section && window.innerWidth >= 1025) {
        section.scrollTo({
          left: section.scrollWidth,
          behavior: 'smooth'
        });
      }
    });
  }
  
  // Initialize scroll reveal for mobile and tablet
  initScrollReveal();
});

// Scroll reveal functionality for mobile and tablet views
function initScrollReveal() {
  // Only apply on mobile and tablet (not desktop)
  if (window.innerWidth < 1025) {
    const cards = document.querySelectorAll('section > div');
    
    // Intersection Observer options
    const observerOptions = {
      root: null, // viewport
      rootMargin: '-100px 0px', // Trigger slightly before card reaches center
      threshold: 0.3 // 30% of card must be visible
    };
    
    // Callback when card comes into view
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add 'in-view' class with slight delay for stagger effect
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, 100);
        } else {
          // Optional: remove class when scrolling away (for continuous animation)
          entry.target.classList.remove('in-view');
        }
      });
    };
    
    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all cards
    cards.forEach(card => {
      observer.observe(card);
    });
  }
  
  // Re-initialize on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reload page might be better, or just re-check width
      initScrollReveal();
    }, 250);
  });
}

// Listen for system theme changes (only if user hasn't set manual preference)
// Use debouncing to prevent excessive updates
let themeChangeTimeout;
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    clearTimeout(themeChangeTimeout);
    themeChangeTimeout = setTimeout(() => {
      applyTheme(e.matches ? 'dark' : 'light');
    }, 100);
  }
});
