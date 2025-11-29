let modal = null;
let titleEl = null;
let messageEl = null;
let confirmBtn = null;

function createModal() {
  modal = document.createElement('div');
  modal.className = 'modal-backdrop is-hidden';

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-top">
        <div class="modal-header">
          <img src="../assets/TrashForever.svg" class="trash-icon" />
        </div>

        <div class="modal-body">
          <h2 class="modal-title js-modal-title">Delete confirmation</h2>
          <p class="js-modal-message"></p>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-cancel" id="cancel-btn">Cancel</button>
        <button class="btn btn-delete" id="confirm-btn">Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  titleEl = modal.querySelector('.js-modal-title');
  messageEl = modal.querySelector('.js-modal-message');
  confirmBtn = modal.querySelector('#confirm-btn');

  // Close when clicking cancel or outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'cancel-btn') {
      closeModal();
    }
  });
}

function closeModal() {
  modal.classList.add('is-hidden');
}

export function openDeleteConfirmationModal(setName, sectionName, onConfirm) {
  if (!modal) createModal();

  titleEl.textContent = 'Delete confirmation';
  messageEl.innerHTML =
    `Are you sure you want to delete set ` +
    `<u><strong>${setName}</strong></u> from section ` +
    `<u><strong>${sectionName}</strong></u>?`;

  confirmBtn.onclick = () => {
    closeModal();
    if (onConfirm) onConfirm();
  };

  modal.classList.remove('is-hidden');
}

// 🔹 For deleting a SECTION
export function openDeleteSectionModal(sectionName, onConfirm) {
  if (!modal) createModal();

  titleEl.textContent = 'Delete section';
  messageEl.innerHTML =
    `Are you sure you want to delete section ` +
    `<u><strong>${sectionName}</strong></u>?`;

  confirmBtn.onclick = () => {
    closeModal();
    if (onConfirm) onConfirm();
  };

  modal.classList.remove('is-hidden');
}