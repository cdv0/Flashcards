
import { getSections, syncSectionsFromDOM, refreshSectionSelect } from './state.js';
import { moveCardToSection } from './sections.js';
import { openEditSetModal } from './createSetModal.js';
import { openDeleteConfirmationModal, openDeleteSectionModal } from './openDeleteConfirmationModal.js';
import { openRenameSubsetModal } from './renameSubsetModal.js';
import { openChangeSectionModal } from './changeSectionModal.js';
import { openSectionEditModal } from './addSectionModal.js';

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
  // reuse the Add Section modal in edit mode
  openSectionEditModal(currentSection);
}

function deleteSection() {
  if (!currentSection) return;

  const titleSpan = currentSection.querySelector('.section-title-text');
  const sectionName = titleSpan?.textContent?.trim() || 'this section';

  openDeleteSectionModal(sectionName, () => {
    currentSection.remove();
    syncSectionsFromDOM();
    refreshSectionSelect();
  });
}

/* card menu actions */

function changeSetSection() {
  if (!currentCard) return;

  const titleEl = currentCard.querySelector('.card-title');
  const setName = titleEl?.textContent?.trim() || 'this set';

  const currentSectionEl = currentCard.closest('.flashcard-section');
  const currentSectionId = currentSectionEl?.dataset.sectionId || 'unassigned';

  openChangeSectionModal(setName, currentSectionId, (newSectionId) => {
    if (!newSectionId) return;
    moveCardToSection(currentCard, newSectionId);
  });
}

function renameSet() {
  if (!currentCard) return;
  const titleEl = currentCard.querySelector('.card-title');
  if (!titleEl) return;

  const current = titleEl.textContent?.trim() || '';

  openRenameSubsetModal(current, current, (newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    titleEl.textContent = trimmed;
  }, 'set');
}

function editSet() {
  if (!currentCard) return;
  openEditSetModal(currentCard);
}

function deleteSet() {
  if (!currentCard) return;

  // Grab set title from the card
  const titleEl = currentCard.querySelector('.card-title');
  const setName = titleEl?.textContent?.trim() || 'this set';

  // Grab section name from the parent section
  const sectionEl = currentCard.closest('.flashcard-section');
  const sectionTitleEl = sectionEl?.querySelector('.section-title-text');
  const sectionName = sectionTitleEl?.textContent?.trim() || 'Unassigned';

  // Open your custom delete confirmation modal
  openDeleteConfirmationModal(setName, sectionName, () => {
    currentCard.remove();
  });
}
