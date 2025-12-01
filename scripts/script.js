// ===== Fake dashboard data =====
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
      ],
    },
    {
      id: "c448",
      name: "CECS 448",
      color: "blue",
      sets: [
        {
          id: "set3",
          title: "CECS 448 Midterm 2",
          description:
            "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
          termsCount: 20,
          visibility: "Public",
        },
        {
          id: "set4",
          title: "CECS 448 Midterm 2",
          description:
            "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
          termsCount: 20,
          visibility: "Public",
        },
      ],
    },
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    // DOM refs
    const sectionsContainer = document.getElementById("sections-container");
    const globalSearchInput = document.getElementById("global-search");
    const setSearchInput = document.getElementById("set-search");
    const addSectionBtn = document.getElementById("add-section-btn");
    const createSetBtn = document.getElementById("create-set-btn");
  
    const backdrop = document.getElementById("modal-backdrop");
    const addSectionModal = document.getElementById("add-section-modal");
    const createSetModal = document.getElementById("create-set-modal");
    const deleteSetModal = document.getElementById("delete-set-modal");
  
    const sectionTitleInput = document.getElementById("section-title-input");
    const sectionTitleCount = document.getElementById("section-title-count");
    const sectionAddConfirm = document.getElementById("section-add-confirm");
    const colorDots = document.querySelectorAll(".color-dot");
  
    const createTitleInput = document.getElementById("create-title-input");
    const createTitleCount = document.getElementById("create-title-count");
    const createDescInput = document.getElementById("create-desc-input");
    const createDescCount = document.getElementById("create-desc-count");
    const createMakePublic = document.getElementById("create-make-public");
    const createSetConfirm = document.getElementById("create-set-confirm");
  
    const deleteSetName = document.getElementById("delete-set-name");
    const deleteSectionName = document.getElementById("delete-section-name");
    const deleteSetConfirm = document.getElementById("delete-set-confirm");
  
    let selectedSectionColor = "gray";
    let deleteTarget = null; // { sectionId, setId }
  
    // Helpers
    function openModal(modalEl) {
      backdrop.classList.remove("hidden");
      modalEl.classList.remove("hidden");
    }
  
    function closeAllModals() {
      backdrop.classList.add("hidden");
      [addSectionModal, createSetModal, deleteSetModal].forEach((m) =>
        m.classList.add("hidden")
      );
      deleteTarget = null;
    }
  
    function findSet(sectionId, setId) {
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return {};
      const set = section.sets.find((st) => st.id === setId);
      return { section, set };
    }
  
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
        header.textContent = section.name;
  
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
  
          const cardMenu = document.createElement("button");
          cardMenu.type = "button";
          cardMenu.className = "set-card__menu";
          cardMenu.textContent = "⋮";
  
          // Clicking dots: open delete confirmation
          cardMenu.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteTarget = { sectionId: section.id, setId: set.id };
            deleteSetName.textContent = set.title;
            deleteSectionName.textContent = section.name;
            openModal(deleteSetModal);
          });
  
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
  
          // Clicking the card (not the dots) → go to add flashcards
          card.addEventListener("click", () => {
            window.location.href = "add-flashcards.html";
          });
  
          body.appendChild(card);
        });
  
        sectionDiv.appendChild(header);
        sectionDiv.appendChild(body);
        sectionsContainer.appendChild(sectionDiv);
      });
    }
  
    // Search
    function handleSearch() {
      const t1 = globalSearchInput.value || "";
      const t2 = setSearchInput.value || "";
      renderDashboard((t1 + " " + t2).trim());
    }
  
    globalSearchInput.addEventListener("input", handleSearch);
    setSearchInput.addEventListener("input", handleSearch);
  
    // Add section modal
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
        id: "section-" + Date.now(),
        name,
        color,
        sets: [],
      });
  
      closeAllModals();
      renderDashboard();
    });
  
    // Create set modal
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
        alert("Please enter a title.");
        return;
      }
  
      const visibility = createMakePublic.checked ? "Public" : "Private";
      const targetSection = sections[0];
  
      targetSection.sets.push({
        id: "set-" + Date.now(),
        title,
        description,
        termsCount: 0,
        visibility,
      });
  
      closeAllModals();
      renderDashboard();
    });
  
    // Delete set confirm
    deleteSetConfirm.addEventListener("click", () => {
      if (!deleteTarget) return;
      const { sectionId, setId } = deleteTarget;
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return;
  
      const idx = section.sets.findIndex((s) => s.id === setId);
      if (idx === -1) return;
  
      section.sets.splice(idx, 1);
      closeAllModals();
      renderDashboard();
    });
  
    // Cancel buttons & backdrop
    document
      .querySelectorAll("[data-close-modal]")
      .forEach((btn) => btn.addEventListener("click", closeAllModals));
  
    backdrop.addEventListener("click", closeAllModals);
  
    // Initial load
    closeAllModals();
    renderDashboard();
  });
  