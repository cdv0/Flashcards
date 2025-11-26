
import { refreshSectionSelect } from './state.js';

export function setupCreateSetModal() {
  const createBtn = document.querySelector('.create-btn');
  const modalBackdrop = document.getElementById('createSetModal');
  if (!createBtn || !modalBackdrop) return;

  const titleInput = document.getElementById('setTitle');
  const descInput = document.getElementById('setDescription');
  const titleCount = document.getElementById('setTitleCount');
  const descCount = document.getElementById('setDescCount');
  const sectionSelect = document.getElementById('setSectionSelect');
  const publicCheckbox = document.getElementById('setMakePublic');
  const confirmBtn = document.getElementById('confirmCreateSetBtn');
  const cancelBtn = document.getElementById('cancelCreateSetBtn');

  function openModal() {
    modalBackdrop.classList.remove('is-hidden');
    titleInput.value = '';
    descInput.value = '';
    titleCount.textContent = '0/50';
    descCount.textContent = '0/200';
    publicCheckbox.checked = false;

    refreshSectionSelect();
    titleInput.focus();
  }

  function closeModal() {
    modalBackdrop.classList.add('is-hidden');
  }

  titleInput.addEventListener('input', () => {
    titleCount.textContent = `${titleInput.value.length}/50`;
  });

  descInput.addEventListener('input', () => {
    descCount.textContent = `${descInput.value.length}/200`;
  });

  createBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });

  confirmBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const sectionId = sectionSelect.value || 'unassigned';
    const makePublic = publicCheckbox.checked;

    if (!title) {
      alert('Please enter a title.');
      return;
    }

    createFlashcardSet({ title, description, sectionId, makePublic });
    closeModal();
  });
}

export function createFlashcardSet({ title, description, sectionId, makePublic, termCount = 0 }) {
  const targetSection =
    document.querySelector(`.flashcard-section[data-section-id="${sectionId}"]`) ||
    document.querySelector('.flashcard-section[data-section-id="unassigned"]');

  if (!targetSection) return;

  const grid = targetSection.querySelector('.flashcard-grid');

  const card = document.createElement('div');
  card.className = 'flashcard-card';
  card.dataset.setId = `set-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const header = document.createElement('div');
  header.className = 'card-header';

  const h3 = document.createElement('h3');
  h3.className = 'card-title';
  h3.textContent = title;

  const menuBtn = document.createElement('button');
  menuBtn.className = 'card-menu-btn';
  menuBtn.textContent = '⋮';

  header.appendChild(h3);
  header.appendChild(menuBtn);

  const p = document.createElement('p');
  p.className = 'card-desc';
  p.textContent = description;


  const footer = document.createElement('div');
  footer.className = 'card-footer';

  const termsPill = document.createElement('button');
  termsPill.className = 'pill pill-terms';
  termsPill.textContent = `${termCount} terms`;

  footer.appendChild(termsPill);

  if (makePublic) {
    const publicPill = document.createElement('span');
    publicPill.className = 'pill pill-public';
    publicPill.textContent = 'Public';
    footer.appendChild(publicPill);
  }
  else {
    const publicPill = document.createElement('span');
    publicPill.className = 'pill pill-public';
    publicPill.textContent = 'Private';
    footer.appendChild(publicPill);
  }

  
  card.appendChild(header);
  card.appendChild(p);
  card.appendChild(footer);

  grid.appendChild(card);
}

