
import { getSections, syncSectionsFromDOM, refreshSectionSelect } from './state.js';
import { moveCardToSection } from './sections.js';
import { openEditSetModal } from './createSetModal.js';

let sectionMenu = null;
let currentSection = null;
let cardMenu = null;
let currentCard = null;

export function setupSectionAndCardMenus() {
  document.addEventListener('click', event => {
    const sectionBtn = event.target.closest('.section-menu-btn');
    const cardBtn = event.target.closest('.card-menu-btn');

    if (sectionBtn) {
      event.stopPropagation();
      const section = sectionBtn.closest('.flashcard-section');
      toggleSectionMenu(sectionBtn, section);
      return;
    }

    if (cardBtn) {
      event.stopPropagation();
      const card = cardBtn.closest('.flashcard-card');
      toggleCardMenu(cardBtn, card);
      return;
    }

    if (sectionMenu && !sectionMenu.classList.contains('is-hidden') && sectionMenu.contains(event.target)) {
      const btn = event.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'rename-section') renameSection();
      if (action === 'delete-section') deleteSection();
      hideMenus();
      return;
    }

    if (cardMenu && !cardMenu.classList.contains('is-hidden') && cardMenu.contains(event.target)) {
      const btn = event.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'change-section') changeSetSection();
      if (action === 'rename-set') renameSet();
      if (action === 'edit-set') editSet();
      if (action === 'delete-set') deleteSet();
      hideMenus();
      return;
    }

    hideMenus();
  });
}

/* helpers for menus */

function ensureSectionMenu() {
  if (sectionMenu) return sectionMenu;
  sectionMenu = document.createElement('div');
  sectionMenu.className = 'section-menu is-hidden';
  sectionMenu.innerHTML = `
    <button type="button" data-action="rename-section">Rename section</button>
    <button type="button" data-action="delete-section">Delete section</button>
  `;
  document.body.appendChild(sectionMenu);
  return sectionMenu;
}

function ensureCardMenu() {
  if (cardMenu) return cardMenu;
  cardMenu = document.createElement('div');
  cardMenu.className = 'card-menu is-hidden';
  cardMenu.innerHTML = `
    <button type="button" class="card-menu-item card-menu-item-strong" data-action="change-section">
      Change section
    </button>
    <div class="card-menu-divider"></div>
    <button type="button" class="card-menu-item" data-action="rename-set">
      Rename
    </button>
    <button type="button" class="card-menu-item" data-action="edit-set">
      Edit details
    </button>
    <div class="card-menu-divider"></div>
    <button type="button" class="card-menu-item card-menu-item-danger" data-action="delete-set">
      Delete set
    </button>
  `;
  document.body.appendChild(cardMenu);
  return cardMenu;
}

function toggleSectionMenu(btn, section) {
  const menu = ensureSectionMenu();
  if (!section) return;

  if (!menu.classList.contains('is-hidden') && currentSection === section) {
    hideMenus();
    return;
  }

  currentSection = section;
  menu.classList.remove('is-hidden');

  const rect = btn.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
  menu.style.left = `${rect.right + window.scrollX - menuRect.width}px`;
}

function toggleCardMenu(btn, card) {
  const menu = ensureCardMenu();
  if (!card) return;

  if (!menu.classList.contains('is-hidden') && currentCard === card) {
    hideMenus();
    return;
  }

  currentCard = card;
  menu.classList.remove('is-hidden');

  const rect = btn.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  menu.style.top = `${rect.bottom + window.scrollY + 4}px`;
  menu.style.left = `${rect.right + window.scrollX - menuRect.width}px`;
}

function hideMenus() {
  sectionMenu?.classList.add('is-hidden');
  cardMenu?.classList.add('is-hidden');
  currentCard = null;
  currentSection = null;
}

/* section menu actions */

function renameSection() {
  if (!currentSection) return;
  const titleSpan = currentSection.querySelector('.section-title-text');
  if (!titleSpan) return;
  const current = titleSpan.textContent || '';
  const newTitle = window.prompt('Rename section:', current);
  if (newTitle && newTitle.trim()) {
    titleSpan.textContent = newTitle.trim();
    syncSectionsFromDOM();
    refreshSectionSelect();
  }
}

function deleteSection() {
  if (!currentSection) return;
  if (!window.confirm('Delete this section?')) return;
  currentSection.remove();
  syncSectionsFromDOM();
  refreshSectionSelect();
}

/* card menu actions */

function changeSetSection() {
  if (!currentCard) return;
  const sections = getSections();
  if (!sections.length) return;

  const listText = sections
    .map((s, i) => `${i + 1}. ${s.title}`)
    .join('\n');

  const choice = window.prompt(
    `Move set to which section?\n${listText}\n\nEnter a number:`
  );
  if (!choice) return;

  const index = parseInt(choice, 10);
  if (Number.isNaN(index) || index < 1 || index > sections.length) {
    alert('Invalid choice.');
    return;
  }

  moveCardToSection(currentCard, sections[index - 1].id);
}

function renameSet() {
  if (!currentCard) return;
  const titleEl = currentCard.querySelector('.card-title');
  if (!titleEl) return;
  const current = titleEl.textContent || '';
  const newTitle = window.prompt('Rename flashcard set:', current);
  if (newTitle && newTitle.trim()) {
    titleEl.textContent = newTitle.trim();
  }
}

function editSet() {
  if (!currentCard) return;
  openEditSetModal(currentCard);
}

function deleteSet() {
  if (!currentCard) return;
  if (!window.confirm('Delete this flashcard set?')) return;
  currentCard.remove();
}
