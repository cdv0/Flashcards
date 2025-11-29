let warningModal = null;
let subsetEl = null;
let setEl = null;
let cancelBtn = null;
let leaveBtn = null;

function createWarningModal() {
  warningModal = document.createElement('div');
  warningModal.className = 'modal-backdrop is-hidden';

  warningModal.innerHTML = `
    <div class="modal-card">
      <div class="modal-top">
        <div class="modal-header">
          <div class="icon-box">
            <img src="../assets/warning.svg" />
          </div>
        </div>

        <div class="modal-body">
          <h2 class="modal-title">Warning</h2>
          <p>
            Editing subset
            <u><strong class="js-subset-name"></strong></u>
            will require you to leave the study session for
            <u><strong class="js-set-name"></strong></u>.
            Are you sure you want to continue?
          </p>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-cancel" id="leave-cancel-btn">Cancel</button>
        <button class="btn btn-leave" id="leave-confirm-btn">Leave</button>
      </div>
    </div>
  `;

  document.body.appendChild(warningModal);

  subsetEl = warningModal.querySelector('.js-subset-name');
  setEl = warningModal.querySelector('.js-set-name');
  cancelBtn = warningModal.querySelector('#leave-cancel-btn');
  leaveBtn = warningModal.querySelector('#leave-confirm-btn');

  // close on Cancel or backdrop click
  cancelBtn.addEventListener('click', closeWarningModal);
  warningModal.addEventListener('click', (e) => {
    if (e.target === warningModal) closeWarningModal();
  });
}

function closeWarningModal() {
  if (!warningModal) return;
  warningModal.classList.add('is-hidden');
}

export function openLeaveStudyWarningModal(subsetName, setTitle, onLeave) {
  if (!warningModal) createWarningModal();

  subsetEl.textContent = subsetName || '';
  setEl.textContent = setTitle || '';

  leaveBtn.onclick = () => {
    closeWarningModal();
    if (onLeave) onLeave();
  };

  warningModal.classList.remove('is-hidden');
}
