// scripts/sections.js
import { syncSectionsFromDOM, refreshSectionSelect } from './state.js';

export function createSection(title, color) {
  const container = document.querySelector('.page-container');
  if (!container) return;

  const id = `section-${Date.now()}`;
  const section = document.createElement('section');
  section.className = 'flashcard-section user-section';
  section.dataset.sectionId = id;

  const titleDiv = document.createElement('div');
  titleDiv.className = 'section-title';
  titleDiv.style.backgroundColor = color;

  const titleSpan = document.createElement('span');
  titleSpan.className = 'section-title-text';
  titleSpan.textContent = title;

  const menuBtn = document.createElement('button');
  menuBtn.type = 'button';
  menuBtn.className = 'section-menu-btn';
  menuBtn.setAttribute('aria-label', 'Section options');
  menuBtn.innerHTML = '⋮';

  titleDiv.appendChild(titleSpan);
  titleDiv.appendChild(menuBtn);

  const grid = document.createElement('div');
  grid.className = 'flashcard-grid';

  section.appendChild(titleDiv);
  section.appendChild(grid);

  container.appendChild(section);

  // keep state & dropdown in sync
  syncSectionsFromDOM();
  refreshSectionSelect();
}

export function moveCardToSection(card, sectionId) {
  const targetSection = document.querySelector(
    `.flashcard-section[data-section-id="${sectionId}"]`
  );
  if (!targetSection) return;

  const grid = targetSection.querySelector('.flashcard-grid');
  if (!grid) return;

  grid.appendChild(card);
}
