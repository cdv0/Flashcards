// renameSubsetModal.js

let renameModal = null;
let renameInput = null;
let cancelBtn = null;
let doneBtn = null;
let onRenameCallback = null;

function openRenameSubsetModal(title, currentName, onRename) {
    onRenameCallback = onRename;

    // Create modal if not made yet
    if (!renameModal) {
        renameModal = document.createElement("div");
        renameModal.className = "rename-modal-overlay";
        renameModal.innerHTML = `
            <div class="rename-modal">
                <h2>Rename Subset</h2>

                <input id="renameInput" type="text"/>

                <div class="modal-buttons">
                    <button id="cancelRename">Cancel</button>
                    <button id="doneRename">Done</button>
                </div>
            </div>
        `;

        document.body.appendChild(renameModal);

        renameInput = renameModal.querySelector("#renameInput");
        cancelBtn = renameModal.querySelector("#cancelRename");
        doneBtn = renameModal.querySelector("#doneRename");

        // CANCEL closes modal
        cancelBtn.addEventListener("click", () => {
            closeRenameSubsetModal();
        });

        // DONE renames + closes modal
        doneBtn.addEventListener("click", () => {
            const newText = renameInput.value.trim();

            if (onRenameCallback) {
                onRenameCallback(newText);
            }

            closeRenameSubsetModal();
        });
    }

    renameInput.value = currentName;
    renameModal.style.display = "flex";
    renameInput.focus();
}

function closeRenameSubsetModal() {
    if (renameModal) {
        renameModal.style.display = "none";
    }
}
