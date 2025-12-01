import { openLeaveStudyWarningModal } from "./leaveStudyWarningModal.js";
import { openRenameSubsetModal } from "./renameSubsetModal.js";
import { openDeleteSectionModal } from "./openDeleteConfirmationModal.js";

const cards = [
  { term: "Term 1", definition: "Definition 1" },
  { term: "Term 2", definition: "Definition 2" },
  { term: "Term 3", definition: "Definition 3" },
  { term: "Term 4", definition: "Definition 4" }
];

let index = 0;
const total = cards.length;

let frontSide = "term";
let showingSide = "term";

const counter = document.getElementById("counter");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const flipBtn = document.getElementById("flip-btn");
const termFirstBtn = document.getElementById("term-first-btn");
const definitionFirstBtn = document.getElementById("definition-first-btn");

const restartBtn = document.querySelector(".restart-btn");
const exitBtn = document.querySelector(".exit-btn");

const termTextEl = document.getElementById("term-text");
const definitionTextEl = document.getElementById("definition-text");
const termSideEl = document.querySelector(".flashcard-term");
const definitionSideEl = document.querySelector(".flashcard-definition");

const subsetModal = document.getElementById("subsetOptionsModal");
const subsetMenuButtons = document.querySelectorAll(
  ".subset-menu-btn, .subset-card-menu-btn"
);

const addToBtn = document.getElementById("add-to-btn");
const addToModal = document.getElementById("addToModal");
const editSubsetBtn = document.getElementById("editSubset");
const renameSubsetBtn = document.getElementById("renameSubset");
const deleteSubsetBtn = document.getElementById("deleteSubset");
const cardEditBtn = document.querySelector(".edit-btn");

let currentSubsetName = "Not confident";
let currentSubsetCard = null;
const setTitle = "CECS 448 Midterm 2";

function renderCard() {
  const card = cards[index];
  termTextEl.textContent = card.term;
  definitionTextEl.textContent = card.definition;
  counter.textContent = `${index + 1} of ${total}`;

  if (showingSide === "term") {
    termSideEl.classList.remove("hidden");
    definitionSideEl.classList.add("hidden");
  } else {
    termSideEl.classList.add("hidden");
    definitionSideEl.classList.remove("hidden");
  }
}

function setFrontSide(side) {
  frontSide = side;
  showingSide = side;
  termFirstBtn.classList.toggle("active", side === "term");
  definitionFirstBtn.classList.toggle("active", side === "definition");
  renderCard();
}

if (prevBtn) {
  prevBtn.onclick = () => {
    if (index > 0) {
      index--;
      showingSide = frontSide;
      renderCard();
    }
  };
}

if (nextBtn) {
  nextBtn.onclick = () => {
    if (index < total - 1) {
      index++;
      showingSide = frontSide;
      renderCard();
    }
  };
}

if (flipBtn) {
  flipBtn.onclick = () => {
    showingSide = showingSide === "term" ? "definition" : "term";
    renderCard();
  };
}

if (termFirstBtn) {
  termFirstBtn.onclick = () => setFrontSide("term");
}

if (definitionFirstBtn) {
  definitionFirstBtn.onclick = () => setFrontSide("definition");
}

if (restartBtn) {
  restartBtn.onclick = () => {
    index = 0;
    showingSide = frontSide;
    renderCard();
  };
}

if (exitBtn) {
  exitBtn.onclick = () => {
    window.location.href = "../pages/home.html";
  };
}

if (subsetModal && subsetMenuButtons.length > 0) {
  subsetMenuButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (addToModal) addToModal.classList.add("hidden");

      const card = btn.closest(".subset-card");
      if (card) {
        currentSubsetCard = card;
        const titleEl = card.querySelector(".subset-title");
        if (titleEl) {
          currentSubsetName = titleEl.textContent.trim();
        }
      }

      subsetModal.classList.toggle("hidden");
    });
  });
}

if (addToBtn && addToModal) {
  addToBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (subsetModal) subsetModal.classList.add("hidden");
    addToModal.classList.toggle("hidden");
  });
}

if (renameSubsetBtn) {
  renameSubsetBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (subsetModal) subsetModal.classList.add("hidden");

    openRenameSubsetModal(
      currentSubsetName,
      currentSubsetName,
      (newTitle) => {
        if (currentSubsetCard) {
          const titleEl = currentSubsetCard.querySelector(".subset-title");
          if (titleEl) {
            titleEl.textContent = newTitle;
          }
        }
        currentSubsetName = newTitle;
      },
      "subset"
    );
  });
}

if (editSubsetBtn) {
  editSubsetBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (subsetModal) subsetModal.classList.add("hidden");

    openLeaveStudyWarningModal(currentSubsetName, setTitle, () => {
      console.log("Leave study session to edit subset:", currentSubsetName);
    });
  });
}

if (cardEditBtn) {
  cardEditBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    openLeaveStudyWarningModal(currentSubsetName, setTitle, () => {
      console.log("Leave study session to edit card in subset:", currentSubsetName);
    });
  });
}

if (deleteSubsetBtn) {
  deleteSubsetBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (subsetModal) subsetModal.classList.add("hidden");

    const subsetName = currentSubsetName;

    openDeleteSectionModal(subsetName, () => {
      if (currentSubsetCard) {
        currentSubsetCard.remove();
        currentSubsetCard = null;
      }
      console.log("Deleted subset:", subsetName);
    });
  });
}

document.addEventListener("click", (e) => {
  if (subsetModal && !subsetModal.contains(e.target)) {
    subsetModal.classList.add("hidden");
  }

  if (
    addToModal &&
    !addToModal.contains(e.target) &&
    !(addToBtn && addToBtn.contains(e.target))
  ) {
    addToModal.classList.add("hidden");
  }
});

renderCard();