document.addEventListener("DOMContentLoaded", () => {
    // Fake set data
    const flashcardSet = {
      title: "CECS 448 Midterm 2",
      description:
        "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
      cards: [
        {
          id: "c1",
          term: "Usability",
          definition: "Usability is the degree to which a system is easy to use.",
        },
        {
          id: "c2",
          term: "Heuristic Evaluation",
          definition:
            "A method where experts review a UI against a list of heuristics.",
        },
      ],
    };
  
    // DOM refs
    const setTitleHeading = document.getElementById("set-title-heading");
    const setDescriptionText = document.getElementById("set-description-text");
  
    const successBanner = document.getElementById("success-banner");
    const successBannerText = document.getElementById("success-banner-text");
  
    const termInput = document.getElementById("term-input");
    const definitionInput = document.getElementById("definition-input");
    const addCardBtn = document.getElementById("add-card-btn");
    const clearEditorBtn = document.getElementById("clear-editor-btn");
    const editingIndicator = document.getElementById("editing-indicator");
  
    const termsList = document.getElementById("terms-list");
    const termsCountPill = document.getElementById("terms-count-pill");
  
    const backdrop = document.getElementById("modal-backdrop");
    const editSetModal = document.getElementById("edit-set-modal");
    const deleteSetModal = document.getElementById("delete-set-modal");
  
    const editSetTitleInput = document.getElementById("edit-set-title-input");
    const editSetDescriptionInput = document.getElementById(
      "edit-set-description-input"
    );
    const editSetSaveBtn = document.getElementById("edit-set-save-btn");
  
    const deleteSetName = document.getElementById("delete-set-name");
    const deleteSetConfirmBtn = document.getElementById("delete-set-confirm-btn");
  
    const setMenuButton = document.getElementById("set-menu-button");
    const setMenu = document.getElementById("set-menu");
    const setMenuEdit = document.getElementById("set-menu-edit");
    const setMenuDelete = document.getElementById("set-menu-delete");
  
    let editingCardId = null;
  
    // Helpers
    function renderSetHeader() {
      setTitleHeading.textContent = flashcardSet.title;
      setDescriptionText.textContent = flashcardSet.description;
      deleteSetName.textContent = flashcardSet.title;
    }
  
    function showSuccess(msg) {
      successBannerText.textContent = msg;
      successBanner.classList.remove("hidden");
      setTimeout(() => successBanner.classList.add("hidden"), 2000);
    }
  
    function openModal(modalEl) {
      backdrop.classList.remove("hidden");
      modalEl.classList.remove("hidden");
    }
  
    function closeAllModals() {
      backdrop.classList.add("hidden");
      [editSetModal, deleteSetModal].forEach((m) => m.classList.add("hidden"));
    }
  
    function closeAllMenus() {
      document
        .querySelectorAll(".menu-dropdown")
        .forEach((m) => m.classList.add("hidden"));
    }
  
    function clearEditor() {
      termInput.value = "";
      definitionInput.value = "";
      editingCardId = null;
      addCardBtn.textContent = "Add card";
      editingIndicator.classList.add("hidden");
    }
  
    function renderTerms() {
      termsList.innerHTML = "";
      flashcardSet.cards.forEach((card, index) => {
        const item = document.createElement("div");
        item.className = "term-item";
        item.dataset.id = card.id;
  
        item.innerHTML = `
          <div class="term-item__header">
            <span class="term-index">${index + 1}</span>
            <div class="term-item__labels">
              <span class="term-label">Term</span>
              <span class="term-label">Definition</span>
            </div>
            <div class="term-actions">
              <button class="icon-button term-menu-trigger" type="button">⋮</button>
              <div class="menu-dropdown term-menu hidden">
                <button class="menu-item term-edit">Edit card</button>
                <button class="menu-item menu-item--danger term-delete">Delete card</button>
              </div>
            </div>
          </div>
          <div class="term-item__body">
            <div class="term-item__field term-item__field--term">
              ${card.term || "<em>(no term)</em>"}
            </div>
            <div class="term-item__field term-item__field--definition">
              ${card.definition || "<em>(no definition)</em>"}
            </div>
          </div>
        `;
        termsList.appendChild(item);
      });
  
      const n = flashcardSet.cards.length;
      termsCountPill.textContent = n === 1 ? "1 term" : `${n} terms`;
    }
  
    // Card add/update
    addCardBtn.addEventListener("click", () => {
      const term = termInput.value.trim();
      const def = definitionInput.value.trim();
  
      if (!term && !def) {
        alert("Please enter a term or definition.");
        return;
      }
  
      if (editingCardId) {
        const card = flashcardSet.cards.find((c) => c.id === editingCardId);
        if (card) {
          card.term = term;
          card.definition = def;
          showSuccess("Updated card.");
        }
      } else {
        flashcardSet.cards.unshift({
          id: "c" + Date.now(),
          term,
          definition: def,
        });
        showSuccess(`Added term "${term || "Untitled"}".`);
      }
  
      renderTerms();
      clearEditor();
    });
  
    clearEditorBtn.addEventListener("click", clearEditor);
  
    // Global click handler for menus + actions
    document.addEventListener("click", (event) => {
      const target = event.target;
  
      // Close menus if clicking outside
      if (
        !target.closest(".menu-dropdown") &&
        !target.closest(".term-actions") &&
        !target.closest(".menu-wrapper")
      ) {
        closeAllMenus();
      }
  
      // Term menu trigger
      const trigger = target.closest(".term-menu-trigger");
      if (trigger) {
        event.stopPropagation();
        const item = trigger.closest(".term-item");
        const menu = item.querySelector(".term-menu");
        const hidden = menu.classList.contains("hidden");
        closeAllMenus();
        if (hidden) menu.classList.remove("hidden");
        return;
      }
  
      // Edit card
      const editBtn = target.closest(".term-edit");
      if (editBtn) {
        const item = editBtn.closest(".term-item");
        const id = item.dataset.id;
        const card = flashcardSet.cards.find((c) => c.id === id);
        if (!card) return;
  
        termInput.value = card.term;
        definitionInput.value = card.definition;
        editingCardId = id;
        addCardBtn.textContent = "Save changes";
        editingIndicator.classList.remove("hidden");
        closeAllMenus();
        return;
      }
  
      // Delete card
      const deleteBtn = target.closest(".term-delete");
      if (deleteBtn) {
        const item = deleteBtn.closest(".term-item");
        const id = item.dataset.id;
        const idx = flashcardSet.cards.findIndex((c) => c.id === id);
        if (idx === -1) return;
        if (!window.confirm("Delete this card?")) return;
  
        flashcardSet.cards.splice(idx, 1);
        renderTerms();
        showSuccess("Deleted card.");
        closeAllMenus();
        if (editingCardId === id) clearEditor();
        return;
      }
  
      // Set menu button
      if (target.closest("#set-menu-button")) {
        event.stopPropagation();
        const hidden = setMenu.classList.contains("hidden");
        closeAllMenus();
        if (hidden) setMenu.classList.remove("hidden");
        return;
      }
  
      // Edit set details
      if (target.closest("#set-menu-edit")) {
        closeAllMenus();
        editSetTitleInput.value = flashcardSet.title;
        editSetDescriptionInput.value = flashcardSet.description;
        openModal(editSetModal);
        return;
      }
  
      // Delete set
      if (target.closest("#set-menu-delete")) {
        closeAllMenus();
        openModal(deleteSetModal);
        return;
      }
  
      // Close modals via data-close-modal
      if (target.closest("[data-close-modal]")) {
        closeAllModals();
        return;
      }
    });
  
    // Save set
    editSetSaveBtn.addEventListener("click", () => {
      const newTitle = editSetTitleInput.value.trim();
      const newDesc = editSetDescriptionInput.value.trim();
      if (!newTitle) {
        alert("Set title cannot be empty.");
        return;
      }
      flashcardSet.title = newTitle;
      flashcardSet.description = newDesc;
      renderSetHeader();
      closeAllModals();
      showSuccess("Updated set details.");
    });
  
    // Confirm delete set → go back
    deleteSetConfirmBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  
    // backdrop closes modals
    backdrop.addEventListener("click", closeAllModals);
  
    // Initial render
    renderSetHeader();
    renderTerms();
    clearEditor();
    closeAllMenus();
    closeAllModals();
  });
  