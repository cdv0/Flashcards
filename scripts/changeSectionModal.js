import { getSections } from './state.js';

let modal = null;
let setNameEl = null;
let selectEl = null;
let cancelBtn = null;
let doneBtn = null;

function createChangeSectionModal() {
  modal = document.createElement('div');
  modal.className = 'modal-backdrop is-hidden';

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">
          Change section for
          <u><strong class="js-set-name"></strong></u>
        </h2>
      </div>

      <div class="modal-body">
        <div class="modal-field">
          <div class="modal-field-label-row">
            <label for="changeSectionSelect" class="modal-label">
              New section
            </label>
          </div>
          <select id="changeSectionSelect" class="modal-select"></select>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-cancel" id="change-section-cancel">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" id="change-section-done">
          Done
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  setNameEl = modal.querySelector('.js-set-name');
  selectEl = modal.querySelector('#changeSectionSelect');
  cancelBtn = modal.querySelector('#change-section-cancel');
  doneBtn = modal.querySelector('#change-section-done');

  cancelBtn.addEventListener('click', closeChangeSectionModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeChangeSectionModal();
  });
}

function closeChangeSectionModal() {
  if (!modal) return;
  modal.classList.add('is-hidden');
}

/**
 * Open the Change Section modal.
 * @param {string} setName - title of the set
 * @param {string} currentSectionId - id of the current section
 * @param {(newSectionId: string) => void} onDone - callback when Done is clicked
 */
export function openChangeSectionModal(setName, currentSectionId, onDone) {
  if (!modal) createChangeSectionModal();

  // Set title text
  setNameEl.textContent = setName || '';

  // Populate dropdown from sections
  const sections = getSections();
  selectEl.innerHTML = '';

  sections.forEach((s) => {
    const option = document.createElement('option');
    option.value = s.id;
    option.textContent = s.title;
    selectEl.appendChild(option);
  });

  // Pre-select current section if it exists
  if (currentSectionId && sections.some(s => s.id === currentSectionId)) {
    selectEl.value = currentSectionId;
  }

  doneBtn.onclick = () => {
    const chosenId = selectEl.value;
    if (!chosenId) {
      closeChangeSectionModal();
      return;
    }
    closeChangeSectionModal();
    if (onDone) onDone(chosenId);
  };

  modal.classList.remove('is-hidden');
}
