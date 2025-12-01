import { refreshSectionSelect } from './state.js';

let modalBackdrop;
let titleInput;
let descInput;
let titleCount;
let descCount;
let sectionSelect;
let publicCheckbox;
let confirmBtn;
let cancelBtn;
let modalTitleEl;

export function setupCreateSetModal() {
  const createBtn = document.querySelector('.create-btn');
  modalBackdrop = document.getElementById('createSetModal');
  if (!createBtn || !modalBackdrop) return;

  titleInput = document.getElementById('setTitle');
  descInput = document.getElementById('setDescription');
  titleCount = document.getElementById('setTitleCount');
  descCount = document.getElementById('setDescCount');
  sectionSelect = document.getElementById('setSectionSelect');
  publicCheckbox = document.getElementById('setMakePublic');
  confirmBtn = document.getElementById('confirmCreateSetBtn');
  cancelBtn = document.getElementById('cancelCreateSetBtn');
  // use your existing h2
  modalTitleEl = modalBackdrop.querySelector('.modal-header h2');

  function openCreateModal() {
    // 🔹 CREATE MODE: title + button text
    if (modalTitleEl) modalTitleEl.textContent = 'Create flashcard set';
    confirmBtn.textContent = 'Create';

    modalBackdrop.classList.remove('is-hidden');
    titleInput.value = '';
    descInput.value = '';
    titleCount.textContent = '0/50';
    descCount.textContent = '0/200';
    publicCheckbox.checked = false;

    refreshSectionSelect();
    titleInput.focus();

    confirmBtn.onclick = () => {
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
    };
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

  createBtn.addEventListener('click', openCreateModal);
  cancelBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });
}

export function openEditSetModal(card) {
  if (!modalBackdrop || !card) return;

  const titleEl = card.querySelector('.card-title');
  const descEl = card.querySelector('.card-desc');
  const publicPill = card.querySelector('.pill-public');

  const currentTitle = titleEl?.textContent?.trim() || '';
  const currentDesc = descEl?.textContent?.trim() || '';
  const isPublic =
    (publicPill?.textContent || '').trim().toLowerCase() === 'public';

  if (modalTitleEl) modalTitleEl.textContent = 'Edit flashcard set';
  confirmBtn.textContent = 'Save';

  modalBackdrop.classList.remove('is-hidden');

  // prefill fields
  titleInput.value = currentTitle;
  descInput.value = currentDesc;
  titleCount.textContent = `${currentTitle.length}/50`;
  descCount.textContent = `${currentDesc.length}/200`;
  publicCheckbox.checked = isPublic;

  refreshSectionSelect();

  confirmBtn.onclick = () => {
    const newTitle = titleInput.value.trim();
    const newDesc = descInput.value.trim();
    const makePublic = publicCheckbox.checked;

    if (!newTitle) {
      alert('Please enter a title.');
      return;
    }

    if (titleEl) titleEl.textContent = newTitle;
    if (descEl) descEl.textContent = newDesc;
    if (publicPill) {
      publicPill.textContent = makePublic ? 'Public' : 'Private';
    }

    modalBackdrop.classList.add('is-hidden');
  };

  titleInput.focus();
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

  const publicPill = document.createElement('span');
  publicPill.className = 'pill pill-public';
  publicPill.textContent = makePublic ? 'Public' : 'Private';
  footer.appendChild(publicPill);

  card.appendChild(header);
  card.appendChild(p);
  card.appendChild(footer);

// Click anywhere on the card EXCEPT the menu button → go to editor
card.addEventListener('click', (event) => {
  // if the click came from the menu button, do nothing
  if (event.target.closest('.card-menu-btn')) {
    return;
  }

  // For now, only CECS 448 Midterm 2 routes to add_cards_set.html
  if (title === "CECS 448 Midterm 2") {
    window.location.href = "./add_cards_set.html";
  } else {
    // later you can route other sets based on ID, etc.
    // window.location.href = "./add_cards_set.html";
  }
});


  grid.appendChild(card);
}