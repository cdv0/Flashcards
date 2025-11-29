let modal = null;

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
          <h2 class="modal-title">Delete confirmation</h2>
          <p>
            Are you sure you want to delete set
            <u><strong class="js-set-name"></strong></u>
            from section
            <u><strong class="js-section-name"></strong></u>?
          </p>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-cancel" id="cancel-btn">Cancel</button>
        <button class="btn btn-delete" id="confirm-btn">Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

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

  modal.querySelector('.js-set-name').textContent = setName;
  modal.querySelector('.js-section-name').textContent = sectionName;

  const confirmBtn = modal.querySelector('#confirm-btn');
  confirmBtn.onclick = () => {
    closeModal();
    if (onConfirm) onConfirm();
  };

  modal.classList.remove('is-hidden');
}