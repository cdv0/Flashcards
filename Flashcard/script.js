// ====== Data ======
const sections = [
    {
      id: "unassigned",
      name: "Unassigned Flashcards",
      color: "gray",
      sets: [
        {
          id: "set1",
          title: "CECS 448 Midterm 2",
          description:
            "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
          termsCount: 20,
          visibility: "Public",
        },
        {
          id: "set2",
          title: "CECS 448 Midterm 2",
          description:
            "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
          termsCount: 20,
          visibility: "Public",
        },
        {
          id: "set3",
          title: "CECS 448 Midterm 2",
          description:
            "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
          termsCount: 20,
          visibility: "Public",
        },
      ],
    },
    {
      id: "c448",
      name: "CECS 448",
      color: "blue",
      sets: [
        {
          id: "set4",
          title: "CECS 448 Midterm 2",
          description:
            "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
          termsCount: 20,
          visibility: "Public",
        },
        {
          id: "set5",
          title: "CECS 448 Midterm 2",
          description:
            "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
          termsCount: 20,
          visibility: "Public",
        },
        {
          id: "set6",
          title: "CECS 448 Midterm 2",
          description:
            "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
          termsCount: 20,
          visibility: "Public",
        },
      ],
    },
  ];
  
  // ====== DOM refs ======
  const sectionsContainer = document.getElementById("sections-container");
  const globalSearchInput = document.getElementById("global-search");
  const setSearchInput = document.getElementById("set-search");
  const addSectionBtn = document.getElementById("add-section-btn");
  const createSetBtn = document.getElementById("create-set-btn");
  
  // Modals
  const backdrop = document.getElementById("modal-backdrop");
  const addSectionModal = document.getElementById("add-section-modal");
  const createSetModal = document.getElementById("create-set-modal");
  const editSetModal = document.getElementById("edit-set-modal");
  const deleteSetModal = document.getElementById("delete-set-modal");
  
  // Add Section modal fields
  const sectionTitleInput = document.getElementById("section-title-input");
  const sectionTitleCount = document.getElementById("section-title-count");
  const sectionAddConfirm = document.getElementById("section-add-confirm");
  const colorDots = document.querySelectorAll(".color-dot");
  
  // Create Set modal fields
  const createTitleInput = document.getElementById("create-title-input");
  const createTitleCount = document.getElementById("create-title-count");
  const createDescInput = document.getElementById("create-desc-input");
  const createDescCount = document.getElementById("create-desc-count");
  const createMakePublic = document.getElementById("create-make-public");
  const createSetConfirm = document.getElementById("create-set-confirm");
  
  // Edit Set modal fields
  const editSetTitleLabel = document.getElementById("edit-set-title-label");
  const editTitleInput = document.getElementById("edit-title-input");
  const editTitleCount = document.getElementById("edit-title-count");
  const editDescInput = document.getElementById("edit-desc-input");
  const editDescCount = document.getElementById("edit-desc-count");
  const editMakePublic = document.getElementById("edit-make-public");
  const editSetConfirm = document.getElementById("edit-set-confirm");
  const editDeleteBtn = document.getElementById("edit-delete-btn");
  
  // Delete modal fields
  const deleteSetName = document.getElementById("delete-set-name");
  const deleteSectionName = document.getElementById("delete-section-name");
  const deleteSetConfirm = document.getElementById("delete-set-confirm");
  
  // State
  let selectedSectionColor = "gray";
  let editingInfo = null; // { sectionId, setId }
  
  // ====== Helpers ======
  function openModal(modalEl) {
    backdrop.classList.remove("hidden");
    modalEl.classList.remove("hidden");
  }
  
  function closeAllModals() {
    backdrop.classList.add("hidden");
    document.querySelectorAll(".modal").forEach((m) => m.classList.add("hidden"));
  }
  
  function findSet(sectionId, setId) {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return {};
    const set = section.sets.find((st) => st.id === setId);
    return { section, set };
  }
  
  // ====== Render dashboard ======
  function renderDashboard(filterText = "") {
    const q = filterText.toLowerCase().trim();
    sectionsContainer.innerHTML = "";
  
    sections.forEach((section) => {
      const visibleSets = section.sets.filter((set) => {
        if (!q) return true;
        return (
          set.title.toLowerCase().includes(q) ||
          set.description.toLowerCase().includes(q)
        );
      });
  
      if (visibleSets.length === 0) return;
  
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "section";
  
      const header = document.createElement("div");
      header.className = "section-header";
      if (section.color === "blue") {
        header.classList.add("section-header--blue");
      }
  
      const titleWrap = document.createElement("div");
      titleWrap.className = "section-header__title";
      titleWrap.textContent = section.name;
  
      const menu = document.createElement("div");
      menu.className = "section-header__menu";
      menu.textContent = "⋮";
  
      header.appendChild(titleWrap);
      header.appendChild(menu);
  
      const body = document.createElement("div");
      body.className = "section-body";
  
      visibleSets.forEach((set) => {
        const card = document.createElement("article");
        card.className = "set-card";
  
        const topRow = document.createElement("div");
        topRow.className = "set-card__top";
  
        const title = document.createElement("div");
        title.className = "set-card__title";
        title.textContent = set.title;
  
        const cardMenu = document.createElement("div");
        cardMenu.className = "set-card__menu";
        cardMenu.textContent = "⋮";
  
        topRow.appendChild(title);
        topRow.appendChild(cardMenu);
  
        const desc = document.createElement("p");
        desc.className = "set-card__description";
        desc.textContent = set.description;
  
        const bottomRow = document.createElement("div");
        bottomRow.className = "set-card__bottom";
  
        const termsBadge = document.createElement("span");
        termsBadge.className = "badge badge-terms";
        termsBadge.textContent = `${set.termsCount} terms`;
  
        const publicBadge = document.createElement("span");
        publicBadge.className = "badge badge-public";
        publicBadge.textContent = set.visibility;
  
        bottomRow.appendChild(termsBadge);
        bottomRow.appendChild(publicBadge);
  
        card.appendChild(topRow);
        card.appendChild(desc);
        card.appendChild(bottomRow);
  
        // Open edit modal when clicking the card
        card.addEventListener("click", () => {
          openEditSetModal(section.id, set.id);
        });
  
        body.appendChild(card);
      });
  
      sectionDiv.appendChild(header);
      sectionDiv.appendChild(body);
      sectionsContainer.appendChild(sectionDiv);
    });
  }
  
  // ====== Search handling ======
  function handleSearch() {
    const text1 = globalSearchInput.value || "";
    const text2 = setSearchInput.value || "";
    const combined = (text1 + " " + text2).trim();
    renderDashboard(combined);
  }
  
  globalSearchInput.addEventListener("input", handleSearch);
  setSearchInput.addEventListener("input", handleSearch);
  
  // ====== Add Section modal logic ======
  sectionTitleInput.addEventListener("input", () => {
    sectionTitleCount.textContent = sectionTitleInput.value.length;
  });
  
  colorDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      colorDots.forEach((d) => d.classList.remove("color-dot--selected"));
      dot.classList.add("color-dot--selected");
      selectedSectionColor = dot.dataset.color || "gray";
    });
  });
  
  addSectionBtn.addEventListener("click", () => {
    sectionTitleInput.value = "";
    sectionTitleCount.textContent = "0";
    selectedSectionColor = "gray";
    colorDots.forEach((d) => d.classList.remove("color-dot--selected"));
    openModal(addSectionModal);
  });
  
  sectionAddConfirm.addEventListener("click", () => {
    const name = sectionTitleInput.value.trim();
    if (!name) {
      alert("Please enter a section title.");
      return;
    }
  
    const color = selectedSectionColor === "blue" ? "blue" : "gray";
  
    sections.push({
      id: `section-${Date.now()}`,
      name,
      color,
      sets: [],
    });
  
    closeAllModals();
    renderDashboard();
  });
  
  // ====== Create Set modal logic ======
  createTitleInput.addEventListener("input", () => {
    createTitleCount.textContent = createTitleInput.value.length;
  });
  
  createDescInput.addEventListener("input", () => {
    createDescCount.textContent = createDescInput.value.length;
  });
  
  createSetBtn.addEventListener("click", () => {
    createTitleInput.value = "";
    createDescInput.value = "";
    createTitleCount.textContent = "0";
    createDescCount.textContent = "0";
    createMakePublic.checked = false;
    openModal(createSetModal);
  });
  
  createSetConfirm.addEventListener("click", () => {
    const title = createTitleInput.value.trim();
    const description = createDescInput.value.trim();
  
    if (!title) {
      alert("Please enter a title for the flashcard set.");
      return;
    }
  
    const visibility = createMakePublic.checked ? "Public" : "Private";
  
    const targetSection = sections[0]; // put new sets in Unassigned by default
    targetSection.sets.push({
      id: `set-${Date.now()}`,
      title,
      description,
      termsCount: 0,
      visibility,
    });
  
    closeAllModals();
    renderDashboard();
  });
  
  // ====== Edit Set modal logic ======
  function openEditSetModal(sectionId, setId) {
    const { section, set } = findSet(sectionId, setId);
    if (!section || !set) return;
  
    editingInfo = { sectionId, setId };
  
    editSetTitleLabel.textContent = set.title;
    editTitleInput.value = set.title;
    editDescInput.value = set.description;
    editMakePublic.checked = set.visibility === "Public";
  
    editTitleCount.textContent = editTitleInput.value.length;
    editDescCount.textContent = editDescInput.value.length;
  
    openModal(editSetModal);
  }
  
  editTitleInput.addEventListener("input", () => {
    editTitleCount.textContent = editTitleInput.value.length;
  });
  
  editDescInput.addEventListener("input", () => {
    editDescCount.textContent = editDescInput.value.length;
  });
  
  editSetConfirm.addEventListener("click", () => {
    if (!editingInfo) return;
  
    const { section, set } = findSet(
      editingInfo.sectionId,
      editingInfo.setId
    );
    if (!section || !set) return;
  
    const newTitle = editTitleInput.value.trim();
    const newDesc = editDescInput.value.trim();
  
    if (!newTitle) {
      alert("Title cannot be empty.");
      return;
    }
  
    set.title = newTitle;
    set.description = newDesc;
    set.visibility = editMakePublic.checked ? "Public" : "Private";
  
    closeAllModals();
    renderDashboard();
  });
  
  // Delete flow
  editDeleteBtn.addEventListener("click", () => {
    if (!editingInfo) return;
  
    const { section, set } = findSet(
      editingInfo.sectionId,
      editingInfo.setId
    );
    if (!section || !set) return;
  
    deleteSetName.textContent = set.title;
    deleteSectionName.textContent = section.name;
  
    closeAllModals(); // close edit modal first
    openModal(deleteSetModal);
  });
  
  deleteSetConfirm.addEventListener("click", () => {
    if (!editingInfo) return;
  
    const sectionIndex = sections.findIndex(
      (s) => s.id === editingInfo.sectionId
    );
    if (sectionIndex === -1) return;
  
    const section = sections[sectionIndex];
    const setIndex = section.sets.findIndex(
      (st) => st.id === editingInfo.setId
    );
    if (setIndex === -1) return;
  
    section.sets.splice(setIndex, 1);
  
    closeAllModals();
    renderDashboard();
  });
  
  // ====== Shared Cancel buttons ======
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });
  
  // (Optional) clicking on dark backdrop closes modal
  backdrop.addEventListener("click", closeAllModals);
  
  // ====== Initial render ======
  renderDashboard();
  