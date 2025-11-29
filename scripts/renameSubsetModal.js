let renameModal = null;
let renameInput = null;
let renameCount = null;
let cancelBtn = null;
let doneBtn = null;

function createRenameModal() {
  renameModal = document.createElement('div');
  renameModal.className = 'modal-backdrop is-hidden';

  renameModal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title" id="renameModalTitle">Rename subset</h2>
      </div>

      <div class="modal-body">
        <div class="modal-field">
          <div class="modal-field-label-row">
            <label for="renameInput" class="modal-label">New title</label>
            <span id="renameCount" class="char-count">0/50</span>
          </div>
          <input
            type="text"
            id="renameInput"
            class="modal-input"
            placeholder="Type here"
            maxlength="50"
          />
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="modal-btn cancel-btn" id="cancelRenameBtn">
          Cancel
        </button>
        <button type="button" class="modal-btn primary-btn" id="confirmRenameBtn">
          Done
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(renameModal);

  renameInput = renameModal.querySelector('#renameInput');
  renameCount = renameModal.querySelector('#renameCount');
  cancelBtn = renameModal.querySelector('#cancelRenameBtn');
  doneBtn = renameModal.querySelector('#confirmRenameBtn');

  renameInput.addEventListener('input', () => {
    renameCount.textContent = `${renameInput.value.length}/50`;
  });

  cancelBtn.addEventListener('click', closeRenameModal);

  renameModal.addEventListener('click', (e) => {
    if (e.target === renameModal) closeRenameModal();
  });
}

function closeRenameModal() {
  if (!renameModal) return;
  renameModal.classList.add('is-hidden');
}

export function openRenameSubsetModal(subsetName, currentTitle, onDone) {
  if (!renameModal) createRenameModal();

  const titleEl = renameModal.querySelector('#renameModalTitle');
  titleEl.textContent = `Rename subset ${subsetName}`;

  renameInput.value = currentTitle || '';
  renameCount.textContent = `${renameInput.value.length}/50`;

  doneBtn.onclick = () => {
    const newTitle = renameInput.value.trim();
    if (!newTitle) {
      alert('Please enter a new title.');
      return;
    }
    closeRenameModal();
    if (onDone) onDone(newTitle);
  };

  renameModal.classList.remove('is-hidden');
  renameInput.focus();
}