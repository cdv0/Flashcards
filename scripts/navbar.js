// scripts/navbar.js

document.addEventListener('DOMContentLoaded', () => {
  const navbarRoot = document.getElementById('navbar-root');
  if (!navbarRoot) return;

  // Figure out the current page file name, e.g. "home.html"
  const pathParts = window.location.pathname.split('/');
  const currentPage = pathParts[pathParts.length - 1] || 'home.html';

  fetch('navbar.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load navbar.html: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Inject the navbar markup
      navbarRoot.innerHTML = html;

      // Highlight "Your Flashcards" button when on home.html
      const flashcardsBtn = navbarRoot.querySelector('.nav-btn');
      if (flashcardsBtn && currentPage === 'home.html') {
        flashcardsBtn.classList.add('active-nav-btn');
      }

      const navSearchInput = navbarRoot.querySelector('.nav-search');
      if (navSearchInput) {
        navSearchInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            const value = navSearchInput.value.trim();
            const pageSearch = document.getElementById('searchInput');
            if (pageSearch) {
              pageSearch.value = value;
              // Trigger an input event so any listeners can react
              pageSearch.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        });
      }
    })
    .catch(err => {
      console.error('Error loading navbar:', err);
    });
});
