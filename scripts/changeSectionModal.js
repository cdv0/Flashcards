let modal = null;
let setNameEl = null;
let inputEl = null;
let addNewSectionLink = null;
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
            <label for="changeSectionInput" class="modal-label">
              New section
            </label>
          </div>
          <input 
            type="text" 
            id="changeSectionInput" 
            class="modal-input" 
            placeholder="Enter section name"
          />
        </div>
      </div>

      <div class="modal-actions">
        <a href="#" class="add-new-section-link" id="add-new-section-link">
          + Add to existing section
        </a>
        <div class="modal-buttons">
          <button type="button" class="btn btn-cancel" id="change-section-cancel">
            Cancel
          </button>
          <button type="button" class="btn btn-primary" id="change-section-done">
            Done
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  setNameEl = modal.querySelector('.js-set-name');
  inputEl = modal.querySelector('#changeSectionInput');
  addNewSectionLink = modal.querySelector('#add-new-section-link');
  cancelBtn = modal.querySelector('#change-section-cancel');
  doneBtn = modal.querySelector('#change-section-done');

  cancelBtn.addEventListener('click', closeChangeSectionModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeChangeSectionModal();
  });

  addNewSectionLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Add a new section clicked');
    // You can add logic here to create a new section
    // For now, just close the modal
    closeChangeSectionModal();
  });
}

function closeChangeSectionModal() {
  if (!modal) return;
  modal.classList.add('is-hidden');
}

/**
 * Open the Change Section modal.
 * @param {string} setName - title of the set
 * @param {string} currentSection - name of the current section
 * @param {(newSectionName: string) => void} onDone - callback when Done is clicked
 */
export function openChangeSectionModal(setName, currentSection, onDone) {
  if (!modal) createChangeSectionModal();

  // Set title text
  setNameEl.textContent = setName || '';

  // Pre-fill with current section if provided
  inputEl.value = currentSection || '';

  doneBtn.onclick = () => {
    const newSectionName = inputEl.value.trim();
    if (!newSectionName) {
      alert('Please enter a section name');
      return;
    }
    closeChangeSectionModal();
    if (onDone) onDone(newSectionName);
  };

  modal.classList.remove('is-hidden');
  
  // Focus the input after a brief delay
  setTimeout(() => inputEl.focus(), 100);
}