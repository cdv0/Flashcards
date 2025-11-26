
import { syncSectionsFromDOM, refreshSectionSelect } from './state.js';
import { setupAddSectionModal } from './addSectionModal.js';
import { setupCreateSetModal, createFlashcardSet } from './createSetModal.js';
import { setupSectionAndCardMenus } from './menus.js';

 const exampleSets = [
  {
    title: "CECS 456 Final",
    description: "Study guide for Machine Learning final on December 16, 2025.",
    sectionId: "unassigned",
    makePublic: false,
    termCount: 20
  },
  {
    title: "CECS 448 Midterm 2",
    description: "This flashcard set is to help study for CECS 448 Midterm 2 on December 9th.",
    sectionId: "section-448",
    makePublic: true,
    termCount: 20
  }
];


document.addEventListener('DOMContentLoaded', () => {
  syncSectionsFromDOM();
  refreshSectionSelect();

exampleSets.forEach(set => createFlashcardSet(set));
  setupAddSectionModal();
  setupCreateSetModal();
  setupSectionAndCardMenus();
});
