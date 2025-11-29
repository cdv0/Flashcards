import { createSection } from './sections.js';
import { syncSectionsFromDOM, refreshSectionSelect } from './state.js';

let addSectionBtn;
let modalBackdrop;
let sectionTitleInput;
let charCountEl;
let confirmBtn;
let cancelBtn;
let colorDots = [];
let headerTitleEl;

let isEditing = false;
let editingSection = null; // .flashcard-section element we’re editing

export function setupAddSectionModal() {
  addSectionBtn = document.querySelector('.add-section-btn');
  modalBackdrop = document.getElementById('addSectionModal');
  if (!addSectionBtn || !modalBackdrop) return;

  sectionTitleInput = document.getElementById('sectionTitle');
  charCountEl = document.getElementById('sectionTitleCount');
  confirmBtn = document.getElementById('confirmAddSectionBtn');
  cancelBtn = modalBackdrop.querySelector('.cancel-btn');
  colorDots = Array.from(modalBackdrop.querySelectorAll('.color-dot'));
  headerTitleEl = modalBackdrop.querySelector('.modal-header h2');

  // typing counter
  sectionTitleInput.addEventListener('input', () => {
    charCountEl.textContent = `${sectionTitleInput.value.length}/50`;
  });

  // color selection
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('is-selected'));
      dot.classList.add('is-selected');
    });
  });

  // open in "Add" mode from button
  addSectionBtn.addEventListener('click', openAddMode);

  // close actions
  cancelBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });

  // confirm (Add or Save, depending on mode)
  confirmBtn.addEventListener('click', handleConfirm);
}

function resetCommonState() {
  if (colorDots.length) {
    colorDots.forEach(d => d.classList.remove('is-selected'));
    colorDots[0].classList.add('is-selected');
  }
  sectionTitleInput.focus();
}

/* ---------- OPEN MODES ---------- */

function openAddMode() {
  isEditing = false;
  editingSection = null;

  if (headerTitleEl) headerTitleEl.textContent = 'Add section';
  confirmBtn.textContent = 'Add';

  sectionTitleInput.value = '';
  charCountEl.textContent = '0/50';

  resetCommonState();
  modalBackdrop.classList.remove('is-hidden');
}

export function openSectionEditModal(sectionElement) {
  if (!modalBackdrop || !sectionElement) return;

  isEditing = true;
  editingSection = sectionElement;

  if (headerTitleEl) headerTitleEl.textContent = 'Edit section';
  confirmBtn.textContent = 'Save';

  // pull current title
  const titleSpan = sectionElement.querySelector('.section-title-text');
  const currentTitle = titleSpan?.textContent?.trim() || '';

  sectionTitleInput.value = currentTitle;
  charCountEl.textContent = `${currentTitle.length}/50`;

  // (optional) just default color selection; user can pick a new one if they want
  resetCommonState();

  modalBackdrop.classList.remove('is-hidden');
}

/* ---------- CLOSE & CONFIRM ---------- */

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.add('is-hidden');
  isEditing = false;
  editingSection = null;
}

function handleConfirm() {
  const title = sectionTitleInput.value.trim();
  if (!title) {
    alert('Please enter a section title.');
    return;
  }

  const selectedDot =
    colorDots.find(d => d.classList.contains('is-selected')) || colorDots[0];
  const color =
    selectedDot?.getAttribute('data-color') || '#d1d5db';

  if (isEditing && editingSection) {
    // UPDATE existing section
    const titleSpan = editingSection.querySelector('.section-title-text');
    const titleBar = editingSection.querySelector('.section-title');

    if (titleSpan) titleSpan.textContent = title;
    if (titleBar) titleBar.style.backgroundColor = color;

    // keep state in sync
    syncSectionsFromDOM();
    refreshSectionSelect();
  } else {
    // CREATE new section
    createSection(title, color);
  }

  closeModal();
}