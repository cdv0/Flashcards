// scripts/addSectionModal.js
import { createSection } from './sections.js';

export function setupAddSectionModal() {
  const addSectionBtn = document.querySelector('.add-section-btn');
  const modalBackdrop = document.getElementById('addSectionModal');
  if (!addSectionBtn || !modalBackdrop) return;

  const sectionTitleInput = document.getElementById('sectionTitle');
  const charCountEl = document.getElementById('sectionTitleCount');
  const confirmBtn = document.getElementById('confirmAddSectionBtn');
  const cancelBtn = modalBackdrop.querySelector('.cancel-btn');
  const colorDots = Array.from(
    modalBackdrop.querySelectorAll('.color-dot')
  );

  function openModal() {
    modalBackdrop.classList.remove('is-hidden');
    sectionTitleInput.value = '';
    charCountEl.textContent = '0/50';

    if (colorDots.length) {
      colorDots.forEach(d => d.classList.remove('is-selected'));
      colorDots[0].classList.add('is-selected');
    }

    sectionTitleInput.focus();
  }

  function closeModal() {
    modalBackdrop.classList.add('is-hidden');
  }

  sectionTitleInput.addEventListener('input', () => {
    charCountEl.textContent = `${sectionTitleInput.value.length}/50`;
  });

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('is-selected'));
      dot.classList.add('is-selected');
    });
  });

  addSectionBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });

  confirmBtn.addEventListener('click', () => {
    const title = sectionTitleInput.value.trim();
    if (!title) {
      alert('Please enter a section title.');
      return;
    }

    const selectedDot =
      colorDots.find(d => d.classList.contains('is-selected')) ||
      colorDots[0];
    const color =
      selectedDot?.getAttribute('data-color') || '#d1d5db';

    createSection(title, color);
    closeModal();
  });
}
