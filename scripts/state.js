// scripts/state.js

let sections = [];

// Read sections from the DOM into the array
export function syncSectionsFromDOM() {
  sections = [];
  document.querySelectorAll('.flashcard-section').forEach(sec => {
    const id = sec.dataset.sectionId || '';
    if (!id) return;

    const titleSpan = sec.querySelector('.section-title-text');
    const header = sec.querySelector('.section-title');
    const title = titleSpan ? titleSpan.textContent.trim() : id;
    const color = header
      ? window.getComputedStyle(header).backgroundColor
      : '#d1d5db';

    sections.push({ id, title, color });
  });
}

// Read-only getter
export function getSections() {
  return sections.slice();
}

// Dropdown for "Assign to section"
export function refreshSectionSelect() {
  const select = document.getElementById('setSectionSelect');
  if (!select) return;

  select.innerHTML = '';

  const unassignedOption = document.createElement('option');
  unassignedOption.value = 'unassigned';
  unassignedOption.textContent = 'Unassigned';
  select.appendChild(unassignedOption);

  getSections()
    .filter(s => s.id !== 'unassigned')
    .forEach(sec => {
      const opt = document.createElement('option');
      opt.value = sec.id;
      opt.textContent = sec.title;
      select.appendChild(opt);
    });
}
